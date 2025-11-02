const TelegramBot = require('node-telegram-bot-api');
const EvolutionKeyboards = require('./keyboards');
const UserService = require('../services/UserService');

// Твой токен
const token = '8510198497:AAEz9psVNQXKk4jKN3-dc3eq-NL2ZW5n_P4';

class EvolutionBot {
    constructor() {
        this.bot = new TelegramBot(token, { polling: true });
        this.setupHandlers();
        console.log('💎 Evolution Bot запущен!');
    }

    setupHandlers() {
        // Команды
        this.bot.onText(/\/start/, (msg) => this.handleStart(msg));
        this.bot.onText(/\/wallet/, (msg) => this.handleWallet(msg));
        this.bot.onText(/\/send/, (msg) => this.handleSend(msg));
        
        // Callback-запросы (кнопки)
        this.bot.on('callback_query', (query) => this.handleCallback(query));
    }

    async handleStart(msg) {
        try {
            // Создаем или получаем пользователя из БД
            const user = await UserService.findOrCreateUser(msg.from);
            
            const welcomeText = `💎 *Добро пожаловать в Evolution, ${user.firstName || 'друг'}!*

🚀 Ваш криптокошелек нового поколения в Telegram.

• 📧 *Уникальные TON кошельки* для каждого пользователя
• 💰 *Реальные балансы* из блокчейна  
• 🔒 *Безопасное хранение* активов
• ⚡ *Мгновенные переводы*

*Выберите действие:*`;

            this.bot.sendMessage(msg.chat.id, welcomeText, {
                parse_mode: 'Markdown',
                reply_markup: EvolutionKeyboards.mainMenu()
            });
        } catch (error) {
            console.error('Ошибка при старте:', error);
            this.bot.sendMessage(msg.chat.id, '❌ Произошла ошибка. Попробуйте позже.');
        }
    }

    async handleWallet(msg) {
        await this.showWallet(msg.chat.id, msg.from.id);
    }

    handleSend(msg) {
        this.showSendMenu(msg.chat.id);
    }

    async handleCallback(query) {
        const { data, message } = query;
        const chatId = message.chat.id;
        const telegramId = message.from.id;

        try {
            switch(data) {
                case 'main_menu':
                    await this.handleStart(message);
                    break;
                case 'show_wallet':
                    await this.showWallet(chatId, telegramId);
                    break;
                case 'send_crypto':
                    this.showSendMenu(chatId);
                    break;
                case 'receive_crypto':
                    await this.showReceiveMenu(chatId, telegramId);
                    break;
                case 'receive_ton':
                    await this.showReceiveTON(chatId, telegramId);
                    break;
                case 'receive_usdt':
                    await this.showReceiveUSDT(chatId, telegramId);
                    break;
                case 'send_ton':
                    this.showSendTON(chatId);
                    break;
                case 'send_usdt':
                    this.showSendUSDT(chatId);
                    break;
                case 'exchange':
                    this.showExchange(chatId);
                    break;
                case 'history':
                    this.showHistory(chatId);
                    break;
                case 'help':
                    this.showHelp(chatId);
                    break;
            }

            this.bot.answerCallbackQuery(query.id);
        } catch (error) {
            console.error('Ошибка в callback:', error);
            this.bot.answerCallbackQuery(query.id, { text: '❌ Ошибка. Попробуйте позже.' });
        }
    }

    async showWallet(chatId, telegramId) {
        try {
            const user = await UserService.getUserByTelegramId(telegramId);
            if (!user) {
                await this.handleStart({ chat: { id: chatId }, from: { id: telegramId } });
                return;
            }

            const walletInfo = UserService.getWalletInfo(user);

            const walletText = `💼 *Ваш кошелек Evolution*

💎 **TON**: ${parseFloat(user.tonBalance).toFixed(4)} TON
📧 Адрес: \`${walletInfo.formattedTonAddress}\`

💵 **USDT**: ${parseFloat(user.usdtBalance).toFixed(2)} USDT
📧 Адрес: \`${walletInfo.formattedUsdtAddress}\`

*💰 Баланс обновляется из блокчейна*`;

            this.bot.sendMessage(chatId, walletText, {
                parse_mode: 'Markdown',
                reply_markup: EvolutionKeyboards.walletMenu()
            });
        } catch (error) {
            console.error('Ошибка показа кошелька:', error);
            this.bot.sendMessage(chatId, '❌ Ошибка загрузки кошелька.');
        }
    }

