const initializeDatabase = require('./database/init');
const EvolutionBot = require('./bot/core');

// Инициализируем базу данных перед запуском бота
async function startApp() {
    try {
        await initializeDatabase();
        console.log('🚀 Запуск Evolution Bot...');
        const evolutionBot = new EvolutionBot();
    } catch (error) {
        console.error('❌ Ошибка запуска приложения:', error);
    }
}

startApp();
