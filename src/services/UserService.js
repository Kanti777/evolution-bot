const User = require('../models/User');
const Transaction = require('../models/Transaction');
const TONService = require('./TONService');

class UserService {
    // Создание или получение пользователя с реальным TON кошельком
    static async findOrCreateUser(telegramUser) {
        const [user, created] = await User.findOrCreate({
            where: { telegramId: telegramUser.id },
            defaults: {
                username: telegramUser.username,
                firstName: telegramUser.first_name,
                lastName: telegramUser.last_name,
                tonWallet: await this.generateTONWallet(),
                usdtWallet: this.generateUSDTWallet(),
                tonBalance: 0.0, // Начинаем с 0, будем получать из блокчейна
                usdtBalance: 0.0
            }
        });

        if (created) {
            console.log(`🆕 Создан новый пользователь с реальным TON кошельком: ${user.username || user.firstName}`);
            
            // Получаем реальный баланс из блокчейна
            try {
                const realBalance = await TONService.getBalance(user.tonWallet);
                user.tonBalance = realBalance;
                await user.save();
                console.log(`💰 Баланс пользователя ${user.username}: ${realBalance} TON`);
            } catch (error) {
                console.error('Ошибка получения баланса:', error);
            }
        } else {
            // Обновляем баланс существующего пользователя из блокчейна
            try {
                const realBalance = await TONService.getBalance(user.tonWallet);
                if (user.tonBalance !== realBalance) {
                    user.tonBalance = realBalance;
                    await user.save();
                    console.log(`🔄 Обновлен баланс ${user.username}: ${realBalance} TON`);
                }
            } catch (error) {
                console.error('Ошибка обновления баланса:', error);
            }
        }

        return user;
    }

    // Генерация реального TON кошелька
    static async generateTONWallet() {
        try {
            const wallet = await TONService.generateWallet();
            console.log(`🎯 Сгенерирован TON кошелек: ${TONService.formatAddress(wallet.address)}`);
            return wallet.address;
        } catch (error) {
            console.error('Ошибка генерации TON кошелька:', error);
            // Возвращаем заглушку в случае ошибки
            return 'EQ' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        }
    }

    // Получение пользователя по Telegram ID
    static async getUserByTelegramId(telegramId) {
        const user = await User.findOne({ where: { telegramId } });
        
        // Обновляем баланс из блокчейна при каждом запросе
        if (user && user.tonWallet) {
            try {
                const realBalance = await TONService.getBalance(user.tonWallet);
                if (user.tonBalance !== realBalance) {
                    user.tonBalance = realBalance;
                    await user.save();
                }
            } catch (error) {
                console.error('Ошибка обновления баланса:', error);
            }
        }
        
        return user;
    }

    // Обновление баланса
    static async updateBalance(userId, currency, amount) {
        const user = await User.findByPk(userId);
        if (!user) throw new Error('Пользователь не найден');

        const balanceField = currency.toLowerCase() + 'Balance';
        user[balanceField] = parseFloat(user[balanceField]) + parseFloat(amount);
        
        await user.save();
        return user;
    }

    // Генерация USDT кошелька (пока заглушка)
    static generateUSDTWallet() {
        return '0x' + Math.random().toString(16).substring(2, 42);
    }

    // Получение информации о кошельке для отображения
    static getWalletInfo(user) {
        return {
            tonAddress: user.tonWallet,
            tonBalance: user.tonBalance,
            usdtAddress: user.usdtWallet,
            usdtBalance: user.usdtBalance,
            formattedTonAddress: TONService.formatAddress(user.tonWallet),
            formattedUsdtAddress: user.usdtWallet ? user.usdtWallet.slice(0, 8) + '...' + user.usdtWallet.slice(-8) : ''
        };
    }
}

module.exports = UserService;
