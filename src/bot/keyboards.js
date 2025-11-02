class EvolutionKeyboards {
    static mainMenu() {
        return {
            inline_keyboard: [
                [
                    { 
                        text: '💼 Мой кошелек', 
                        callback_data: 'show_wallet' 
                    }
                ],
                [
                    { text: '📤 Отправить', callback_data: 'send_crypto' },
                    { text: '📥 Получить', callback_data: 'receive_crypto' }
                ],
                [
                    { text: '🔄 Обменять', callback_data: 'exchange' },
                    { text: '📊 История', callback_data: 'history' }
                ],
                [
                    { text: 'ℹ️ Помощь', callback_data: 'help' }
                ]
            ]
        };
    }

    static walletMenu() {
        return {
            inline_keyboard: [
                [
                    { text: '📤 Отправить', callback_data: 'send_crypto' },
                    { text: '📥 Получить', callback_data: 'receive_crypto' }
                ],
                [
                    { text: '🔄 Обменять', callback_data: 'exchange' },
                    { text: '📊 История', callback_data: 'history' }
                ],
                [
                    { text: '🔙 Назад', callback_data: 'main_menu' }
                ]
            ]
        };
    }

    static receiveMenu() {
        return {
            inline_keyboard: [
                [
                    { text: '💎 Получить TON', callback_data: 'receive_ton' },
                    { text: '💵 Получить USDT', callback_data: 'receive_usdt' }
                ],
                [
                    { text: '🔙 Назад', callback_data: 'show_wallet' }
                ]
            ]
        };
    }

    static sendMenu() {
        return {
            inline_keyboard: [
                [
                    { text: '💎 Отправить TON', callback_data: 'send_ton' },
                    { text: '💵 Отправить USDT', callback_data: 'send_usdt' }
                ],
                [
                    { text: '🔙 Назад', callback_data: 'show_wallet' }
                ]
            ]
        };
    }

    static backToWallet() {
        return {
            inline_keyboard: [
                [
                    { text: '🔙 В кошелек', callback_data: 'show_wallet' }
                ]
            ]
        };
    }
}

module.exports = EvolutionKeyboards;
