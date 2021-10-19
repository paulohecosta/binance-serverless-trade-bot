const BB = require('technicalindicators').BollingerBands;
const MFI = require('technicalindicators').MFI;


const getBollingerBandsCurve = (dataSet, stdDev = 2, periods = 14) => {
    const priceSet = dataSet.map(el => el.price);
    var input = {
        period: periods,
        values: priceSet,
        stdDev: stdDev
    }
    const result = BB.calculate(input);
    const newSet = dataSet.slice(result.length * -1);
    
    for (var i in newSet) {
        newSet[i]['middle'] = result[i].middle;
        newSet[i]['upper'] = result[i].upper;
        newSet[i]['lower'] = result[i].lower;
        
    }
    return {
        lastLower: result[result.length-1].lower,
        lastUpper: result[result.length-1].upper,
        middles: newSet.map(el => { return [el.current_timestamp, el.middle] }),
        uppers: newSet.map(el => { return [el.current_timestamp, el.upper] }),
        lowers: newSet.map(el => { return [el.current_timestamp, el.lower] }),
    };
}

const getMFIIndicators = (dataSet, periods = 14) => {
    const input = {
        high: dataSet.map(el => el.high),
        low: dataSet.map(el => el.low),
        close: dataSet.map(el => el.close),
        volume: dataSet.map(el => el.volume),
        period: periods
    }
    const result = MFI.calculate(input);
    const newSet = dataSet.slice(result.length * -1);
    for (var i in newSet) {
        newSet[i]['mfi'] = result[i];
    }
    return {
        lastMFI: result[result.length-1],
        mfis: newSet.map(el => { return [el.current_timestamp, el.mfi] })
    };
}

const findPullBackCoef = (currentValue, min, max) => {
    if (max != min) {
        return ((currentValue - min) / (max - min));
    } else {
        return 1.0;
    }
}

// never use newPbCoef as 0.0 or less
const getLastBuyPointer = (dataSet, pbCoef = 0.38, newPbCoef = 0.2, decliveLimit = -0.05) => {

    const basePointers = [];
    const buyPointers = [];
    const maxPointers = [];

    var lastPbPointer = dataSet[0].current_timestamp;
    var lastPbPrice = dataSet[0].price;
    var lastPrice = dataSet[0].price;
    var lastBehindPrice = dataSet[0].price;
    var lastMin = dataSet[0].price;
    var lastMax = dataSet[0].price;
    var lastTrueMax = dataSet[0].price;
    var isBuyingLastOption = false;
    var buyPointer = {
        current_timestamp: null,
        price: null
    };
    basePointers.push([lastPbPointer, lastPrice]);

    dataSet.forEach(el => {
        // update info before 
        // 1.005 is a 0.5% of tolerance
        // since we can assume a little growth after a new base point
        if (el.price > lastMax && el.price > (lastPbPrice * 1.005)) {
            lastTrueMax = el.price;
            maxPointers.push([el.current_timestamp, el.price]);
        }
        lastMin = el.price < lastMin ? el.price : lastMin;
        lastMax = el.price > lastMax ? el.price : lastMax;
        lastPrice = el.price;
        // get coeficients
        const decliveCoef = getGrowthCoef(lastTrueMax, el.price);
        const coef = findPullBackCoef(lastPrice, lastMin, lastMax);
        // do decisions
        if (coef < pbCoef && decliveCoef < decliveLimit && lastPrice > (lastBehindPrice * 0.99)) {
            isBuyingLastOption = true;
            buyPointer = {
                price: el.price,
                current_timestamp: el.current_timestamp
            }
            buyPointers.push([el.current_timestamp, el.price]);
        } else {
            isBuyingLastOption = false;
            buyPointer = {
                price: el.price,
                current_timestamp: el.current_timestamp
            }
        }
        if (coef < newPbCoef) {
            lastMin = el.price;
            lastMax = el.price;
            lastPbPointer = el.current_timestamp;
            lastPbPrice = el.price;
            basePointers.push([el.current_timestamp, el.price]);
        }
        lastBehindPrice = el.price;
    });

    return {
        isBuyingLastOption,
        buyPointer,
        // debugging variables
        basePointers,
        buyPointers,
        maxPointers
    };
}

// TESTED
const sliceByTimestamp = (dataSet, timestamp) => {
    var filtered = dataSet.filter(el => {
        return el.current_timestamp >= timestamp;
    });
    return filtered;
}

// TESTED
const getMinMaxPrices = (dataSet) => {
    var lowest = Number.POSITIVE_INFINITY;
    var highest = Number.NEGATIVE_INFINITY;
    var tmp;
    for (var i = dataSet.length - 1; i >= 0; i--) {
        tmp = dataSet[i].price;
        if (tmp < lowest) lowest = tmp;
        if (tmp > highest) highest = tmp;
    }
    return {
        lowest,
        highest
    }
}

const getGrowthCoef = (olderValue, newValue) => {
    return (newValue - olderValue) / olderValue;
}

const getSellingArea = (bougthPoint, lastDataSetItem, highest, minProfitCoef = 0.1) => {

    const coef = findPullBackCoef(lastDataSetItem.price, bougthPoint.price, highest);
    const growth = getGrowthCoef(bougthPoint.price, lastDataSetItem.price);

    var isInsideSellingArea = false;
    var sellPointer = {
        price: null,
        current_timestamp: null,
        coef: coef,
        growth_coef: growth
    };
    var maxCoef = 0.87;
    if (growth < 0.02) {
        maxCoef = 0.92;
    } else if (growth < 0.04) {
        maxCoef = 0.82;
    }
    if (coef < maxCoef && growth > minProfitCoef) {
        // if (growth > minProfitCoef) {
        isInsideSellingArea = true;
        sellPointer = {
            price: lastDataSetItem.price,
            current_timestamp: lastDataSetItem.current_timestamp,
            coef: coef,
            growth_coef: growth
        }
    }

    return {
        isInsideSellingArea,
        sellPointer
    }
}

module.exports = {
    getLastBuyPointer,
    getSellingArea,
    getMinMaxPrices,
    sliceByTimestamp,
    getGrowthCoef,
    getBollingerBandsCurve,
    getMFIIndicators
}