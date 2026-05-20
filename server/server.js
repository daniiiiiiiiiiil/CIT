require('dotenv').config();
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const { OAuth2Client } = require("google-auth-library");
const pool = require("./db");
const { setupInitialTests } = require("./initialTests");
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: [
        'http://localhost:5173',
        'http://localhost:5174',
        'http://5.42.121.83:5173',
        'http://5.42.121.83:5174'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const isDev = process.env.NODE_ENV !== 'production';

let transporter = null;

const setupEmailTransporter = () => {
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
        transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT) || 587,
            secure: process.env.SMTP_SECURE === 'true',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
            tls: {
                rejectUnauthorized: false
            }
        });
        
        transporter.verify((error, success) => {
            if (error) {
                console.error('Ошибка подключения к SMTP:', error.message);
                transporter = null;
            } else {
                console.log('SMTP настроен и готов к отправке писем');
            }
        });
    } else {
        console.log('SMTP не настроен. Письма будут выводиться в консоль.');
        console.log('Для тестирования используйте ссылку из консоли или из ответа API (режим разработки)');
    }
};

// Функция отправки email
const sendResetEmail = async (email, resetUrl, userName = '') => {
    console.log(`\nПИСЬМО ДЛЯ СБРОСА ПАРОЛЯ`);
    console.log(`   Кому: ${email}`);
    console.log(`   Ссылка: ${resetUrl}`);
    console.log(`   Действительна: 1 час\n`);

    if (!transporter) {
        console.log('SMTP не настроен. Письмо не отправлено, используйте ссылку выше.');
        return true;
    }

    try {
        const htmlTemplate = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Сброс пароля - ПрофЦифра</title>
                <style>
                    body {
                        font-family: 'Segoe UI', Arial, sans-serif;
                        line-height: 1.6;
                        color: #333;
                        margin: 0;
                        padding: 0;
                        background-color: #f5f5f5;
                    }
                    .container {
                        max-width: 600px;
                        margin: 40px auto;
                        background: white;
                        border-radius: 12px;
                        overflow: hidden;
                        box-shadow: 0 4px 20px rgba(0,0,0,0.1);
                    }
                    .header {
                        background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
                        padding: 30px;
                        text-align: center;
                    }
                    .header h1 {
                        color: #00d4ff;
                        margin: 0;
                        font-size: 28px;
                        letter-spacing: 2px;
                    }
                    .header p {
                        color: #a0a0b0;
                        margin: 10px 0 0;
                        font-size: 14px;
                    }
                    .content {
                        padding: 40px 30px;
                    }
                    .content h2 {
                        color: #1a1a2e;
                        margin-top: 0;
                        font-size: 24px;
                    }
                    .content p {
                        color: #555;
                        margin: 15px 0;
                    }
                    .button {
                        display: inline-block;
                        background: linear-gradient(135deg, #00d4ff 0%, #3a7bd5 100%);
                        color: white;
                        text-decoration: none;
                        padding: 14px 32px;
                        border-radius: 8px;
                        margin: 20px 0;
                        font-weight: 600;
                    }
                    .link-box {
                        background: #f5f5f5;
                        padding: 12px;
                        border-radius: 6px;
                        word-break: break-all;
                        font-size: 12px;
                        margin: 15px 0;
                        border: 1px solid #e0e0e0;
                    }
                    .warning {
                        color: #ff4757;
                        font-size: 12px;
                        margin-top: 20px;
                        padding-top: 15px;
                        border-top: 1px solid #eee;
                    }
                    .footer {
                        background: #f8f8f8;
                        padding: 20px;
                        text-align: center;
                        font-size: 12px;
                        color: #888;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>ПрофЦифра</h1>
                        <p>Система профессиональной аттестации</p>
                    </div>
                    <div class="content">
                        <h2>Сброс пароля</h2>
                        <p>Здравствуйте, ${userName || 'пользователь'}!</p>
                        <p>Вы запросили сброс пароля для вашей учетной записи в системе «ПрофЦифра Аттестация».</p>
                        <p>Чтобы создать новый пароль, нажмите на кнопку ниже:</p>
                        
                        <div style="text-align: center;">
                            <a href="${resetUrl}" class="button">Сбросить пароль</a>
                        </div>
                        
                        <p>Или скопируйте ссылку в браузер:</p>
                        <div class="link-box">
                            ${resetUrl}
                        </div>
                        
                        <div class="warning">
                             <strong>Важно:</strong> Ссылка действительна в течение 1 часа.<br>
                            Если вы не запрашивали сброс пароля, просто проигнорируйте это письмо.
                        </div>
                    </div>
                    <div class="footer">
                        <p>&copy; 2024 ПрофЦифра. Все права защищены.</p>
                        <p>Это автоматическое сообщение, пожалуйста, не отвечайте на него.</p>
                    </div>
                </div>
            </body>
            </html>
        `;

        const info = await transporter.sendMail({
            from: `"ПрофЦифра Аттестация" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
            to: email,
            subject: "Сброс пароля - ПрофЦифра Аттестация",
            html: htmlTemplate,
            text: `Для сброса пароля перейдите по ссылке: ${resetUrl}\n\nСсылка действительна 1 час.\n\nЕсли вы не запрашивали сброс пароля, проигнорируйте это письмо.`
        });

        console.log(`Письмо отправлено на ${email}, ID: ${info.messageId}`);
        return true;
    } catch (error) {
        console.error('Ошибка отправки email:', error.message);
        return false;
    }
};

