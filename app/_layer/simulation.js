var LocalCache = require('node-localcache');
const fs = require('fs');
const BinanceManagerSgton = require('./service/binance-manager');
const binHelper = require('./helper/binance-helper');
const mathHelper = require('./helper/math-helper');
const simHelper = require('./helper/sim-helper');
const dbService = require('./service/dynamo-manager');
const localEnv = JSON.parse(fs.readFileSync('./env.json', 'utf8'));

process.env.BINANCE_API_KEY = localEnv.RunSimulation.BINANCE_API_KEY;
process.env.BINANCE_API_SECRET = localEnv.RunSimulation.BINANCE_API_SECRET;
process.env.TELEGRAM_TOKEN = localEnv.RunSimulation.TELEGRAM_TOKEN;
process.env.TELEGRAM_CHAT_ID = localEnv.RunSimulation.TELEGRAM_CHAT_ID;
process.env.CONFIG_TABLE = localEnv.RunSimulation.CONFIG_TABLE;
process.env.TRADES_TABLE = localEnv.RunSimulation.TRADES_TABLE;



const makeCandleSimulation = async (coins, value, symbol) => {

    coins.sort(function (a, b) {
        return a.current_timestamp - b.current_timestamp;
    });

    var openOrder = false;
    var currentToken = 0;
    var currentBougth = null;
    var lastPrice = 0;
    var lastHighPrice = 0;
    var baseValue = value;
    var currentTradeCoin = value;

    const buyPointers = [];
    const sellPointers = [];
    const allPointers = coins.map(el => { return [el.current_timestamp, el.price] });

    var shifting = process.env.BUY_PERIODS;

    simHelper.slicePastDataFrameShifted(coins, parseFloat(shifting), (df) => {
        lastPrice = df[df.length - 1].price;

        if (openOrder) {
            const {
                isInsideSellingArea,
                sellPointer
            } = mathHelper.getSellingArea(currentBougth, df[df.length - 1], lastHighPrice, 0.04);
            if (isInsideSellingArea) {
                sellPointers.push([
                    sellPointer.current_timestamp,
                    sellPointer.price
                ]);
                openOrder = false;
                currentTradeCoin += simHelper.returnTradeCoinConversion(currentToken, sellPointer.price) - baseValue;
                currentToken = 0;
            } else {
                lastHighPrice = lastHighPrice > lastPrice ? lastHighPrice : lastPrice;
            }
        } else {
            const {
                isBuyingLastOption,
                buyPointer
            } = mathHelper.getLastBuyPointer(df, 0.55, 0.2, -0.08);

            if (isBuyingLastOption) {
                buyPointers.push([
                    buyPointer.current_timestamp,
                    buyPointer.price
                ]);
                openOrder = true;
                lastHighPrice = buyPointer.price;
                currentToken = simHelper.returnTokenConversion(baseValue, buyPointer.price);
                currentBougth = buyPointer;
            }
        }
    });

    fs.writeFileSync(`./app/_layer/simresults/${symbol}_points.json`, JSON.stringify(allPointers));
    fs.writeFileSync(`./app/_layer/simresults/${symbol}_buys.json`, JSON.stringify(buyPointers));
    fs.writeFileSync(`./app/_layer/simresults/${symbol}_sells.json`, JSON.stringify(sellPointers));

    if (currentToken > 0) {
        currentTradeCoin += simHelper.returnTradeCoinConversion(currentToken, lastPrice) - baseValue;
    }

    return {
        usdt: currentTradeCoin
    };
}


