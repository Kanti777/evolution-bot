const { mnemonicToWalletKey } = require("@ton/crypto");
const { WalletContractV4 } = require("@ton/ton");
const { TonClient } = require("@ton/ton");
const { getHttpEndpoint } = require("@orbs-network/ton-access");

class TONService {
    // Генерация нового TON кошелька
    static async generateWallet() {
        try {
            // Генерируем мнемоническую фразу (24 слова)
            const mnemonics = await this.generateMnemonics();
            
            // Конвертируем в приватный ключ
            const key = await mnemonicToWalletKey(mnemonics);
            
            // Создаем кошелек версии 4
            const wallet = WalletContractV4.create({ 
                publicKey: key.publicKey, 
                workchain: 0 
            });
            
            // Получаем адрес кошелька
            const address = wallet.address;
            
            return {
                mnemonics: mnemonics,
                publicKey: key.publicKey,
                privateKey: key.secretKey,
                address: address.toString(),
                walletVersion: 'v4'
            };
        } catch (error) {
            console.error('Ошибка генерации кошелька:', error);
            throw error;
        }
    }

    // Генерация мнемонической фразы
    static async generateMnemonics() {
        // В реальном приложении используем secure random
        // Для демо генерируем простую фразу
        const crypto = require('crypto');
        const words = [
            'abandon', 'ability', 'able', 'about', 'above', 'absent', 'absorb', 'abstract',
            'absurd', 'abuse', 'access', 'accident', 'account', 'accuse', 'achieve', 'acid',
            'acoustic', 'acquire', 'across', 'act', 'action', 'actor', 'actress', 'actual'
        ];
        
        const mnemonics = [];
        for (let i = 0; i < 24; i++) {
            const randomIndex = crypto.randomInt(0, words.length);
            mnemonics.push(words[randomIndex]);
        }
        
        return mnemonics;
    }

    // Получение баланса кошелька
    static async getBalance(walletAddress) {
        try {
            const endpoint = await getHttpEndpoint({ network: 'mainnet' });
            const client = new TonClient({ endpoint });
            
            const balance = await client.getBalance(walletAddress);
            return parseFloat(balance.toString()) / 1000000000; // Конвертируем в TON
        } catch (error) {
            console.error('Ошибка получения баланса:', error);
            return 0;
        }
    }

    // Проверка валидности TON адреса
    static isValidAddress(address) {
        try {
            // Простая проверка формата TON адреса
            return address.startsWith('EQ') || address.startsWith('UQ') || address.startsWith('0:');
        } catch (error) {
            return false;
        }
    }

    // Форматирование адреса для отображения
    static formatAddress(address) {
        if (!address) return '';
        
        // Для TON адресов (EQ... или UQ...)
        if (address.startsWith('EQ') || address.startsWith('UQ')) {
            if (address.length <= 12) return address;
            return address.slice(0, 8) + '...' + address.slice(-8);
        }
        
        // Для EVM адресов (0x...)
        if (address.startsWith('0x')) {
            if (address.length <= 12) return address;
            return address.slice(0, 8) + '...' + address.slice(-8);
        }
        
        return address;
    }

    // Получение полного адреса (без форматирования)
    static getFullAddress(address) {
        return address;
    }
}

module.exports = TONService;
