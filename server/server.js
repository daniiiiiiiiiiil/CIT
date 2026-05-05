require('dotenv').config();
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const pool = require("./db");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    credentials: true
}));
app.use(express.json());

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

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
        await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false`);
        console.log('Таблица users готова');

        await pool.query(`
            CREATE TABLE IF NOT EXISTS sessions (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                token VARCHAR(500) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('Таблица sessions готова');

        await pool.query(`
            CREATE TABLE IF NOT EXISTS competences (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                description TEXT
            )
        `);
        console.log('Таблица competences готова');

        await pool.query(`
            CREATE TABLE IF NOT EXISTS questions (
                id SERIAL PRIMARY KEY,
                text TEXT NOT NULL,
                type VARCHAR(20) DEFAULT 'single',
                competence_id INTEGER REFERENCES competences(id) ON DELETE SET NULL
            )
        `);
        console.log('Таблица questions готова');

        await pool.query(`
            CREATE TABLE IF NOT EXISTS answers (
                id SERIAL PRIMARY KEY,
                question_id INTEGER REFERENCES questions(id) ON DELETE CASCADE,
                text TEXT NOT NULL,
                is_correct BOOLEAN DEFAULT false
            )
        `);
        console.log('Таблица answers готова');

        await pool.query(`
            CREATE TABLE IF NOT EXISTS test_results (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                total_correct INTEGER,
                total_questions INTEGER,
                percent NUMERIC(5,2),
                passed BOOLEAN DEFAULT false,
                finished_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('Таблица test_results готова');

        await pool.query(`
            CREATE TABLE IF NOT EXISTS user_answers (
                id SERIAL PRIMARY KEY,
                result_id INTEGER REFERENCES test_results(id) ON DELETE CASCADE,
                question_id INTEGER REFERENCES questions(id),
                selected_answer_ids INTEGER[]
            )
        `);
        console.log('Таблица user_answers готова');

        await pool.query(`
            CREATE TABLE IF NOT EXISTS certificates (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id),
                result_id INTEGER REFERENCES test_results(id),
                cert_number VARCHAR(100) UNIQUE,
                issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('Таблица certificates готова');

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

        console.log('База данных готова к работе!');
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

app.post("/api/register", async (req, res) => {
    const { email, password, name } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email и пароль обязательны" });
    if (password.length < 6) return res.status(400).json({ message: "Пароль должен быть минимум 6 символов" });
    try {
        const existingUser = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if (existingUser.rows.length > 0) return res.status(400).json({ message: "Пользователь уже существует" });
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await pool.query(
            "INSERT INTO users (email, password, name) VALUES ($1, $2, $3) RETURNING id, email, name, is_admin",
            [email, hashedPassword, name || email.split('@')[0]]
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
        const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
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

app.get("/api/competences", async (req, res) => {
    try {
        const r = await pool.query("SELECT id, name FROM competences ORDER BY id");
        res.json(r.rows);
    } catch (error) {
        res.status(500).json({ message: "Ошибка сервера" });
    }
});

app.get("/api/questions", authenticateToken, async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT q.id, q.text, q.type, c.name as competence,
                   json_agg(json_build_object('id', a.id, 'text', a.text) ORDER BY a.id) as answers
            FROM questions q
            LEFT JOIN competences c ON c.id = q.competence_id
            LEFT JOIN answers a ON a.question_id = q.id
            GROUP BY q.id, c.name
            ORDER BY q.id
        `);
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Ошибка сервера" });
    }
});

app.post("/api/test/submit", authenticateToken, async (req, res) => {
    const { answers } = req.body;
    const userId = req.user.id;
    try {
        const questionsRes = await pool.query(`
            SELECT q.id, array_agg(a.id) filter (where a.is_correct) as correct_ids
            FROM questions q
            LEFT JOIN answers a ON a.question_id = q.id
            GROUP BY q.id
        `);
        const questionsMap = Object.fromEntries(
            questionsRes.rows.map(q => [q.id, (q.correct_ids || []).map(Number)])
        );
        const totalQuestions = questionsRes.rows.length;
        let totalCorrect = 0;

        for (const ans of answers) {
            const correct = questionsMap[ans.questionId] || [];
            const selected = (ans.selectedAnswers || []).map(Number);
            const isCorrect = correct.length === selected.length && correct.every(id => selected.includes(id));
            if (isCorrect) totalCorrect++;
        }

        const percent = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
        const passed = percent >= 80;

        const resultRes = await pool.query(
            `INSERT INTO test_results (user_id, total_correct, total_questions, percent, passed) VALUES ($1,$2,$3,$4,$5) RETURNING id`,
            [userId, totalCorrect, totalQuestions, percent, passed]
        );
        const resultId = resultRes.rows[0].id;

        for (const ans of answers) {
            await pool.query(
                `INSERT INTO user_answers (result_id, question_id, selected_answer_ids) VALUES ($1,$2,$3)`,
                [resultId, ans.questionId, ans.selectedAnswers || []]
            );
        }

        let certificateNumber = null;
        if (passed) {
            certificateNumber = `PROF-${new Date().getFullYear()}-${String(resultId).padStart(5, '0')}`;
            await pool.query(
                `INSERT INTO certificates (user_id, result_id, cert_number) VALUES ($1,$2,$3)`,
                [userId, resultId, certificateNumber]
            );
        }

        res.json({ resultId, percent, passed, certificateNumber });
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

        const userAnswersRes = await pool.query(`
            SELECT ua.question_id, ua.selected_answer_ids,
                   c.name as competence,
                   array_agg(a.id) filter (where a.is_correct) as correct_ids
            FROM user_answers ua
            JOIN questions q ON q.id = ua.question_id
            JOIN competences c ON c.id = q.competence_id
            LEFT JOIN answers a ON a.question_id = q.id
            WHERE ua.result_id = $1
            GROUP BY ua.question_id, ua.selected_answer_ids, c.name
        `, [resultId]);

        const competenceMap = new Map();
        for (const row of userAnswersRes.rows) {
            if (!competenceMap.has(row.competence)) competenceMap.set(row.competence, { correct: 0, total: 0 });
            const comp = competenceMap.get(row.competence);
            comp.total++;
            const correctIds = (row.correct_ids || []).map(Number);
            const selectedIds = (row.selected_answer_ids || []).map(Number);
            const isCorrect = correctIds.length === selectedIds.length && correctIds.every(id => selectedIds.includes(id));
            if (isCorrect) comp.correct++;
        }

        const competences = [...competenceMap.entries()].map(([name, data]) => ({
            name, correct: data.correct, total: data.total,
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
        console.error(error);
        res.status(500).json({ message: "Ошибка сервера" });
    }
});

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

app.get("/api/admin/questions", authenticateToken, requireAdmin, async (req, res) => {
    try {
        const r = await pool.query(`
            SELECT q.id, q.text, q.type, q.competence_id, c.name as competence_name,
                   count(a.id) as answers_count
            FROM questions q
            LEFT JOIN competences c ON c.id = q.competence_id
            LEFT JOIN answers a ON a.question_id = q.id
            GROUP BY q.id, c.name
            ORDER BY q.id
        `);
        res.json(r.rows);
    } catch (error) {
        res.status(500).json({ message: "Ошибка сервера" });
    }
});

app.post("/api/admin/questions", authenticateToken, requireAdmin, async (req, res) => {
    const { text, type, competenceId, answers } = req.body;
    try {
        const q = await pool.query(
            "INSERT INTO questions (text, type, competence_id) VALUES ($1,$2,$3) RETURNING id",
            [text, type, competenceId]
        );
        const qId = q.rows[0].id;
        for (const ans of answers) {
            await pool.query("INSERT INTO answers (question_id, text, is_correct) VALUES ($1,$2,$3)", [qId, ans.text, ans.isCorrect]);
        }
        res.json({ id: qId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Ошибка сервера" });
    }
});

app.put("/api/admin/questions/:id", authenticateToken, requireAdmin, async (req, res) => {
    const { text, type, competenceId, answers } = req.body;
    const qId = req.params.id;
    try {
        await pool.query("UPDATE questions SET text=$1, type=$2, competence_id=$3 WHERE id=$4", [text, type, competenceId, qId]);
        await pool.query("DELETE FROM answers WHERE question_id=$1", [qId]);
        for (const ans of answers) {
            await pool.query("INSERT INTO answers (question_id, text, is_correct) VALUES ($1,$2,$3)", [qId, ans.text, ans.isCorrect]);
        }
        res.json({ ok: true });
    } catch (error) {
        res.status(500).json({ message: "Ошибка сервера" });
    }
});

app.delete("/api/admin/questions/:id", authenticateToken, requireAdmin, async (req, res) => {
    try {
        await pool.query("DELETE FROM questions WHERE id=$1", [req.params.id]);
        res.json({ ok: true });
    } catch (error) {
        res.status(500).json({ message: "Ошибка сервера" });
    }
});

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
        await pool.query("DELETE FROM competences WHERE id=$1", [req.params.id]);
        res.json({ ok: true });
    } catch (error) {
        res.status(500).json({ message: "Ошибка сервера" });
    }
});

const startServer = async () => {
    await initDatabase();
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};

startServer();