const scheduleDataCleanup = () => {
    const runCleanup = async () => {
        try {
            const ninetyDaysAgo = new Date();
            ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

            const anonymizedResults = await pool.query(`
                UPDATE test_results
                SET user_id = NULL
                WHERE finished_at < $1 AND user_id IS NOT NULL
                    RETURNING id
            `, [ninetyDaysAgo]);

            if (anonymizedResults.rows.length > 0) {
                const resultIds = anonymizedResults.rows.map(r => r.id);
                await pool.query(`
                    DELETE FROM user_answers
                    WHERE result_id = ANY($1::int[])
                `, [resultIds]);
                console.log(`Анонимизировано ${anonymizedResults.rows.length} старых результатов (старше 90 дней)`);
            }

            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            const deletedSessions = await pool.query(`
                DELETE FROM sessions
                WHERE created_at < $1
            `, [thirtyDaysAgo]);

            if (deletedSessions.rowCount > 0) {
                console.log(`Удалено ${deletedSessions.rowCount} устаревших сессий`);
            }

            const deletedResetTokens = await pool.query(`
                DELETE FROM password_resets
                WHERE expires_at < NOW()
            `);
            
            if (deletedResetTokens.rowCount > 0) {
                console.log(`Удалено ${deletedResetTokens.rowCount} просроченных токенов сброса`);
            }
        } catch (error) {
            console.error('Ошибка при очистке данных:', error);
        }
    };

    runCleanup();
    setInterval(runCleanup, 24 * 60 * 60 * 1000);
    console.log('Запланирована ежедневная очистка данных');
};

const initDatabase = async () => {
    try {
        console.log('Инициализация базы данных...');

        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                name VARCHAR(255),
                picture TEXT,
                is_admin BOOLEAN DEFAULT false,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('Таблица users');

        await pool.query(`
            CREATE TABLE IF NOT EXISTS sessions (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                token VARCHAR(500) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('Таблица sessions');

        await pool.query(`
            CREATE TABLE IF NOT EXISTS competences (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                description TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('Таблица competences');

        await pool.query(`
            CREATE TABLE IF NOT EXISTS categories (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                description TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('Таблица categories');

        await pool.query(`
            ALTER TABLE categories ADD COLUMN IF NOT EXISTS competence_id INTEGER REFERENCES competences(id) ON DELETE SET NULL
        `);
        console.log('Колонка competence_id');

        await pool.query(`
            CREATE TABLE IF NOT EXISTS questions (
                id SERIAL PRIMARY KEY,
                text TEXT NOT NULL,
                type VARCHAR(20) DEFAULT 'single',
                category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('Таблица questions');

        await pool.query(`
            CREATE TABLE IF NOT EXISTS answers (
                id SERIAL PRIMARY KEY,
                question_id INTEGER REFERENCES questions(id) ON DELETE CASCADE,
                text TEXT NOT NULL,
                is_correct BOOLEAN DEFAULT false,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('Таблица answers');

        await pool.query(`
            CREATE TABLE IF NOT EXISTS test_results (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
                total_correct INTEGER DEFAULT 0,
                total_questions INTEGER DEFAULT 0,
                percent NUMERIC(5,2) DEFAULT 0,
                passed BOOLEAN DEFAULT false,
                finished_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('Таблица test_results');

        await pool.query(`
            CREATE TABLE IF NOT EXISTS user_answers (
                id SERIAL PRIMARY KEY,
                result_id INTEGER REFERENCES test_results(id) ON DELETE CASCADE,
                question_id INTEGER REFERENCES questions(id) ON DELETE CASCADE,
                selected_answer_ids INTEGER[] DEFAULT '{}'
            )
        `);
        console.log('Таблица user_answers');

        await pool.query(`
            CREATE TABLE IF NOT EXISTS certificates (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id),
                result_id INTEGER REFERENCES test_results(id) ON DELETE CASCADE,
                cert_number VARCHAR(100) UNIQUE,
                issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('Таблица certificates');

        await pool.query(`
            CREATE TABLE IF NOT EXISTS password_resets (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                token VARCHAR(255) UNIQUE NOT NULL,
                expires_at TIMESTAMP NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('Таблица password_resets');

        await pool.query(`
            CREATE OR REPLACE FUNCTION update_updated_at_column()
            RETURNS TRIGGER AS $$
            BEGIN
                NEW.updated_at = CURRENT_TIMESTAMP;
                RETURN NEW;
            END;
            $$ language 'plpgsql'
        `);

        await pool.query(`
            DROP TRIGGER IF EXISTS update_users_updated_at ON users;
            CREATE TRIGGER update_users_updated_at
                BEFORE UPDATE ON users
                FOR EACH ROW
                EXECUTE FUNCTION update_updated_at_column()
        `);
        console.log('Триггер updated_at');

        const createDefaultAdmin = async () => {
        try {
            const adminCheck = await pool.query("SELECT id, email FROM users WHERE is_admin = true LIMIT 1");

            if (adminCheck.rows.length === 0) {
                console.log('Создание администратора по умолчанию...');

                const defaultAdminEmail = "admin@cit.ru";
                const defaultAdminPassword = "Admin123!";
                const defaultAdminName = "Администратор ЦИТ";

                const hashedPassword = await bcrypt.hash(defaultAdminPassword, 10);

                await pool.query(
                    `INSERT INTO users (email, password, name, is_admin)
                    VALUES ($1, $2, $3, true)`,
                    [defaultAdminEmail, hashedPassword, defaultAdminName]
                );

                console.log('Администратор создан:');
                console.log(`   Email: ${defaultAdminEmail}`);
                console.log(`   Пароль:{defaultAdminPassword}`);
                console.log(`   Имя: ${defaultAdminName}`);
            } else {
                const adminEmail = adminCheck.rows[0].email;
                console.log('Администратор уже существует:');
                console.log(`Email: admin@cit.ru`);
                console.log(`Пароль по умолчанию: Admin123!`);
                console.log('Если забыли пароль — используйте восстановление через email');
            }
        } catch (error) {
            console.error('Ошибка создания администратора:', error);
        }
    };

        await createDefaultAdmin();
        await setupInitialTests(pool);
        console.log('База данных готова!');
    } catch (error) {
        console.error('Ошибка инициализации БД:', error);
    }
};

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ message: "Требуется авторизация" });
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: "Недействительный токен" });
        req.user = user;
        next();
    });
};

const requireAdmin = async (req, res, next) => {
    try {
        const r = await pool.query("SELECT is_admin FROM users WHERE id = $1", [req.user.id]);
        if (!r.rows[0]?.is_admin) return res.status(403).json({ message: "Нет доступа" });
        next();
    } catch (error) {
        res.status(500).json({ message: "Ошибка сервера" });
    }
};

// ==================== АУТЕНТИФИКАЦИЯ ====================

app.post("/api/register", async (req, res) => {
    const { email, password, name } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email и пароль обязательны" });
    if (password.length < 6) return res.status(400).json({ message: "Пароль должен быть минимум 6 символов" });
    try {
        const existingUser = await pool.query("SELECT * FROM users WHERE email = $1", [email.toLowerCase()]);
        if (existingUser.rows.length > 0) return res.status(400).json({ message: "Пользователь уже существует" });
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await pool.query(
            "INSERT INTO users (email, password, name) VALUES ($1, $2, $3) RETURNING id, email, name, is_admin",
            [email.toLowerCase(), hashedPassword, name || email.split('@')[0]]
        );
        const user = result.rows[0];
        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '24h' });
        await pool.query("INSERT INTO sessions (user_id, token) VALUES ($1, $2)", [user.id, token]);
        res.json({ message: "Регистрация успешна", user: { id: user.id, email: user.email, name: user.name, isAdmin: user.is_admin }, token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Ошибка сервера" });
    }
});

app.post("/api/login", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email и пароль обязательны" });
    try {
        const result = await pool.query("SELECT * FROM users WHERE email = $1", [email.toLowerCase()]);
        if (result.rows.length === 0) return res.status(401).json({ message: "Неверный email или пароль" });
        const user = result.rows[0];
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(401).json({ message: "Неверный email или пароль" });
        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '24h' });
        await pool.query("INSERT INTO sessions (user_id, token) VALUES ($1, $2)", [user.id, token]);
        res.json({ message: "Вход успешен", user: { id: user.id, email: user.email, name: user.name, isAdmin: user.is_admin }, token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Ошибка сервера" });
    }
});

