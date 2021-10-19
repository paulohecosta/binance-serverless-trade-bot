const getSwapCoinWallet = (balance, swapCoin) => {
    const wallet = balance[swapCoin];
    const available = parseFloat(wallet['available']);
    const buyCounter = Math.floor(available / process.env.SWAP_VALUE);
    return {
        wallet,
        available,
        buyCounter
    }
}

const getSellingCoinWallet = (balance, coin, excInfo) => {
    const wallet = balance[coin];
    const available = parseFloat(wallet['available']);
    const minQty = parseFloat(excInfo['minQty']);
    const rounded = Math.floor(available/minQty);
    // Dump fixie for floar decimal dump value
    const result = parseFloat((rounded*minQty).toPrecision(12));
    console.log(`AVAIL=${available}, MIN=${minQty}, ROUNDED_STG=${rounded}, WILL_SELL=${result}`);
    return result;
}

const getBuyingCoinValue = (buyPointer, excInfo) => {
    const quantity = process.env.SWAP_VALUE / buyPointer.price;
    const minQty = parseFloat(excInfo['minQty']);
    const rounded = Math.floor((quantity/minQty));
    const result = parseFloat((rounded*minQty).toPrecision(12));
    console.log(`QTY=${quantity}, MIN=${minQty}, ROUNDED_STG=${rounded}, WILL_BUY=${result}`);
    return result;
}

const createDataSetFromCandles = (arrayOfCandles) => {
    const df = [];
    arrayOfCandles.forEach(element => {
        let [time, open, high, low, close, volume] = element;
        df.push({
            price: parseFloat(close),
            close: parseFloat(close),
            high: parseFloat(high),
            low: parseFloat(low),
            volume: parseFloat(volume),
            current_timestamp: time,
            declive: parseFloat(close) < parseFloat(open),
            change_coef: ((parseFloat(close) / parseFloat(open))-1.0)
        });
    });
    return df;
}

module.exports = {
    getSwapCoinWallet,
    getSellingCoinWallet,
    getBuyingCoinValue,
    createDataSetFromCandles
}