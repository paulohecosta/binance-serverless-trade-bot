const moment = require('moment');

const createResponse = (data, statusCode) => {
    return {
        statusCode: statusCode || 200,
        body: JSON.stringify(data)
    };
}

const cleanCoinMarketResults = (data) => {
    const jsonData = data.data;
    var result = [];

    for(var i in jsonData) {
        result.push(jsonData[i]);
    }

    const cleanRecords = result.map(el => {
        return {
            symbol: el.symbol,
            price: el.quote.USDT.price,
            current_timestamp: moment().unix(),
            createdAt: moment().toDate()
        }
    });
    return cleanRecords;
}

const cleanBianceDepths = (symbol, depths) => {
    allDepths = [];
    Object.keys(depths.bids).forEach(el => {
        allDepths.push({
            operation: 1,
            price: el,
            quantity: depths.bids[el]
        });
    });
    Object.keys(depths.asks).forEach(el => {
        allDepths.push({
            operation: -1,
            price: el,
            quantity: depths.bids[el],
        });
    });

    return {
        symbol: symbol,
        current_timestamp: moment().unix(),
        createdAt: moment().toDate(),
        depths: allDepths
    };
}

const getGrowthRate = (order, price) => {
    const priceVal = price;
    const buyPrice = order.value;
    console.log(`BUY ${buyPrice} and NOW ${priceVal}`);
    return (priceVal - buyPrice) / buyPrice;
}

module.exports = {
    createResponse,
    cleanCoinMarketResults,
    cleanBianceDepths,
    getGrowthRate
}