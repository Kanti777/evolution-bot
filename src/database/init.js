const sequelize = require('../config/database');
const User = require('../models/User');
const Transaction = require('../models/Transaction');

async function initializeDatabase() {
    try {
        // Синхронизируем модели с базой данных
        await sequelize.sync({ force: false }); // false - не перезаписывать существующие таблицы
        console.log('✅ База данных инициализирована');
    } catch (error) {
        console.error('❌ Ошибка инициализации базы данных:', error);
    }
}

module.exports = initializeDatabase;