app.post("/api/logout", authenticateToken, async (req, res) => {
    try {
        const token = req.headers['authorization']?.split(' ')[1];
        await pool.query("DELETE FROM sessions WHERE token = $1", [token]);
        res.json({ message: "Выход выполнен успешно" });
    } catch (error) {
        res.status(500).json({ message: "Ошибка сервера" });
    }
});

app.get("/api/me", authenticateToken, async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT id, email, name, picture, is_admin, created_at FROM users WHERE id = $1",
            [req.user.id]
        );
        if (result.rows.length === 0) return res.status(404).json({ message: "Пользователь не найден" });
        const u = result.rows[0];
        res.json({ id: u.id, email: u.email, name: u.name, picture: u.picture, isAdmin: u.is_admin, created_at: u.created_at });
    } catch (error) {
        res.status(500).json({ message: "Ошибка сервера" });
    }
});

// ==================== ВОССТАНОВЛЕНИЕ ПАРОЛЯ ====================

app.post("/api/forgot-password", async (req, res) => {
    const { email } = req.body;
    
    if (!email) {
        return res.status(400).json({ message: "Email обязателен" });
    }
    
    if (!/^\S+@\S+\.\S+$/.test(email)) {
        return res.status(400).json({ message: "Неверный формат email" });
    }
    
    try {
        const userResult = await pool.query(
            "SELECT id, email, name FROM users WHERE email = $1",
            [email.toLowerCase()]
        );
        
        if (userResult.rows.length === 0) {
            return res.json({ 
                message: "Если пользователь с таким email существует, вы получите письмо для сброса пароля" 
            });
        }
        
        const user = userResult.rows[0];
        
        const resetToken = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 1);
        
        await pool.query(
            "DELETE FROM password_resets WHERE user_id = $1",
            [user.id]
        );
        
        await pool.query(
            "INSERT INTO password_resets (user_id, token, expires_at) VALUES ($1, $2, $3)",
            [user.id, resetToken, expiresAt]
        );
        
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        const resetUrl = `${frontendUrl}/reset-password/${resetToken}`;
        
        await sendResetEmail(user.email, resetUrl, user.name);
        
        const responseData = { 
            message: "Если пользователь с таким email существует, вы получите письмо для сброса пароля" 
        };
        
        if (isDev) {
            responseData.resetLink = resetUrl;
            responseData.debug = true;
            console.log(`Режим разработки: ссылка для сброса отправлена в ответе API`);
        }
        
        res.json(responseData);
    } catch (error) {
        console.error("Ошибка при запросе сброса пароля:", error);
        res.status(500).json({ message: "Ошибка сервера" });
    }
});

