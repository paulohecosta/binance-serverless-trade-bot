const TelegramBot = require('node-telegram-bot-api');


let instance = null
class TelegramBotManager {
    constructor() {
        this.token = process.env.TELEGRAM_TOKEN;
        this.bot = new TelegramBot(this.token);
        this.chatId = process.env.TELEGRAM_CHAT_ID;
        this.flag = process.env.TELEGRAM_TOOGLE || "OFF";
    }
    static getInstance() {
        if (!instance) {
            instance = new TelegramBotManager();
        }
        return instance;
    }
    async sendMessage(message) {
        if(this.token && this.chatId && this.flag == "ON") {
            await this.bot.sendMessage(this.chatId, message);
        }
    }
}

module.exports = TelegramBotManager;