    async showReceiveMenu(chatId, telegramId) {
        try {
            const user = await UserService.getUserByTelegramId(telegramId);
            this.bot.sendMessage(chatId, '📥 *Получение криптовалюты*\n\nВыберите валюту для получения:', {
                parse_mode: 'Markdown',
                reply_markup: EvolutionKeyboards.receiveMenu()
            });
        } catch (error) {
            console.error('Ошибка показа получения:', error);
        }
    }

    async showReceiveTON(chatId, telegramId) {
        try {
            const user = await UserService.getUserByTelegramId(telegramId);
            const walletInfo = UserService.getWalletInfo(user);
            
            const tonText = `💎 *Получение TON*

*Ваш уникальный TON адрес:*

\`${user.tonWallet}\`

*Отправляйте TON на этот адрес из любого кошелька*

📊 *Текущий баланс:* ${parseFloat(user.tonBalance).toFixed(4)} TON

💡 *Совет:* Баланс обновляется автоматически при поступлении средств`;

            this.bot.sendMessage(chatId, tonText, {
                parse_mode: 'Markdown',
                reply_markup: EvolutionKeyboards.backToWallet()
            });
        } catch (error) {
            console.error('Ошибка показа TON адреса:', error);
        }
    }

    async showReceiveUSDT(chatId, telegramId) {
        try {
            const user = await UserService.getUserByTelegramId(telegramId);
            const walletInfo = UserService.getWalletInfo(user);
            
            const usdtText = `💵 *Получение USDT*

*Ваш USDT адрес в сети TON:*

\`${user.usdtWallet}\`

*Отправляйте USDT на этот адрес*

📊 *Текущий баланс:* ${parseFloat(user.usdtBalance).toFixed(2)} USDT`;

            this.bot.sendMessage(chatId, usdtText, {
                parse_mode: 'Markdown',
                reply_markup: EvolutionKeyboards.backToWallet()
            });
        } catch (error) {
            console.error('Ошибка показа USDT адреса:', error);
        }
    }

    showSendMenu(chatId) {
        this.bot.sendMessage(chatId, '📤 *Отправка криптовалюты*\n\nВыберите валюту для отправки:', {
            parse_mode: 'Markdown',
            reply_markup: EvolutionKeyboards.sendMenu()
        });
    }

    showSendTON(chatId) {
        this.bot.sendMessage(chatId, '💎 *Отправка TON*\n\nВведите username получателя и сумму:\n\n*Функция в разработке...*', {
            parse_mode: 'Markdown',
            reply_markup: EvolutionKeyboards.backToWallet()
        });
    }

    showSendUSDT(chatId) {
        this.bot.sendMessage(chatId, '💵 *Отправка USDT*\n\nВведите username получателя и сумму:\n\n*Функция в разработке...*', {
            parse_mode: 'Markdown',
            reply_markup: EvolutionKeyboards.backToWallet()
        });
    }

    showExchange(chatId) {
        this.bot.sendMessage(chatId, '🔄 *Обмен криптовалют*\n\nСкоро здесь можно будет обменивать TON ↔ USDT\n\n*Функция в разработке...*', {
            parse_mode: 'Markdown',
            reply_markup: EvolutionKeyboards.backToWallet()
        });
    }

    showHistory(chatId) {
        this.bot.sendMessage(chatId, '📊 *История операций*\n\nЗдесь будет история ваших транзакций\n\n*Функция в разработке...*', {
            parse_mode: 'Markdown',
            reply_markup: EvolutionKeyboards.backToWallet()
        });
    }

    showHelp(chatId) {
        const helpText = `ℹ️ *Помощь по Evolution*

💎 **Evolution** - ваш надежный криптокошелек в Telegram

*Особенности:*
• 📧 Уникальный TON кошелек для каждого пользователя
• 💰 Реальные балансы из блокчейна TON
• 🔒 Безопасное хранение активов
• ⚡ Мгновенные обновления

*Основные команды:*
/start - Главное меню
/wallet - Мой кошелек  
/send - Отправить криптовалюту

*Доступные валюты:*
• TON (The Open Network) - реальные кошельки
• USDT (Tether) - скоро`;

        this.bot.sendMessage(chatId, helpText, {
            parse_mode: 'Markdown',
            reply_markup: EvolutionKeyboards.backToWallet()
        });
    }
}

module.exports = EvolutionBot;