app.post("/api/verify-reset-token", async (req, res) => {
    const { token } = req.body;
    
    if (!token) {
        return res.status(400).json({ message: "Токен обязателен" });
    }
    
    try {
        const result = await pool.query(
            `SELECT pr.*, u.email, u.name
             FROM password_resets pr
             JOIN users u ON u.id = pr.user_id
             WHERE pr.token = $1 AND pr.expires_at > NOW()`,
            [token]
        );
        
        if (result.rows.length === 0) {
            return res.status(400).json({ message: "Недействительная или просроченная ссылка", valid: false });
        }
        
        res.json({ valid: true, email: result.rows[0].email });
    } catch (error) {
        console.error("Ошибка проверки токена:", error);
        res.status(500).json({ message: "Ошибка сервера" });
    }
});

app.post("/api/reset-password", async (req, res) => {
    const { token, newPassword } = req.body;
    
    if (!token) {
        return res.status(400).json({ message: "Токен обязателен" });
    }
    
    if (!newPassword || newPassword.length < 6) {
        return res.status(400).json({ message: "Пароль должен быть минимум 6 символов" });
    }
    
    try {
        const resetResult = await pool.query(
            `SELECT pr.*, u.id as user_id 
             FROM password_resets pr
             JOIN users u ON u.id = pr.user_id
             WHERE pr.token = $1 AND pr.expires_at > NOW()`,
            [token]
        );
        
        if (resetResult.rows.length === 0) {
            return res.status(400).json({ message: "Недействительная или просроченная ссылка" });
        }
        
        const userId = resetResult.rows[0].user_id;
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        
        await pool.query(
            "UPDATE users SET password = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2",
            [hashedPassword, userId]
        );
        
        await pool.query("DELETE FROM password_resets WHERE user_id = $1", [userId]);
        await pool.query("DELETE FROM sessions WHERE user_id = $1", [userId]);
        
        console.log(`Пароль успешно изменен для пользователя ID: ${userId}`);
        
        res.json({ message: "Пароль успешно изменен" });
    } catch (error) {
        console.error("Ошибка при сбросе пароля:", error);
        res.status(500).json({ message: "Ошибка сервера" });
    }
});

// ==================== GOOGLE AUTH ====================

app.post("/auth/google", async (req, res) => {
    const { token } = req.body;
    try {
        const ticket = await googleClient.verifyIdToken({ idToken: token, audience: process.env.GOOGLE_CLIENT_ID });
        const { email, name, picture } = ticket.getPayload();
        let result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        let user;
        if (result.rows.length === 0) {
            result = await pool.query(
                "INSERT INTO users (email, name, password, picture) VALUES ($1, $2, $3, $4) RETURNING id, email, name, picture, is_admin",
                [email, name, 'google_oauth_no_password', picture]
            );
            user = result.rows[0];
        } else {
            user = result.rows[0];
            if (user.picture !== picture) {
                await pool.query("UPDATE users SET picture = $1 WHERE id = $2", [picture, user.id]);
                user.picture = picture;
            }
        }
        const jwtToken = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '24h' });
        await pool.query("INSERT INTO sessions (user_id, token) VALUES ($1, $2)", [user.id, jwtToken]);
        res.json({ user: { id: user.id, email: user.email, name: user.name, picture: user.picture, isAdmin: user.is_admin }, token: jwtToken });
    } catch (error) {
        console.error(error);
        res.status(401).json({ message: "Invalid token" });
    }
});

// ==================== АДМИН-ПАНЕЛЬ ====================

app.get("/api/admin/users", authenticateToken, requireAdmin, async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT id, email, name, is_admin, created_at
            FROM users
            ORDER BY id
        `);
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Ошибка сервера" });
    }
});

app.put("/api/admin/users/:id/toggle-admin", authenticateToken, requireAdmin, async (req, res) => {
    const userId = req.params.id;
    if (parseInt(userId) === req.user.id) {
        return res.status(400).json({ message: "Нельзя изменить свои права администратора" });
    }
    try {
        const userResult = await pool.query("SELECT is_admin FROM users WHERE id = $1", [userId]);
        if (userResult.rows.length === 0) {
            return res.status(404).json({ message: "Пользователь не найден" });
        }
        const newAdminStatus = !userResult.rows[0].is_admin;
        await pool.query("UPDATE users SET is_admin = $1 WHERE id = $2", [newAdminStatus, userId]);
        res.json({
            message: newAdminStatus ? "Пользователь назначен администратором" : "Права администратора сняты",
            isAdmin: newAdminStatus
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Ошибка сервера" });
    }
});

app.delete("/api/admin/users/:id", authenticateToken, requireAdmin, async (req, res) => {
    const userId = req.params.id;
    if (parseInt(userId) === req.user.id) {
        return res.status(400).json({ message: "Нельзя удалить самого себя" });
    }
    try {
        await pool.query("DELETE FROM sessions WHERE user_id = $1", [userId]);
        await pool.query("DELETE FROM user_answers WHERE result_id IN (SELECT id FROM test_results WHERE user_id = $1)", [userId]);
        await pool.query("DELETE FROM certificates WHERE user_id = $1", [userId]);
        await pool.query("DELETE FROM test_results WHERE user_id = $1", [userId]);
        await pool.query("DELETE FROM password_resets WHERE user_id = $1", [userId]);
        await pool.query("DELETE FROM users WHERE id = $1", [userId]);
        res.json({ message: "Пользователь удален" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Ошибка сервера" });
    }
});

// ==================== КАТЕГОРИИ И ТЕСТЫ ====================

app.get("/api/categories", authenticateToken, async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT c.*, comp.name as competence_name, COUNT(q.id) as questions_count
            FROM categories c
                     LEFT JOIN competences comp ON comp.id = c.competence_id
                     LEFT JOIN questions q ON q.category_id = c.id
            GROUP BY c.id, comp.name
            ORDER BY c.id
        `);
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Ошибка сервера" });
    }
});

