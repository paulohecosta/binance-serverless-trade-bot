const BinanceManagerSgton = require('/opt/service/binance-manager');
const TelegramBotManager = require('/opt/service/telegram-manager');
const apiHelper = require('/opt/helper/api-helper');
const binHelper = require('/opt/helper/binance-helper');
const mathHelper = require('/opt/helper/math-helper');
const dbService = require('/opt/service/dynamo-manager');

const mockResponse = () => {
    return {}
}

const coinBuyProcess = async (coin, swapCoin, currentCoin, openOrders) => {
    const binance = BinanceManagerSgton.getInstance();

    // Check open orders
    if (openOrders.length > 0 && openOrders.includes(coin)) {
        console.log(`Coin ${coin} has open order...`);
        return false;
    }
    // Download data from Binance
    var resultDf = await binance.getLastShiftData(coin+swapCoin, process.env.BUY_PERIODS);
    var df = binHelper.createDataSetFromCandles(resultDf);
    df.push(currentCoin);

    // Sort dataset
    df.sort(function (a, b) {
        return a.current_timestamp - b.current_timestamp;
    });

    // Run estimator
    const {
        isBuyingLastOption,
        buyPointer
    } = mathHelper.getLastBuyPointer(df, process.env.BUY_COEF, process.env.BUY_CURVE_COEF, process.env.BUY_DECLIVE_COEF);

    // Final decisions
    if (!isBuyingLastOption) {
        console.log(`Coin ${coin} is not a good option to buy right now...`);
        return false;
    } else {
        // Save in open orders table
        console.log(`Coin ${coin} will be bougth...`);
        const excInfo = await binance.getSpotExchangeInfo(coin, swapCoin);
        const quantity = binHelper.getBuyingCoinValue(buyPointer, excInfo);
        
        await binance.buyAtMarketPrice(coin, swapCoin, quantity);
        await dbService.createNewTrade(buyPointer, coin, swapCoin);

        return true;
    }

}

const lambdaHandler = async () => {

    await dbService.getConfig();
    const binance = BinanceManagerSgton.getInstance();
    const telegram = TelegramBotManager.getInstance();
    const coins = process.env.TRADE_COINS.split(',');

    const swapCoin = process.env.SWAP_COIN;
    // Check if I have money to Buy something... first of all
    // Fix 'balanceData error', {}
    await binance.useServerTime();
    const balance = await binance.getAccountInfo();
    const swapWallet = binHelper.getSwapCoinWallet(balance, swapCoin);

    // swapWallet.buyCounter = 5;

    if (swapWallet.buyCounter > 0 && process.env.BUY_TOOGLE == 'ON') {
        // get all prices
        const prices = await binance.getCurrentPrices();
        const openOrders = (await dbService.getOpenTrades()).map(el => el.symbol);

        for (let c in coins) {
            if (swapWallet.buyCounter > 0) {
                const currentTime = Math.round(Date.now() / 1000);
                const currentPrice = parseFloat(prices[`${coins[c]}${swapCoin}`]);
                const currentCoin = {
                    price: currentPrice,
                    current_timestamp: currentTime
                };
                try {
                    const traded = await coinBuyProcess(coins[c], swapCoin, currentCoin, openOrders);
                    if (traded) {
                        await telegram.sendMessage(`Bougth ${coins[c]} with price ${currentCoin.price}! :0`);
                        console.log('One more buy in this turn...');
                        swapWallet.buyCounter--;
                    }
                } catch (error) {
                    await telegram.sendMessage(`An error has ocurred while trying to buy ${coins[c]}`);
                    console.error(JSON.stringify(error));
                }
            } else {
                console.log('No money to buy anything after some rounds....');
            }
        }
    } else {
        console.log('No money to buy anything or BUY_TOOGLE is not ON ....');
    }

    return apiHelper.createResponse(mockResponse(), 200);
}

module.exports = {
    lambdaHandler
}