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
        const questionsRes = await pool.query(
            `SELECT q.id, q.competence_id,
                    array_agg(a.id) filter (where a.is_correct) as correct_ids
             FROM questions q
             LEFT JOIN answers a ON a.question_id = q.id
             GROUP BY q.id`
        );
        const questionsMap = Object.fromEntries(
            questionsRes.rows.map(q => [q.id, q.correct_ids || []])
        );

        let totalCorrect = 0;
        const totalQuestions = questionsRes.rows.length;

        for (const ans of answers) {
            const correct = questionsMap[ans.questionId] || [];
            const selected = ans.selectedAnswers || [];
            const isCorrect =
                correct.length === selected.length &&
                correct.every(id => selected.includes(id));
            if (isCorrect) totalCorrect++;
        }

        const percent = totalQuestions > 0
            ? Math.round((totalCorrect / totalQuestions) * 100)
            : 0;
        const passed = percent >= 80;

        const resultRes = await pool.query(
            `INSERT INTO test_results (user_id, total_correct, total_questions, percent, passed)
             VALUES ($1, $2, $3, $4, $5) RETURNING id`,
            [userId, totalCorrect, totalQuestions, percent, passed]
        );
        const resultId = resultRes.rows[0].id;

        for (const ans of answers) {
            await pool.query(
                `INSERT INTO user_answers (result_id, question_id, selected_answer_ids)
                 VALUES ($1, $2, $3)`,
                [resultId, ans.questionId, ans.selectedAnswers]
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

        res.json({ resultId, percent, passed, certificateNumber });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Ошибка сервера" });
    }
});

app.get("/api/test/result/:id", authenticateToken, async (req, res) => {
    const resultId = parseInt(req.params.id);
    try {
        const r = await pool.query(
            `SELECT tr.*, cert.cert_number as certificate_number
             FROM test_results tr
                      LEFT JOIN certificates cert ON cert.result_id = tr.id
             WHERE tr.id = $1 AND tr.user_id = $2`,
            [resultId, req.user.id]
        );
        if (!r.rows[0]) return res.status(404).json({ message: "Не найдено" });

        const result = r.rows[0];

        const userAnswersRes = await pool.query(`
            SELECT ua.question_id, ua.selected_answer_ids,
                   q.competence_id, c.name as competence,
                   array_agg(a.id) filter (where a.is_correct) as correct_ids
            FROM user_answers ua
                     JOIN questions q ON q.id = ua.question_id
                     JOIN competences c ON c.id = q.competence_id
                     LEFT JOIN answers a ON a.question_id = q.id
            WHERE ua.result_id = $1
            GROUP BY ua.question_id, ua.selected_answer_ids, q.competence_id, c.name
        `, [resultId]);

        const competenceMap = new Map();
        for (const row of userAnswersRes.rows) {
            const compName = row.competence;
            if (!competenceMap.has(compName)) {
                competenceMap.set(compName, { correct: 0, total: 0 });
            }
            const comp = competenceMap.get(compName);
            comp.total++;

            const correctIds = row.correct_ids || [];
            const selectedIds = row.selected_answer_ids || [];
            const isCorrect = correctIds.length === selectedIds.length &&
                correctIds.every(id => selectedIds.includes(id));
            if (isCorrect) comp.correct++;
        }

        const competences = [];
        for (const [name, data] of competenceMap.entries()) {
            competences.push({
                name: name,
                correct: data.correct,
                total: data.total,
                percent: Math.round((data.correct / data.total) * 100),
            });
        }

        res.json({
            resultId: result.id,
            totalCorrect: result.total_correct,
            totalQuestions: result.total_questions,
            percent: Math.round(result.percent),
            passed: result.passed,
            certificateNumber: result.certificate_number || null,
            competences: competences,
            finishedAt: result.finished_at,
        });
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

const requireAdmin = async (req, res, next) => {
    const r = await pool.query("SELECT is_admin FROM users WHERE id = $1", [req.user.id]);
    if (!r.rows[0]?.is_admin) return res.status(403).json({ message: "Нет доступа" });
    next();
};

app.get("/api/admin/stats", authenticateToken, requireAdmin, async (req, res) => {
    try {
        const [users, questions, tests, avg, failed] = await Promise.all([
            pool.query("SELECT count(*) FROM users WHERE is_admin = false"),
            pool.query("SELECT count(*) FROM questions"),
            pool.query("SELECT count(*) FROM test_results"),
            pool.query("SELECT round(avg(percent)) FROM test_results"),
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
            "INSERT INTO questions (text, type, competence_id) VALUES ($1, $2, $3) RETURNING id",
            [text, type, competenceId]
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
        res.status(500).json({ message: "Ошибка сервера" });
    }
});

app.put("/api/admin/questions/:id", authenticateToken, requireAdmin, async (req, res) => {
    const { text, type, competenceId, answers } = req.body;
    const qId = req.params.id;
    try {
        await pool.query(
            "UPDATE questions SET text=$1, type=$2, competence_id=$3 WHERE id=$4",
            [text, type, competenceId, qId]
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
        await pool.query("DELETE FROM questions WHERE id=$1", [req.params.id]);
        res.json({ ok: true });
    } catch (error) {
        res.status(500).json({ message: "Ошибка сервера" });
    }
});

app.post("/api/admin/competences", authenticateToken, requireAdmin, async (req, res) => {
    const { name } = req.body;
    try {
        const r = await pool.query("INSERT INTO competences (name) VALUES ($1) RETURNING id", [name]);
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