app.get("/api/categories/:id/questions", authenticateToken, async (req, res) => {
    const categoryId = req.params.id;
    try {
        const result = await pool.query(`
            SELECT q.id, q.text, q.type,
                   COALESCE(
                           json_agg(json_build_object('id', a.id, 'text', a.text) ORDER BY a.id) FILTER (WHERE a.id IS NOT NULL),
                           '[]'
                   ) as answers
            FROM questions q
                     LEFT JOIN answers a ON a.question_id = q.id
            WHERE q.category_id = $1
            GROUP BY q.id
            ORDER BY q.id
        `, [categoryId]);
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Ошибка сервера" });
    }
});

app.get("/api/competences", async (req, res) => {
    try {
        const r = await pool.query("SELECT id, name FROM competences ORDER BY id");
        res.json(r.rows);
    } catch (error) {
        res.status(500).json({ message: "Ошибка сервера" });
    }
});

// ==================== ПРОХОЖДЕНИЕ ТЕСТОВ ====================
app.post("/api/test/submit", authenticateToken, async (req, res) => {
    const { answers, categoryId } = req.body;
    const userId = req.user.id;

    try {
        const questionsRes = await pool.query(`
            SELECT 
                q.id, 
                q.type,
                array_agg(a.id) filter (where a.is_correct) as correct_ids
            FROM questions q
                LEFT JOIN answers a ON a.question_id = q.id
            WHERE q.category_id = $1
            GROUP BY q.id, q.type
        `, [categoryId]);

        if (questionsRes.rows.length === 0) {
            return res.status(400).json({ message: "Нет вопросов в этой категории" });
        }

        const totalQuestions = questionsRes.rows.length;
        let totalScore = 0;      
        let maxPossibleScore = 0; 

        const questionsMap = new Map();
        for (const q of questionsRes.rows) {
            questionsMap.set(q.id, {
                type: q.type,
                correctIds: (q.correct_ids || []).map(Number)
            });
            
            const questionMaxScore = q.type === 'multiple' ? 2 : 1;
            maxPossibleScore += questionMaxScore;
        }

        for (const ans of answers) {
            const question = questionsMap.get(ans.questionId);
            if (!question) continue;
            
            const correctIds = question.correctIds;
            const selectedIds = (ans.selectedAnswers || []).map(Number);
            const questionMaxScore = question.type === 'multiple' ? 2 : 1;
            
            let isCorrect = false;
            
            if (question.type === 'multiple') {
                isCorrect = correctIds.length === selectedIds.length && 
                           correctIds.length > 0 && 
                           correctIds.every(id => selectedIds.includes(id));
            } else {
                isCorrect = selectedIds.length === 1 && 
                           correctIds.length === 1 && 
                           selectedIds[0] === correctIds[0];
            }
            
            if (isCorrect) {
                totalScore += questionMaxScore;
            }
        }

        const percent = maxPossibleScore > 0 ? Math.round((totalScore / maxPossibleScore) * 100) : 0;
        const passed = percent >= 80;

        const resultRes = await pool.query(
            `INSERT INTO test_results (user_id, category_id, total_correct, total_questions, percent, passed)
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
            [userId, categoryId, totalScore, maxPossibleScore, percent, passed]
        );
        const resultId = resultRes.rows[0].id;

        for (const ans of answers) {
            await pool.query(
                `INSERT INTO user_answers (result_id, question_id, selected_answer_ids) VALUES ($1, $2, $3)`,
                [resultId, ans.questionId, ans.selectedAnswers || []]
            );
        }

        let certificateNumber = null;
        if (passed) {
            certificateNumber = `PROF-${new Date().getFullYear()}-${String(resultId).padStart(5, '0')}`;
            await pool.query(
                `INSERT INTO certificates (user_id, result_id, cert_number) VALUES ($1, $2, $3)`,
                [userId, resultId, certificateNumber]
            );
        }

        res.json({ 
            resultId, 
            totalScore,      
            maxPossibleScore, 
            percent, 
            passed, 
            certificateNumber 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Ошибка сервера" });
    }
});

app.get("/api/test/result/:id", authenticateToken, async (req, res) => {
    const resultId = parseInt(req.params.id);
    try {
        const r = await pool.query(`
            SELECT tr.*, cert.cert_number as certificate_number
            FROM test_results tr
                     LEFT JOIN certificates cert ON cert.result_id = tr.id
            WHERE tr.id = $1 AND tr.user_id = $2
        `, [resultId, req.user.id]);

        if (!r.rows[0]) return res.status(404).json({ message: "Не найдено" });
        const result = r.rows[0];

        // Получаем ответы пользователя с типами вопросов
        const userAnswersRes = await pool.query(`
            SELECT 
                ua.question_id, 
                ua.selected_answer_ids,
                q.type as question_type,
                COALESCE(c.name, 'Без компетенции') as competence
            FROM user_answers ua
                JOIN questions q ON q.id = ua.question_id
                JOIN categories cat ON cat.id = q.category_id
                LEFT JOIN competences c ON c.id = cat.competence_id
            WHERE ua.result_id = $1
        `, [resultId]);

        const userAnswersRows = userAnswersRes?.rows || [];

        const competenceMap = new Map();

        for (const row of userAnswersRows) {
            const competenceName = row.competence || 'Без компетенции';
            if (!competenceMap.has(competenceName)) {
                competenceMap.set(competenceName, { total: 0, correct: 0 });
            }
            const comp = competenceMap.get(competenceName);
            
            // Максимальный балл за вопрос (1 или 2)
            const questionMaxScore = row.question_type === 'multiple' ? 2 : 1;
            comp.total += questionMaxScore;

            // Получаем правильные ответы для вопроса
            const correctAnswersRes = await pool.query(
                "SELECT array_agg(id) as correct_ids FROM answers WHERE question_id = $1 AND is_correct = true",
                [row.question_id]
            );
            const correctIds = (correctAnswersRes.rows[0]?.correct_ids || []).map(Number);
            const selectedIds = (row.selected_answer_ids || []).map(Number);
            
            let isCorrect = false;
            if (row.question_type === 'multiple') {
                isCorrect = correctIds.length === selectedIds.length &&
                           correctIds.length > 0 &&
                           correctIds.every(id => selectedIds.includes(id));
            } else {
                isCorrect = selectedIds.length === 1 &&
                           correctIds.length === 1 &&
                           selectedIds[0] === correctIds[0];
            }
            
            if (isCorrect) {
                comp.correct += questionMaxScore;
            }
        }

        const competences = [...competenceMap.entries()].map(([name, data]) => ({
            name,
            correct: data.correct,
            total: data.total,
            percent: data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0,
        }));

        res.json({
            resultId: result.id,
            totalCorrect: result.total_correct,
            totalQuestions: result.total_questions,
            percent: Math.round(result.percent),
            passed: result.passed,
            certificateNumber: result.certificate_number || null,
            competences,
            finishedAt: result.finished_at,
        });
    } catch (error) {
        console.error("Ошибка получения результата теста:", error);
        res.status(500).json({ message: "Ошибка сервера", error: error.message });
    }
});

app.get("/api/user/results", authenticateToken, async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                tr.id,
                tr.percent,
                tr.passed,
                tr.finished_at,
                cert.cert_number as "certificateNumber",
                c.name as "categoryName"
            FROM test_results tr
                     LEFT JOIN categories c ON c.id = tr.category_id
                     LEFT JOIN certificates cert ON cert.result_id = tr.id
            WHERE tr.user_id = $1
            ORDER BY tr.finished_at DESC
        `, [req.user.id]);

        res.json(result.rows);
    } catch (error) {
        console.error("Ошибка получения результатов:", error);
        res.status(500).json({ message: "Ошибка сервера" });
    }
});

