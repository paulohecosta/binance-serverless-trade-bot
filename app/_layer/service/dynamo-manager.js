const AWS = require('aws-sdk');
const uuid = require('uuid');

AWS.config.update({
    region: process.env.AWS_REGION || 'us-east-2'
});

const createItem = (tableName, obj) => {

    return new Promise((resolve, reject) => {
        const docClient = new AWS.DynamoDB.DocumentClient();
        const table = tableName;
        const params = {
            TableName: table,
            Item: obj
        };

        docClient.put(params, function (err) {
            if (err) {
                reject({ 'message': 'Unable to add item. Error JSON: ' + JSON.stringify(err, null, 2) });
            } else {
                resolve({
                    'status': 'CREATED'
                });
            }
        });
    });
}

const updateItem = (tableName, keySchema, attrsObj) => {

    return new Promise((resolve, reject) => {
        const docClient = new AWS.DynamoDB.DocumentClient();
        const table = tableName;

        const keyNames = Object.keys(attrsObj);
        const expressionObj = {};
        var updateExpression = 'set ';
        keyNames.forEach((elem, index, arr) => {
            expressionObj[':' + elem] = attrsObj[elem];
            if (index === arr.length - 1) {
                updateExpression += ' ' + elem + ' = :' + elem;
            } else {
                updateExpression += ' ' + elem + ' = :' + elem + ',';
            }
        });

        const params = {
            TableName: table,
            Key: keySchema,
            UpdateExpression: updateExpression,
            ExpressionAttributeValues: expressionObj,
            ReturnValues: 'UPDATED_NEW'
        };

        docClient.update(params, function (err) {
            if (err) {
                reject({ 'message': 'Unable to update item. Error JSON: ' + JSON.stringify(err, null, 2) });
            } else {
                resolve({
                    'status': 'UPDATED'
                });
            }
        });
    });
}

const getItem = (tableName, key) => {

    return new Promise((resolve, reject) => {
        const docClient = new AWS.DynamoDB.DocumentClient();
        const params = {
            TableName: tableName,
            Key: key
        };

        docClient.get(params, function (err, data) {
            if (err) {
                reject({ 'message': 'Unable to get item. Error JSON: ' + JSON.stringify(err, null, 2) });
            } else {
                resolve(data);
            }
        });
    });
}

const getAllItems = (tableName) => {

    return new Promise((resolve, reject) => {
        const docClient = new AWS.DynamoDB.DocumentClient();
        const params = {
            TableName: tableName
        };

        docClient.query(params, function (err, data) {
            if (err) {
                reject({ 'message': 'Unable to get item. Error JSON: ' + JSON.stringify(err, null, 2) });
            } else {
                resolve(data);
            }
        });
    });
}

const getAllScanItems = (tableName, rangeKey, rangeValue) => {
    return new Promise((resolve, reject) => {
        const docClient = new AWS.DynamoDB.DocumentClient();
        const params = {
            TableName: tableName,
            FilterExpression: '#rangeKey = :rangeValue',
            ExpressionAttributeNames: {
                '#rangeKey': rangeKey,
            },
            ExpressionAttributeValues: {
                ':rangeValue': rangeValue
            }
        };
        docClient.scan(params, function (err, data) {
            if (err) {
                reject({ 'message': 'Unable to get item. Error JSON: ' + JSON.stringify(err, null, 2) });
            } else {
                resolve(data);
            }
        });
    });
}

const getAllRangeItemsWithKey = (tableName, key, value, rangeKey, rangeValue) => {
    return new Promise((resolve, reject) => {
        const docClient = new AWS.DynamoDB.DocumentClient();
        const params = {
            TableName: tableName,
            KeyConditionExpression: "#myKey = :myKey",
            FilterExpression: '#rangeKey = :rangeValue',
            ExpressionAttributeNames: {
                '#myKey': key,
                '#rangeKey': rangeKey,
            },
            ExpressionAttributeValues: {
                ':myKey': value,
                ':rangeValue': rangeValue
            }
        };
        docClient.query(params, function (err, data) {
            if (err) {
                reject({ 'message': 'Unable to get item. Error JSON: ' + JSON.stringify(err, null, 2) });
            } else {
                resolve(data);
            }
        });
    });
}

