const initialTests = [
    {
        name: "Frontend Development",
        description: "HTML, CSS, JavaScript, React и современные веб-технологии",
        competence: "Web Development",
        questions: [
            {
                text: "Что означает HTML?",
                type: "single",
                answers: [
                    { text: "Hyper Text Markup Language", isCorrect: true },
                    { text: "High Tech Modern Language", isCorrect: false },
                    { text: "Home Tool Markup Language", isCorrect: false },
                    { text: "Hyper Transfer Markup Language", isCorrect: false }
                ]
            },
            {
                text: "Какие из следующих являются фреймворками JavaScript?",
                type: "multiple",
                answers: [
                    { text: "React", isCorrect: true },
                    { text: "Angular", isCorrect: true },
                    { text: "Vue.js", isCorrect: true },
                    { text: "Django", isCorrect: false }
                ]
            },
            {
                text: "Что такое CSS?",
                type: "single",
                answers: [
                    { text: "Язык стилей для веб-страниц", isCorrect: true },
                    { text: "Язык программирования", isCorrect: false },
                    { text: "База данных", isCorrect: false },
                    { text: "Серверный язык", isCorrect: false }
                ]
            },
            {
                text: "Какие значения имеет свойство position в CSS?",
                type: "multiple",
                answers: [
                    { text: "static", isCorrect: true },
                    { text: "relative", isCorrect: true },
                    { text: "absolute", isCorrect: true },
                    { text: "fixed", isCorrect: true }
                ]
            },
            {
                text: "Что такое TypeScript?",
                type: "single",
                answers: [
                    { text: "Типизированное надмножество JavaScript", isCorrect: true },
                    { text: "Новый браузер", isCorrect: false },
                    { text: "База данных", isCorrect: false },
                    { text: "Операционная система", isCorrect: false }
                ]
            },
            {
                text: "Какие хуки есть в React?",
                type: "multiple",
                answers: [
                    { text: "useState", isCorrect: true },
                    { text: "useEffect", isCorrect: true },
                    { text: "useContext", isCorrect: true },
                    { text: "useDatabase", isCorrect: false }
                ]
            },
            {
                text: "Что делает команда 'git clone'?",
                type: "single",
                answers: [
                    { text: "Копирует репозиторий", isCorrect: true },
                    { text: "Удаляет репозиторий", isCorrect: false },
                    { text: "Создает новый файл", isCorrect: false },
                    { text: "Обновляет код", isCorrect: false }
                ]
            },
            {
                text: "Какие типы данных существуют в JavaScript?",
                type: "multiple",
                answers: [
                    { text: "String", isCorrect: true },
                    { text: "Number", isCorrect: true },
                    { text: "Boolean", isCorrect: true },
                    { text: "Character", isCorrect: false }
                ]
            },
            {
                text: "Что такое REST API?",
                type: "single",
                answers: [
                    { text: "Архитектурный стиль для API", isCorrect: true },
                    { text: "База данных", isCorrect: false },
                    { text: "Язык программирования", isCorrect: false },
                    { text: "Фреймворк", isCorrect: false }
                ]
            },
            {
                text: "Какие методы HTTP существуют?",
                type: "multiple",
                answers: [
                    { text: "GET", isCorrect: true },
                    { text: "POST", isCorrect: true },
                    { text: "PUT", isCorrect: true },
                    { text: "DELETE", isCorrect: true }
                ]
            }
        ]
    },
    {
        name: "Backend Development",
        description: "Node.js, Python, базы данных, серверные технологии",
        competence: "Web Development",
        questions: [
            {
                text: "Что такое Node.js?",
                type: "single",
                answers: [
                    { text: "Среда выполнения JavaScript на сервере", isCorrect: true },
                    { text: "Фреймворк для фронтенда", isCorrect: false },
                    { text: "База данных", isCorrect: false },
                    { text: "Язык программирования", isCorrect: false }
                ]
            },
            {
                text: "Какие базы данных являются NoSQL?",
                type: "multiple",
                answers: [
                    { text: "MongoDB", isCorrect: true },
                    { text: "Cassandra", isCorrect: true },
                    { text: "PostgreSQL", isCorrect: false },
                    { text: "Redis", isCorrect: true }
                ]
            },
            {
                text: "Что такое JWT?",
                type: "single",
                answers: [
                    { text: "JSON Web Token для аутентификации", isCorrect: true },
                    { text: "Java Web Tool", isCorrect: false },
                    { text: "JavaScript Window Toolkit", isCorrect: false },
                    { text: "Just Web Technology", isCorrect: false }
                ]
            },
            {
                text: "Какие принципы SOLID существуют?",
                type: "multiple",
                answers: [
                    { text: "Single Responsibility", isCorrect: true },
                    { text: "Open/Closed", isCorrect: true },
                    { text: "Liskov Substitution", isCorrect: true },
                    { text: "Database First", isCorrect: false }
                ]
            },
            {
                text: "Что означает SQL?",
                type: "single",
                answers: [
                    { text: "Structured Query Language", isCorrect: true },
                    { text: "Simple Query Language", isCorrect: false },
                    { text: "System Query Language", isCorrect: false },
                    { text: "Standard Query Language", isCorrect: false }
                ]
            }
        ]
    },
    {
        name: "Database Management",
        description: "SQL, PostgreSQL, MongoDB, оптимизация запросов",
        competence: "Data & Databases",
        questions: [
            {
                text: "Что такое первичный ключ в базе данных?",
                type: "single",
                answers: [
                    { text: "Уникальный идентификатор записи", isCorrect: true },
                    { text: "Внешний ключ", isCorrect: false },
                    { text: "Индекс", isCorrect: false },
                    { text: "Триггер", isCorrect: false }
                ]
            },
            {
                text: "Какие операции относятся к CRUD?",
                type: "multiple",
                answers: [
                    { text: "Create", isCorrect: true },
                    { text: "Read", isCorrect: true },
                    { text: "Update", isCorrect: true },
                    { text: "Delete", isCorrect: true }
                ]
            },
            {
                text: "Что такое JOIN в SQL?",
                type: "single",
                answers: [
                    { text: "Объединение таблиц", isCorrect: true },
                    { text: "Сортировка данных", isCorrect: false },
                    { text: "Фильтрация", isCorrect: false },
                    { text: "Группировка", isCorrect: false }
                ]
            }
        ]
    },
    {
        name: "DevOps & Cloud",
        description: "Docker, Kubernetes, CI/CD, облачные технологии",
        competence: "DevOps",
        questions: [
            {
                text: "Что такое Docker?",
                type: "single",
                answers: [
                    { text: "Платформа для контейнеризации", isCorrect: true },
                    { text: "Операционная система", isCorrect: false },
                    { text: "Язык программирования", isCorrect: false },
                    { text: "База данных", isCorrect: false }
                ]
            },
            {
                text: "Какие облачные провайдеры существуют?",
                type: "multiple",
                answers: [
                    { text: "AWS", isCorrect: true },
                    { text: "Google Cloud", isCorrect: true },
                    { text: "Azure", isCorrect: true },
                    { text: "Docker Cloud", isCorrect: false }
                ]
            },
            {
                text: "Что такое CI/CD?",
                type: "single",
                answers: [
                    { text: "Непрерывная интеграция и доставка", isCorrect: true },
                    { text: "Центральный интерфейс", isCorrect: false },
                    { text: "Код интеграции", isCorrect: false },
                    { text: "Компилятор", isCorrect: false }
                ]
            }
        ]
    },
    {
        name: "Cybersecurity",
        description: "Защита информации, шифрование, безопасность сетей",
        competence: "Security",
        questions: [
            {
                text: "Что такое SSL/TLS?",
                type: "single",
                answers: [
                    { text: "Протоколы шифрования", isCorrect: true },
                    { text: "Язык программирования", isCorrect: false },
                    { text: "База данных", isCorrect: false },
                    { text: "Операционная система", isCorrect: false }
                ]
            },
            {
                text: "Какие виды атак существуют?",
                type: "multiple",
                answers: [
                    { text: "DDoS", isCorrect: true },
                    { text: "Phishing", isCorrect: true },
                    { text: "Man-in-the-Middle", isCorrect: true },
                    { text: "SQL Injection", isCorrect: true }
                ]
            },
            {
                text: "Что такое двухфакторная аутентификация?",
                type: "single",
                answers: [
                    { text: "Дополнительный уровень защиты", isCorrect: true },
                    { text: "Пароль из двух символов", isCorrect: false },
                    { text: "Биометрическая защита", isCorrect: false },
                    { text: "Сетевой экран", isCorrect: false }
                ]
            }
        ]
    },
    {
        name: "Mobile Development",
        description: "iOS, Android, React Native, Flutter",
        competence: "Mobile",
        questions: [
            {
                text: "Какие фреймворки для кроссплатформенной мобильной разработки существуют?",
                type: "multiple",
                answers: [
                    { text: "React Native", isCorrect: true },
                    { text: "Flutter", isCorrect: true },
                    { text: "Xamarin", isCorrect: true },
                    { text: "Swift", isCorrect: false }
                ]
            },
            {
                text: "Какой язык используется для iOS разработки?",
                type: "single",
                answers: [
                    { text: "Swift", isCorrect: true },
                    { text: "Kotlin", isCorrect: false },
                    { text: "Java", isCorrect: false },
                    { text: "Python", isCorrect: false }
                ]
            }
        ]
    },
    {
        name: "Data Science",
        description: "Анализ данных, машинное обучение, Python",
        competence: "Data Science",
        questions: [
            {
                text: "Какие библиотеки Python используются для Data Science?",
                type: "multiple",
                answers: [
                    { text: "Pandas", isCorrect: true },
                    { text: "NumPy", isCorrect: true },
                    { text: "Scikit-learn", isCorrect: true },
                    { text: "Django", isCorrect: false }
                ]
            },
            {
                text: "Что такое машинное обучение?",
                type: "single",
                answers: [
                    { text: "Обучение моделей на данных", isCorrect: true },
                    { text: "Сбор данных", isCorrect: false },
                    { text: "Визуализация", isCorrect: false },
                    { text: "Хранение данных", isCorrect: false }
                ]
            }
        ]
    },
    {
        name: "System Architecture",
        description: "Микросервисы, архитектурные паттерны, масштабирование",
        competence: "Architecture",
        questions: [
            {
                text: "Что такое микросервисная архитектура?",
                type: "single",
                answers: [
                    { text: "Разделение приложения на независимые сервисы", isCorrect: true },
                    { text: "Монолитное приложение", isCorrect: false },
                    { text: "База данных", isCorrect: false },
                    { text: "Фронтенд фреймворк", isCorrect: false }
                ]
            },
            {
                text: "Какие архитектурные паттерны существуют?",
                type: "multiple",
                answers: [
                    { text: "MVC", isCorrect: true },
                    { text: "MVP", isCorrect: true },
                    { text: "MVVM", isCorrect: true },
                    { text: "MVI", isCorrect: true }
                ]
            }
        ]
    },
    {
        name: "Testing & QA",
        description: "Unit-тесты, E2E, автоматизация тестирования",
        competence: "Quality Assurance",
        questions: [
            {
                text: "Какие типы тестирования существуют?",
                type: "multiple",
                answers: [
                    { text: "Unit тесты", isCorrect: true },
                    { text: "Интеграционные тесты", isCorrect: true },
                    { text: "E2E тесты", isCorrect: true },
                    { text: "Компиляция", isCorrect: false }
                ]
            },
            {
                text: "Что такое TDD?",
                type: "single",
                answers: [
                    { text: "Test-Driven Development", isCorrect: true },
                    { text: "Technical Design Document", isCorrect: false },
                    { text: "Test Data Definition", isCorrect: false },
                    { text: "Time Division Duplexing", isCorrect: false }
                ]
            }
        ]
    },
    {
        name: "Git & Version Control",
        description: "Git, GitHub, GitLab, управление версиями",
        competence: "DevOps",
        questions: [
            {
                text: "Какие основные команды Git существуют?",
                type: "multiple",
                answers: [
                    { text: "git commit", isCorrect: true },
                    { text: "git push", isCorrect: true },
                    { text: "git pull", isCorrect: true },
                    { text: "git deploy", isCorrect: false }
                ]
            },
            {
                text: "Что такое ветка в Git?",
                type: "single",
                answers: [
                    { text: "Отдельная линия разработки", isCorrect: true },
                    { text: "Тип документа", isCorrect: false },
                    { text: "Команда", isCorrect: false },
                    { text: "Сервер", isCorrect: false }
                ]
            },
            {
                text: "Что делает git merge?",
                type: "single",
                answers: [
                    { text: "Объединяет ветки", isCorrect: true },
                    { text: "Создает ветку", isCorrect: false },
                    { text: "Удаляет ветку", isCorrect: false },
                    { text: "Сохраняет изменения", isCorrect: false }
                ]
            }
        ]
    }
];