// ==================== АДМИН-СТАТИСТИКА ====================

app.get("/api/admin/stats", authenticateToken, requireAdmin, async (req, res) => {
    try {
        const [users, questions, tests, avg, failed] = await Promise.all([
            pool.query("SELECT count(*) FROM users WHERE is_admin = false OR is_admin IS NULL"),
            pool.query("SELECT count(*) FROM questions"),
            pool.query("SELECT count(*) FROM test_results"),
            pool.query("SELECT round(avg(percent)) as round FROM test_results"),
            pool.query("SELECT count(*) FROM test_results WHERE percent < 80"),
        ]);
        res.json({
            totalUsers: +users.rows[0].count,
            totalQuestions: +questions.rows[0].count,
            totalTests: +tests.rows[0].count,
            avgPercent: +(avg.rows[0].round || 0),
            failedCount: +failed.rows[0].count,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Ошибка сервера" });
    }
});

// ==================== АДМИН-КАТЕГОРИИ ====================

app.get("/api/admin/categories", authenticateToken, requireAdmin, async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT c.*, comp.name as competence_name, COUNT(q.id) as questions_count
            FROM categories c
                     LEFT JOIN competences comp ON comp.id = c.competence_id
                     LEFT JOIN questions q ON q.category_id = c.id
            GROUP BY c.id, comp.name
            ORDER BY c.id
        `);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: "Ошибка сервера" });
    }
});

app.post("/api/admin/categories", authenticateToken, requireAdmin, async (req, res) => {
    const { name, description, competenceId } = req.body;
    try {
        const result = await pool.query(
            "INSERT INTO categories (name, description, competence_id) VALUES ($1, $2, $3) RETURNING *",
            [name, description || null, competenceId || null]
        );
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: "Ошибка сервера" });
    }
});

app.put("/api/admin/categories/:id", authenticateToken, requireAdmin, async (req, res) => {
    const { name, description, competenceId } = req.body;
    const id = req.params.id;
    try {
        const result = await pool.query(
            "UPDATE categories SET name = $1, description = $2, competence_id = $3 WHERE id = $4 RETURNING *",
            [name, description || null, competenceId || null, id]
        );
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: "Ошибка сервера" });
    }
});

app.delete("/api/admin/categories/:id", authenticateToken, requireAdmin, async (req, res) => {
    const id = req.params.id;
    try {
        await pool.query(`
            DELETE FROM user_answers
            WHERE question_id IN (SELECT id FROM questions WHERE category_id = $1)
        `, [id]);

        await pool.query(`
            DELETE FROM answers
            WHERE question_id IN (SELECT id FROM questions WHERE category_id = $1)
        `, [id]);

        await pool.query("DELETE FROM questions WHERE category_id = $1", [id]);

        await pool.query("UPDATE test_results SET category_id = NULL WHERE category_id = $1", [id]);

        await pool.query("DELETE FROM categories WHERE id = $1", [id]);

        res.json({ ok: true });
    } catch (error) {
        console.error("Ошибка удаления категории:", error);
        res.status(500).json({ message: "Ошибка сервера" });
    }
});

// ==================== АДМИН-ВОПРОСЫ ====================

app.get("/api/admin/questions", authenticateToken, requireAdmin, async (req, res) => {
    try {
        const r = await pool.query(`
            SELECT q.id, q.text, q.type, q.category_id,
                   count(DISTINCT a.id) as answers_count
            FROM questions q
                     LEFT JOIN answers a ON a.question_id = q.id
            GROUP BY q.id
            ORDER BY q.id
        `);
        res.json(r.rows);
    } catch (error) {
        res.status(500).json({ message: "Ошибка сервера" });
    }
});

app.get("/api/admin/questions/:id/details", authenticateToken, requireAdmin, async (req, res) => {
    try {
        const q = await pool.query("SELECT id, text, type, category_id FROM questions WHERE id = $1", [req.params.id]);
        if (q.rows.length === 0) return res.status(404).json({ message: "Вопрос не найден" });

        const answers = await pool.query("SELECT id, text, is_correct FROM answers WHERE question_id = $1 ORDER BY id", [req.params.id]);

        res.json({
            ...q.rows[0],
            answers: answers.rows
        });
    } catch (error) {
        res.status(500).json({ message: "Ошибка сервера" });
    }
});

app.post("/api/admin/questions", authenticateToken, requireAdmin, async (req, res) => {
    const { text, type, categoryId, answers } = req.body;
    if (!categoryId) {
        return res.status(400).json({ message: "Выберите категорию" });
    }
    try {
        const q = await pool.query(
            "INSERT INTO questions (text, type, category_id) VALUES ($1, $2, $3) RETURNING id",
            [text, type, categoryId]
        );
        const qId = q.rows[0].id;
        for (const ans of answers) {
            await pool.query(
                "INSERT INTO answers (question_id, text, is_correct) VALUES ($1, $2, $3)",
                [qId, ans.text, ans.isCorrect]
            );
        }
        res.json({ id: qId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Ошибка сервера" });
    }
});

app.put("/api/admin/questions/:id", authenticateToken, requireAdmin, async (req, res) => {
    const { text, type, categoryId, answers } = req.body;
    const qId = req.params.id;
    try {
        await pool.query(
            "UPDATE questions SET text=$1, type=$2, category_id=$3 WHERE id=$4",
            [text, type, categoryId, qId]
        );
        await pool.query("DELETE FROM answers WHERE question_id=$1", [qId]);
        for (const ans of answers) {
            await pool.query(
                "INSERT INTO answers (question_id, text, is_correct) VALUES ($1, $2, $3)",
                [qId, ans.text, ans.isCorrect]
            );
        }
        res.json({ ok: true });
    } catch (error) {
        res.status(500).json({ message: "Ошибка сервера" });
    }
});

app.delete("/api/admin/questions/:id", authenticateToken, requireAdmin, async (req, res) => {
    try {
        const questionId = req.params.id;

        await pool.query("DELETE FROM user_answers WHERE question_id = $1", [questionId]);

        await pool.query("DELETE FROM answers WHERE question_id = $1", [questionId]);

        await pool.query("DELETE FROM questions WHERE id = $1", [questionId]);

        res.json({ ok: true });
    } catch (error) {
        console.error("Ошибка удаления вопроса:", error);
        res.status(500).json({ message: "Ошибка сервера" });
    }
});

// ==================== АДМИН-КОМПЕТЕНЦИИ ====================

app.post("/api/admin/competences", authenticateToken, requireAdmin, async (req, res) => {
    const { name } = req.body;
    try {
        const r = await pool.query("INSERT INTO competences (name) VALUES ($1) RETURNING id, name", [name]);
        res.json(r.rows[0]);
    } catch (error) {
        res.status(500).json({ message: "Ошибка сервера" });
    }
});

app.delete("/api/admin/competences/:id", authenticateToken, requireAdmin, async (req, res) => {
    try {
        const competenceId = req.params.id;

        const categories = await pool.query("SELECT id FROM categories WHERE competence_id = $1", [competenceId]);

        for (const cat of categories.rows) {
            await pool.query(`
                DELETE FROM user_answers
                WHERE question_id IN (SELECT id FROM questions WHERE category_id = $1)
            `, [cat.id]);

            await pool.query(`
                DELETE FROM answers
                WHERE question_id IN (SELECT id FROM questions WHERE category_id = $1)
            `, [cat.id]);

            await pool.query("DELETE FROM questions WHERE category_id = $1", [cat.id]);

            await pool.query("UPDATE test_results SET category_id = NULL WHERE category_id = $1", [cat.id]);
        }

        await pool.query("DELETE FROM categories WHERE competence_id = $1", [competenceId]);

        await pool.query("DELETE FROM competences WHERE id = $1", [competenceId]);

        res.json({ ok: true });
    } catch (error) {
        console.error("Ошибка удаления компетенции:", error);
        res.status(500).json({ message: "Ошибка сервера" });
    }
});

// ==================== АДМИН-СЕРТИФИКАТЫ ====================

app.get("/api/admin/certificates", authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { category, dateFrom, dateTo } = req.query;

        let query = `
            SELECT
                c.id,
                c.cert_number,
                u.name as user_name,
                u.email as user_email,
                cat.name as category_name,
                tr.percent as score,
                c.issued_at,
                comp.name as competence_name
            FROM certificates c
                     JOIN users u ON u.id = c.user_id
                     JOIN test_results tr ON tr.id = c.result_id
                     JOIN categories cat ON cat.id = tr.category_id
                     LEFT JOIN competences comp ON comp.id = cat.competence_id
            WHERE 1=1
        `;

        const params = [];
        let paramIndex = 1;

        if (category && category.trim() !== "") {
            const categoryId = parseInt(category, 10);
            if (!isNaN(categoryId)) {
                query += ` AND cat.id = $${paramIndex++}`;
                params.push(categoryId);
            }
        }

        if (dateFrom && dateFrom.trim() !== "") {
            query += ` AND c.issued_at >= $${paramIndex++}`;
            params.push(dateFrom);
        }

        if (dateTo && dateTo.trim() !== "") {
            query += ` AND c.issued_at <= $${paramIndex++}`;
            params.push(dateTo);
        }

        query += ` ORDER BY c.issued_at DESC`;

        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (error) {
        console.error("Ошибка получения сертификатов:", error);
        res.status(500).json({ message: "Ошибка сервера" });
    }
});

app.get("/api/admin/certificates/stats", authenticateToken, requireAdmin, async (req, res) => {
    try {
        const dailyStats = await pool.query(`
            SELECT
                DATE(issued_at) as issued_date,
                COUNT(*) as issued_count
            FROM certificates
            GROUP BY DATE(issued_at)
            ORDER BY issued_date DESC
                LIMIT 30
        `);

        const competenceStats = await pool.query(`
            SELECT
                COALESCE(comp.name, 'Без компетенции') as competence_name,
                COUNT(c.id) as certificates_count,
                COALESCE(ROUND(AVG(tr.percent)), 0) as avg_score
            FROM certificates c
                     JOIN test_results tr ON tr.id = c.result_id
                     JOIN categories cat ON cat.id = tr.category_id
                     LEFT JOIN competences comp ON comp.id = cat.competence_id
            GROUP BY comp.name
            ORDER BY certificates_count DESC
        `);

        const totalStats = await pool.query(`
            SELECT
                COUNT(*) as total,
                COUNT(DISTINCT user_id) as unique_users
            FROM certificates
        `);

        res.json({
            total: totalStats.rows[0],
            daily: dailyStats.rows,
            byCompetence: competenceStats.rows
        });
    } catch (error) {
        console.error("Ошибка получения статистики сертификатов:", error);
        res.status(500).json({ message: "Ошибка сервера" });
    }
});

app.get("/api/admin/certificates/:id", authenticateToken, requireAdmin, async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) {
            return res.status(400).json({ message: "Неверный ID сертификата" });
        }

        const result = await pool.query(`
            SELECT
                c.id,
                c.cert_number,
                u.id as user_id,
                u.name as user_name,
                u.email as user_email,
                cat.id as category_id,
                cat.name as category_name,
                tr.percent as score,
                tr.total_correct,
                tr.total_questions,
                c.issued_at,
                comp.name as competence_name,
                comp.id as competence_id
            FROM certificates c
                     JOIN users u ON u.id = c.user_id
                     JOIN test_results tr ON tr.id = c.result_id
                     JOIN categories cat ON cat.id = tr.category_id
                     LEFT JOIN competences comp ON comp.id = cat.competence_id
            WHERE c.id = $1
        `, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Сертификат не найден" });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error("Ошибка получения сертификата:", error);
        res.status(500).json({ message: "Ошибка сервера" });
    }
});


const startServer = async () => {
    await initDatabase();
    setupEmailTransporter();
    scheduleDataCleanup();
    
    console.log(`\nСервер запущен на порту ${PORT}`);
    console.log(`Режим: ${isDev ? 'РАЗРАБОТКА' : 'PRODUCTION'}`);
    
    if (isDev) {
        console.log(` В режиме разработки API возвращает прямую ссылку для сброса пароля`);
    }
    
    app.listen(PORT, () => {});
};

startServer();