const start = async () => {
    console.log('start simulation...');
    const cache = new LocalCache('./app/_layer/simresults/filetocache.json');
    await dbService.getConfig();
    const binance = BinanceManagerSgton.getInstance();

    const entries = [
        'ETH','DOGE','ADA','SOL','XRP','DOT','BTC','AVAX','LUNA','ALGO','MATIC','FIL',
        'XLM','VET','TRX','ATOM','XTZ','XMR','EOS','EGLD','XEC','NEAR','FTM',
        'HBAR','KSM','KLAY','WAVES','AXS','DASH','HNT','DCR','XEM','ZEC','CELO',
        'SHIB','QTUM','ZIL','CAKE','AAVE','FTT','LINK','UNI','HOT','NANO','CHZ'
    ];

    var allTotal = 0;
    var sumEffec = 0;

    for (let e in entries) {
        var today = new Date('2021-06-14');
        var dataSet = [];
        var startValue = 100;
        var coef = 0;
        var botCoef = 0;

        for (let yy = 0; yy < 120; yy++) {
            var tomorrow = new Date(today);
            tomorrow.setDate(today.getDate() + yy);
            const cacheKey = `${entries[e] + 'USDT'}${tomorrow.getTime()}`;
            var result;
            result = cache.getItem(cacheKey);
            if (!result) {
                result = await binance.getOneDayPastData(entries[e] + 'USDT', tomorrow.getTime());
                cache.setItem(cacheKey, result);
            }
            const df = binHelper.createDataSetFromCandles(result);
            dataSet = dataSet.concat(df);
            var first = dataSet[0].price;
            var last = dataSet[dataSet.length - 1].close;
            coef = mathHelper.getGrowthCoef(first, last);
        }
        const {
            usdt
        } = await makeCandleSimulation(dataSet, startValue, entries[e]);
        allTotal += usdt;
        botCoef = mathHelper.getGrowthCoef(100, usdt);
        sumEffec += (botCoef - coef);
        console.log(`[${entries[e]}]\tTOTAL= \t${usdt.toFixed(2)} \tBOT_GROWTH=${botCoef.toFixed(2)} \tMARKET_GROWTH=${coef.toFixed(2)} \tEFFECTIVENESS=${(botCoef - coef).toFixed(2)}`);
    }

    console.log(`ALL_TOTAL=${allTotal.toFixed(3)}`);
    console.log(`ALL_EFFECTIVENESS=${sumEffec.toFixed(2)}`);
    console.log(`ALL_GROWTH=${(mathHelper.getGrowthCoef(100 * entries.length, allTotal)).toFixed(2)}`);

}

const singleCurveValidation = async () => {
    console.log('start curve validation...');
    await dbService.getConfig();
    const binance = BinanceManagerSgton.getInstance();
    const coin = 'AVAX';
    const result = await binance.getLastShiftData(coin + 'USDT');
    const df = binHelper.createDataSetFromCandles(result);

    const {
        isBuyingLastOption,
        buyPointer,
        buyPointers,
        basePointers
    } = mathHelper.getLastBuyPointer(df, 0.38, 0.1);
    const {
        lastLower,
        lastUpper,
        middles,
        lowers,
        uppers
    } = mathHelper.getBollingerBandsCurve(df);
    const {
        lastMFI,
        mfis
    } = mathHelper.getMFIIndicators(df);

    const allPointers = df.map(el => { return [el.current_timestamp, el.price] });

    fs.writeFileSync(`./app/_layer/simresults/${coin}_points.json`, JSON.stringify(allPointers));
    fs.writeFileSync(`./app/_layer/simresults/${coin}_buys.json`, JSON.stringify(buyPointers));
    fs.writeFileSync(`./app/_layer/simresults/${coin}_bases.json`, JSON.stringify(basePointers));
    //fs.writeFileSync(`./app/_layer/simresults/${coin}_maxes.json`, JSON.stringify(maxPointers));
    fs.writeFileSync(`./app/_layer/simresults/${coin}_middles.json`, JSON.stringify(middles));
    fs.writeFileSync(`./app/_layer/simresults/${coin}_lowers.json`, JSON.stringify(lowers));
    fs.writeFileSync(`./app/_layer/simresults/${coin}_uppers.json`, JSON.stringify(uppers));
    fs.writeFileSync(`./app/_layer/simresults/${coin}_mfis.json`, JSON.stringify(mfis));
}



start();
//singleCurveValidation();