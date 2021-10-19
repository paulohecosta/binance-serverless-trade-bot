const Binance = require('node-binance-api');

let instance = null;
let minimums = {};
class BinanceManager {
    constructor() {
        this.client = Binance({
            APIKEY: process.env.BINANCE_API_KEY,
            APISECRET: process.env.BINANCE_API_SECRET
        })
        // test: true
    }
    static getInstance() {
        if (!instance) {
            instance = new BinanceManager();
        }
        return instance;
    }
    async getAccountInfo() {
        return await this.client.balance();
    }
    async getDepth(symbol) {
        return await this.client.depth(symbol);
    }
    async getCurrentPrices() {
        return await this.client.prices();
    }
    async getSpotExchangeInfo(coin, swapCoin) {
        if(minimums[coin+swapCoin] && minimums[coin+swapCoin].status == 'TRADING') {
            console.log('Getting exchange info from cache');
        } else {
            console.log('Getting exchange info from service');
            const infos = await this.client.exchangeInfo();
            for (let obj of infos.symbols) {
                let filters = { status: obj.status };
                for (let filter of obj.filters) {
                    if (filter.filterType == "MIN_NOTIONAL") {
                        filters.minNotional = filter.minNotional;
                    } else if (filter.filterType == "PRICE_FILTER") {
                        filters.minPrice = filter.minPrice;
                        filters.maxPrice = filter.maxPrice;
                        filters.tickSize = filter.tickSize;
                    } else if (filter.filterType == "LOT_SIZE") {
                        filters.stepSize = filter.stepSize;
                        filters.minQty = filter.minQty;
                        filters.maxQty = filter.maxQty;
                    }
                }
                filters.orderTypes = obj.orderTypes;
                filters.icebergAllowed = obj.icebergAllowed;
                minimums[obj.symbol] = filters;
            }
        }
        return minimums[coin+swapCoin];
    }
    async buyAtMarketPrice(coin, swapCoin, quantity) {
        return await this.client.marketBuy(coin + swapCoin, quantity);
    }
    async sellAtMarketPrice(coin, swapCoin, quantity) {
        return await this.client.marketSell(coin + swapCoin, quantity);
    }
    async useServerTime() {
        return await this.client.useServerTime();
    }
    async getOneDayPastData(pair, startTime, limit=96, space='15m') {
        return await this.client.candlesticks(pair, space, null, {limit: limit, startTime: startTime});
    }
    async getLastShiftData(pair, limit=288, laspe="15m") {
        return await this.client.candlesticks(pair, laspe, null, {limit: limit});
    }
}

module.exports = BinanceManager;