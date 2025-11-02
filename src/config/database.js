const { Sequelize } = require('sequelize');

// Настройки подключения к PostgreSQL (для Mac с Homebrew)
const sequelize = new Sequelize({
  database: 'evolution_bot',
  username: process.env.USER, // твое имя пользователя Mac
  password: '', // пустой пароль для локальной разработки
  host: 'localhost',
  port: 5432,
  dialect: 'postgres',
  logging: false,
});

// Тестируем подключение
sequelize.authenticate()
  .then(() => console.log('✅ Подключение к PostgreSQL установлено'))
  .catch(err => console.error('❌ Ошибка подключения к PostgreSQL:', err));

module.exports = sequelize;
