const { Pool } = require('pg');

const pool = new Pool({
    host: process.env.DB_HOST || 'postgres',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres123',
    database: process.env.DB_NAME || 'app_database',
    port: process.env.DB_PORT || 5432,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
});

// Проверка подключения
pool.on('connect', () => {
    console.log('✅ Подключено к PostgreSQL');
});

pool.on('error', (err) => {
    console.error('❌ Ошибка PostgreSQL:', err);
});

module.exports = pool;