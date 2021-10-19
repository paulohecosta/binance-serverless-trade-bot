const BinanceManagerSgton = require('/opt/service/binance-manager');
const TelegramBotManager = require('/opt/service/telegram-manager');
const dbService = require('/opt/service/dynamo-manager');
const apiHelper = require('/opt/helper/api-helper');
const mathHelper = require('/opt/helper/math-helper');
const binHelper = require('/opt/helper/binance-helper');

const mockResponse = () => {
    return {}
}

const tryToSellSomeCoinWithFibo = async (order, currentPrices, balance) => {

    const binance = BinanceManagerSgton.getInstance();
    const telegram = TelegramBotManager.getInstance();
    
    console.log(`Analysing ${order.symbol}${order.swap_coin}`);
    const currentTime = Math.round(Date.now() / 1000);
    const currentPrice = parseFloat(currentPrices[`${order.symbol}${order.swap_coin}`]);
    console.log(`Current price: ${currentPrice}`);

    const currentCoin = {
        price: currentPrice,
        current_timestamp: currentTime
    };

    const {
        isInsideSellingArea,
        sellPointer
    } = mathHelper.getSellingArea(order, currentCoin, order.top_price, process.env.SELL_COEF);
    if (isInsideSellingArea) {
        console.log(`Starting to sell ${order.symbol} at ${(sellPointer.growth_coef*100).toFixed(3)}% and fibo=${sellPointer.coef.toFixed(3)}!`);
        try {
            const excInfo = await binance.getSpotExchangeInfo(order.symbol, order.swap_coin);
            const quantity = binHelper.getSellingCoinWallet(balance, order.symbol, excInfo);
            console.log(`Quantity to sell ${quantity}!`);
            await binance.sellAtMarketPrice(order.symbol, order.swap_coin, quantity);
            await dbService.closeOpenTrades(order, sellPointer.growth_coef);
            await telegram.sendMessage(`Sold ${order.symbol} with price ${currentPrice} and made a growth of ${(sellPointer.growth_coef*100).toFixed(3)}% XD`);
        } catch (error) {
            await telegram.sendMessage(`An error has ocurred while trying to sell ${order.symbol}`);
            console.error(JSON.stringify(error));
        }
    } else {
        var topPrice = order.top_price;
        if(currentCoin.price > order.top_price) {
            topPrice = currentCoin.price;
            console.log(`Updating top price from ${order.top_price} to ${topPrice}`);
        }
        await dbService.updateOpenTrades(order, currentPrice, topPrice);
        console.log(`Cannot sell ${order.symbol} at ${(sellPointer.growth_coef*100).toFixed(3)}% and fibo=${sellPointer.coef.toFixed(3)} rigth now...`);
    }
}

const lambdaHandler = async () => {
    await dbService.getConfig();
    const binance = BinanceManagerSgton.getInstance();
    const orders = await dbService.getOpenTrades();

    if (orders.length > 0 && process.env.SELL_TOOGLE == 'ON') {
        const currentPrices = await binance.getCurrentPrices();
        const balance = await binance.getAccountInfo();
        for (let o in orders) {
            try {
                await tryToSellSomeCoinWithFibo(orders[o], currentPrices, balance);
            } catch (error) {
                console.error(JSON.stringify(error));
            }
        }
    } else {
        console.log("No orders to sell or sell toogle is not ON");
    }
    return apiHelper.createResponse(mockResponse(), 200);
}

module.exports = {
    lambdaHandler
}