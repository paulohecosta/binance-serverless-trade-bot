const TelegramBotManager = require('/opt/service/telegram-manager');
const dbService = require('/opt/service/dynamo-manager');
const apiHelper = require('/opt/helper/api-helper');

const mockResponse = () => {
    return {}
}

const betterCoin = (coins) => {
    var arr = coins.map(el => el.symbol);
    return arr.sort((a, b) =>
        arr.filter(v => v === a).length
        - arr.filter(v => v === b).length
    ).pop();
}

const lambdaHandler = async () => {
    await dbService.getConfig();
    const telegram = TelegramBotManager.getInstance();
    const orders = await dbService.getClosedTrades();
    if (orders.length > 0) {
        var profit = 0;
        for (var o in orders) {
            profit += process.env.SWAP_VALUE * orders[o].close_coef;
        }
        const message = `Won ${profit} ${process.env.SWAP_COIN} in ${orders.length} orders! [${betterCoin(orders)}] was the best of the period!`;
        console.log(message);
        await telegram.sendMessage(message);
        await dbService.deleteOrders(orders);
    } else {
        console.log(`No orders in the period...`);
    }
    return apiHelper.createResponse(mockResponse(), 200);
}

module.exports = {
    lambdaHandler
}