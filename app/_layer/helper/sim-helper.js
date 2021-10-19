const slicePastDataFrame = (dataSet, callback) => {
    for (var i = 1; i < dataSet.length; i++) {
        const newDataSet = dataSet.slice(0, i);
        const nextItem = dataSet[i];
        callback(newDataSet, nextItem);
    }
}

const slicePastDataFrameShifted = (dataSet, shift, callback) => {
    for (var i = 0; i <= dataSet.length - shift; i++) {
        const newDataSet = dataSet.slice(i, i + shift);
        callback(newDataSet);
    }
}

const returnTokenConversion = (currentTradeCoin, currentPrice, taxes = 0.998) => {
    return currentTradeCoin / currentPrice * taxes;
}

const returnTradeCoinConversion = (currentToken, currentPrice, taxes = 0.998) => {
    return currentToken * currentPrice * taxes;
}

const sleepSimulation = (ms) => {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

module.exports = {
    slicePastDataFrame,
    slicePastDataFrameShifted,
    returnTokenConversion,
    returnTradeCoinConversion,
    sleepSimulation
}