async function setupInitialTests(pool) {
    console.log('📚 Проверка и добавление начальных тестов...');

    try {
        for (const test of initialTests) {
            // Проверяем, существует ли уже такая категория
            const existingCategory = await pool.query(
                'SELECT id FROM categories WHERE name = $1',
                [test.name]
            );

            if (existingCategory.rows.length === 0) {
                console.log(`  ➕ Добавление категории: ${test.name}`);

                // Добавляем компетенцию
                let competenceId;
                const existingComp = await pool.query(
                    'SELECT id FROM competences WHERE name = $1',
                    [test.competence]
                );

                if (existingComp.rows.length === 0) {
                    const newComp = await pool.query(
                        'INSERT INTO competences (name, description) VALUES ($1, $2) RETURNING id',
                        [test.competence, `Компетенция: ${test.competence}`]
                    );
                    competenceId = newComp.rows[0].id;
                    console.log(`    📌 Добавлена компетенция: ${test.competence}`);
                } else {
                    competenceId = existingComp.rows[0].id;
                }

                // Добавляем категорию
                const category = await pool.query(
                    'INSERT INTO categories (name, description, competence_id) VALUES ($1, $2, $3) RETURNING id',
                    [test.name, test.description, competenceId]
                );
                const categoryId = category.rows[0].id;
                console.log(`    📁 Категория добавлена с ID: ${categoryId}`);

                // Добавляем вопросы и ответы
                for (let i = 0; i < test.questions.length; i++) {
                    const question = test.questions[i];
                    const q = await pool.query(
                        'INSERT INTO questions (text, type, category_id) VALUES ($1, $2, $3) RETURNING id',
                        [question.text, question.type, categoryId]
                    );
                    const questionId = q.rows[0].id;

                    for (const answer of question.answers) {
                        await pool.query(
                            'INSERT INTO answers (question_id, text, is_correct) VALUES ($1, $2, $3)',
                            [questionId, answer.text, answer.isCorrect]
                        );
                    }
                    console.log(`    ❓ Вопрос ${i + 1}/${test.questions.length} добавлен`);
                }
                console.log(`  ✅ Категория "${test.name}" полностью добавлена (${test.questions.length} вопросов)`);
            } else {
                console.log(`  ⏭️ Категория уже существует: ${test.name}`);
            }
        }
        console.log('✅ Все начальные тесты успешно добавлены!');
    } catch (error) {
        console.error('❌ Ошибка при добавлении начальных тестов:', error);
    }
}

module.exports = { setupInitialTests };