const deleteItem = (tableName, key) => {

    return new Promise((resolve, reject) => {
        const docClient = new AWS.DynamoDB.DocumentClient();
        const params = {
            TableName: tableName,
            Key: key
        };

        docClient.delete(params, function (err) {
            if (err) {
                reject({ 'message': 'Unable to delete item. Error JSON: ' + JSON.stringify(err, null, 2) });
            } else {
                resolve({
                    'status': 'DELETED'
                });
            }
        });
    });
}

const setConfigToEnv = (item) => {
    process.env.CONFIG_LOADED = true;
    process.env.SWAP_COIN = item.swap_coin;
    process.env.TRADE_COINS = item.trade_coins;
    process.env.SWAP_VALUE = item.swap_value;
    process.env.BUY_COEF = item.buy_coef;
    process.env.BUY_DECLIVE_COEF = item.buy_declive_coef;
    process.env.BUY_CURVE_COEF = item.buy_curve_coef;
    process.env.SELL_COEF = item.sell_coef;
    process.env.BUY_TOOGLE = item.buy_toogle;
    process.env.SELL_TOOGLE = item.sell_toogle;
    process.env.TELEGRAM_TOOGLE = item.telegram_toogle;
    process.env.BUY_PERIODS = item.buy_periods;
}

const getConfig = async () => {
    if (process.env.CONFIG_LOADED) {
        console.log('Environment was loaded...');
        return true;
    } else {
        const data = await getItem(process.env.CONFIG_TABLE, { 'name': 'CONFIG' });
        if (data.Item) {
            setConfigToEnv(data.Item)
        } else {
            console.log('Config do not exists, creating CONFIG...');
            const firstEnv = {
                "name": "CONFIG",
                "swap_value": 20,
                "trade_coins": "ETH,DOGE,ADA,SOL,XRP,DOT,LUNA,AVAX,LTC",
                "buy_declive_coef": -0.06,
                "sell_coef": 0.02,
                "swap_coin": "USDT",
                "buy_toogle": "OFF",
                "sell_toogle": "OFF",
                "buy_coef": 0.45,
                "buy_curve_coef": 0.2,
                "buy_periods": 288,
                "telegram_toogle": "OFF"
            }
            setConfigToEnv(firstEnv);
            await createItem(process.env.CONFIG_TABLE, firstEnv);
        }
        return true;
    }
}

const createNewTrade = async (obj, symbol, swapCoin) => {
    obj.uid = uuid.v1();
    obj.symbol = symbol;
    obj.swap_coin = swapCoin;
    obj.order_status = 'OPEN';
    obj.last_price = obj.price;
    obj.top_price = obj.price;
    return await createItem(process.env.TRADES_TABLE, obj);
}

const getOpenTrades = async () => {
    const orders = await getAllScanItems(process.env.TRADES_TABLE, 'order_status', 'OPEN');
    return orders.Items;
}

const getClosedTrades = async () => {
    const orders = await getAllScanItems(process.env.TRADES_TABLE, 'order_status', 'CLOSED');
    return orders.Items;
}

const deleteOrders = async (orders) => {
    for (var o in orders) {
        await deleteItem(process.env.TRADES_TABLE, {
            symbol: orders[o].symbol,
            uid: orders[o].uid
        });
    }
}

const updateOpenTrades = async (order, lastPrice, topPrice) => {
    const status = await updateItem(process.env.TRADES_TABLE, {
        uid: order.uid,
        symbol: order.symbol
    }, {
        last_price: lastPrice,
        top_price: topPrice
    });
    return status;
}

const closeOpenTrades = async (order, closeCoef) => {
    const status = await updateItem(process.env.TRADES_TABLE, {
        uid: order.uid,
        symbol: order.symbol
    }, {
        close_coef: closeCoef,
        order_status: 'CLOSED'
    });
    return status;
}

module.exports = {
    createItem,
    updateItem,
    getItem,
    deleteItem,
    getAllItems,
    getAllScanItems,
    getAllRangeItemsWithKey,
    getConfig,
    createNewTrade,
    updateOpenTrades,
    getOpenTrades,
    closeOpenTrades,
    getClosedTrades,
    deleteOrders
}