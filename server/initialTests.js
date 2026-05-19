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
                text: "Какие из следующих являются фреймворками/библиотеками JavaScript?",
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
                text: "Что такое REST API?",
                type: "single",
                answers: [
                    { text: "Архитектурный стиль для проектирования сетевых приложений", isCorrect: true },
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
            },
            {
                text: "Что такое Virtual DOM в React?",
                type: "single",
                answers: [
                    { text: "Лёгкая копия реального DOM для оптимизации обновлений", isCorrect: true },
                    { text: "Реальный DOM браузера", isCorrect: false },
                    { text: "База данных компонентов", isCorrect: false },
                    { text: "Файловая система React", isCorrect: false }
                ]
            },
            {
                text: "Какие свойства Flexbox управляют выравниванием элементов?",
                type: "multiple",
                answers: [
                    { text: "justify-content", isCorrect: true },
                    { text: "align-items", isCorrect: true },
                    { text: "align-self", isCorrect: true },
                    { text: "text-transform", isCorrect: false }
                ]
            },
            {
                text: "Что делает оператор === в JavaScript?",
                type: "single",
                answers: [
                    { text: "Строгое сравнение — без приведения типов", isCorrect: true },
                    { text: "Присваивает значение", isCorrect: false },
                    { text: "Сравнивает только значения", isCorrect: false },
                    { text: "Сравнивает только типы", isCorrect: false }
                ]
            },
            {
                text: "Какие способы объявления переменных есть в JavaScript (ES6+)?",
                type: "multiple",
                answers: [
                    { text: "var", isCorrect: true },
                    { text: "let", isCorrect: true },
                    { text: "const", isCorrect: true },
                    { text: "def", isCorrect: false }
                ]
            },
            {
                text: "Что такое props в React?",
                type: "single",
                answers: [
                    { text: "Данные, передаваемые в компонент снаружи (от родителя)", isCorrect: true },
                    { text: "Внутреннее состояние компонента", isCorrect: false },
                    { text: "CSS-стили компонента", isCorrect: false },
                    { text: "Методы жизненного цикла", isCorrect: false }
                ]
            },
            {
                text: "Какие события мыши существуют в JavaScript?",
                type: "multiple",
                answers: [
                    { text: "click", isCorrect: true },
                    { text: "mouseover", isCorrect: true },
                    { text: "mousedown", isCorrect: true },
                    { text: "keypress", isCorrect: false }
                ]
            },
            {
                text: "Что такое Promise в JavaScript?",
                type: "single",
                answers: [
                    { text: "Объект, представляющий результат асинхронной операции", isCorrect: true },
                    { text: "Синхронная функция", isCorrect: false },
                    { text: "Тип переменной", isCorrect: false },
                    { text: "CSS-анимация", isCorrect: false }
                ]
            },
            {
                text: "Что такое webpack?",
                type: "single",
                answers: [
                    { text: "Сборщик модулей для JavaScript-приложений", isCorrect: true },
                    { text: "Фреймворк для тестирования", isCorrect: false },
                    { text: "CSS-препроцессор", isCorrect: false },
                    { text: "Менеджер пакетов", isCorrect: false }
                ]
            },
            {
                text: "Какие CSS-препроцессоры существуют?",
                type: "multiple",
                answers: [
                    { text: "SASS/SCSS", isCorrect: true },
                    { text: "LESS", isCorrect: true },
                    { text: "Stylus", isCorrect: true },
                    { text: "PostScript", isCorrect: false }
                ]
            },
            {
                text: "Что означает «гидратация» (hydration) во фреймворках SSR?",
                type: "single",
                answers: [
                    { text: "Присоединение JS-логики к серверно-сгенерированному HTML на клиенте", isCorrect: true },
                    { text: "Загрузка стилей на страницу", isCorrect: false },
                    { text: "Кэширование данных на сервере", isCorrect: false },
                    { text: "Сжатие изображений", isCorrect: false }
                ]
            },
            {
                text: "Что такое event bubbling (всплытие события) в DOM?",
                type: "single",
                answers: [
                    { text: "Событие распространяется от дочернего элемента к родительским", isCorrect: true },
                    { text: "Событие срабатывает только на целевом элементе", isCorrect: false },
                    { text: "Событие передаётся от родителя к дочерним элементам", isCorrect: false },
                    { text: "Событие блокируется браузером", isCorrect: false }
                ]
            },
            {
                text: "Какие методы массива в JavaScript возвращают новый массив?",
                type: "multiple",
                answers: [
                    { text: "map()", isCorrect: true },
                    { text: "filter()", isCorrect: true },
                    { text: "slice()", isCorrect: true },
                    { text: "forEach()", isCorrect: false }
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
                    { text: "JSON Web Token — стандарт передачи данных аутентификации", isCorrect: true },
                    { text: "Java Web Tool", isCorrect: false },
                    { text: "JavaScript Window Toolkit", isCorrect: false },
                    { text: "Just Web Technology", isCorrect: false }
                ]
            },
            {
                text: "Какие принципы входят в SOLID?",
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
            },
            {
                text: "Что такое middleware в Express.js?",
                type: "single",
                answers: [
                    { text: "Функции, обрабатывающие запрос и ответ в цепочке обработки", isCorrect: true },
                    { text: "База данных для Express", isCorrect: false },
                    { text: "Шаблонизатор HTML", isCorrect: false },
                    { text: "Пакетный менеджер", isCorrect: false }
                ]
            },
            {
                text: "Какие HTTP-коды означают успешный ответ сервера?",
                type: "multiple",
                answers: [
                    { text: "200 OK", isCorrect: true },
                    { text: "201 Created", isCorrect: true },
                    { text: "204 No Content", isCorrect: true },
                    { text: "404 Not Found", isCorrect: false }
                ]
            },
            {
                text: "Что такое ORM?",
                type: "single",
                answers: [
                    { text: "Object-Relational Mapping — инструмент работы с БД через объекты", isCorrect: true },
                    { text: "Язык запросов", isCorrect: false },
                    { text: "Тип базы данных", isCorrect: false },
                    { text: "Протокол шифрования", isCorrect: false }
                ]
            },
            {
                text: "Какие Python-фреймворки используются для веб-разработки?",
                type: "multiple",
                answers: [
                    { text: "Django", isCorrect: true },
                    { text: "Flask", isCorrect: true },
                    { text: "FastAPI", isCorrect: true },
                    { text: "NumPy", isCorrect: false }
                ]
            },
            {
                text: "Что такое event loop в Node.js?",
                type: "single",
                answers: [
                    { text: "Механизм асинхронного выполнения кода в однопоточной среде", isCorrect: true },
                    { text: "Цикл for для перебора событий", isCorrect: false },
                    { text: "Очередь HTTP-запросов", isCorrect: false },
                    { text: "Планировщик задач операционной системы", isCorrect: false }
                ]
            },
            {
                text: "Что такое индекс в базе данных?",
                type: "single",
                answers: [
                    { text: "Структура данных для ускорения поиска", isCorrect: true },
                    { text: "Первичный ключ таблицы", isCorrect: false },
                    { text: "Внешний ключ", isCorrect: false },
                    { text: "Триггер", isCorrect: false }
                ]
            },
            {
                text: "Какие паттерны проектирования относятся к порождающим (Creational)?",
                type: "multiple",
                answers: [
                    { text: "Singleton", isCorrect: true },
                    { text: "Factory Method", isCorrect: true },
                    { text: "Builder", isCorrect: true },
                    { text: "Observer", isCorrect: false }
                ]
            },
            {
                text: "Что такое транзакция в базе данных?",
                type: "single",
                answers: [
                    { text: "Последовательность операций, выполняемых как единое целое", isCorrect: true },
                    { text: "Тип JOIN", isCorrect: false },
                    { text: "Индекс таблицы", isCorrect: false },
                    { text: "Хранимая процедура", isCorrect: false }
                ]
            },
            {
                text: "Что означает аббревиатура ACID применительно к базам данных?",
                type: "multiple",
                answers: [
                    { text: "Atomicity (Атомарность)", isCorrect: true },
                    { text: "Consistency (Согласованность)", isCorrect: true },
                    { text: "Isolation (Изолированность)", isCorrect: true },
                    { text: "Durability (Долговечность)", isCorrect: true }
                ]
            },
            {
                text: "Что такое REST-принцип stateless?",
                type: "single",
                answers: [
                    { text: "Сервер не хранит состояние клиента между запросами", isCorrect: true },
                    { text: "Клиент не хранит данные локально", isCorrect: false },
                    { text: "Запросы выполняются синхронно", isCorrect: false },
                    { text: "Сессии хранятся в базе данных", isCorrect: false }
                ]
            },
            {
                text: "Какие инструменты используются для документирования API?",
                type: "multiple",
                answers: [
                    { text: "Swagger / OpenAPI", isCorrect: true },
                    { text: "Postman", isCorrect: true },
                    { text: "Redoc", isCorrect: true },
                    { text: "Webpack", isCorrect: false }
                ]
            },
            {
                text: "Что такое GraphQL?",
                type: "single",
                answers: [
                    { text: "Язык запросов для API, позволяющий запрашивать точно нужные данные", isCorrect: true },
                    { text: "Библиотека для работы с графиками", isCorrect: false },
                    { text: "Тип базы данных", isCorrect: false },
                    { text: "Протокол шифрования", isCorrect: false }
                ]
            },
            {
                text: "Какой механизм используется для кэширования в Redis?",
                type: "single",
                answers: [
                    { text: "Хранение данных в оперативной памяти в виде ключ-значение", isCorrect: true },
                    { text: "Хранение данных на диске в таблицах", isCorrect: false },
                    { text: "Запросы к удалённому серверу", isCorrect: false },
                    { text: "Файловая система", isCorrect: false }
                ]
            },
            {
                text: "Какие протоколы используются для реализации WebSocket?",
                type: "single",
                answers: [
                    { text: "TCP — постоянное двустороннее соединение поверх HTTP Upgrade", isCorrect: true },
                    { text: "UDP — ненадёжная передача датаграмм", isCorrect: false },
                    { text: "FTP — передача файлов", isCorrect: false },
                    { text: "SMTP — передача почты", isCorrect: false }
                ]
            },
            {
                text: "Какие стратегии масштабирования серверных приложений существуют?",
                type: "multiple",
                answers: [
                    { text: "Горизонтальное масштабирование (добавление узлов)", isCorrect: true },
                    { text: "Вертикальное масштабирование (увеличение мощности сервера)", isCorrect: true },
                    { text: "Шардинг базы данных", isCorrect: true },
                    { text: "Уменьшение числа запросов клиентом", isCorrect: false }
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
                    { text: "Уникальный идентификатор записи в таблице", isCorrect: true },
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
                    { text: "Операция объединения строк из нескольких таблиц", isCorrect: true },
                    { text: "Сортировка данных", isCorrect: false },
                    { text: "Фильтрация строк", isCorrect: false },
                    { text: "Группировка", isCorrect: false }
                ]
            },
            {
                text: "Какие типы JOIN существуют в SQL?",
                type: "multiple",
                answers: [
                    { text: "INNER JOIN", isCorrect: true },
                    { text: "LEFT JOIN", isCorrect: true },
                    { text: "RIGHT JOIN", isCorrect: true },
                    { text: "CIRCULAR JOIN", isCorrect: false }
                ]
            },
            {
                text: "Что делает оператор GROUP BY в SQL?",
                type: "single",
                answers: [
                    { text: "Группирует строки с одинаковыми значениями столбца для агрегации", isCorrect: true },
                    { text: "Сортирует результат", isCorrect: false },
                    { text: "Объединяет таблицы", isCorrect: false },
                    { text: "Фильтрует NULL-значения", isCorrect: false }
                ]
            },
            {
                text: "Что такое нормализация базы данных?",
                type: "single",
                answers: [
                    { text: "Процесс организации данных для уменьшения избыточности", isCorrect: true },
                    { text: "Ускорение запросов с помощью индексов", isCorrect: false },
                    { text: "Резервное копирование данных", isCorrect: false },
                    { text: "Шифрование данных", isCorrect: false }
                ]
            },
            {
                text: "Какие агрегатные функции есть в SQL?",
                type: "multiple",
                answers: [
                    { text: "COUNT()", isCorrect: true },
                    { text: "SUM()", isCorrect: true },
                    { text: "AVG()", isCorrect: true },
                    { text: "CONCAT()", isCorrect: false }
                ]
            },
            {
                text: "Что такое внешний ключ (FOREIGN KEY)?",
                type: "single",
                answers: [
                    { text: "Столбец, ссылающийся на первичный ключ другой таблицы", isCorrect: true },
                    { text: "Уникальный идентификатор строки", isCorrect: false },
                    { text: "Ключ шифрования данных", isCorrect: false },
                    { text: "Индекс по нескольким столбцам", isCorrect: false }
                ]
            },
            {
                text: "Чем отличается WHERE от HAVING в SQL?",
                type: "single",
                answers: [
                    { text: "WHERE фильтрует строки до группировки, HAVING — после", isCorrect: true },
                    { text: "Они полностью взаимозаменяемы", isCorrect: false },
                    { text: "HAVING быстрее WHERE", isCorrect: false },
                    { text: "WHERE применяется только к числовым столбцам", isCorrect: false }
                ]
            },
            {
                text: "Что такое транзакция и какие свойства она должна обеспечивать?",
                type: "multiple",
                answers: [
                    { text: "Атомарность (всё или ничего)", isCorrect: true },
                    { text: "Изолированность (транзакции не мешают друг другу)", isCorrect: true },
                    { text: "Долговечность (данные сохраняются после фиксации)", isCorrect: true },
                    { text: "Асинхронность выполнения", isCorrect: false }
                ]
            },
            {
                text: "Что такое индекс B-Tree?",
                type: "single",
                answers: [
                    { text: "Сбалансированное дерево для быстрого поиска, используемое по умолчанию в большинстве СУБД", isCorrect: true },
                    { text: "Тип таблицы в PostgreSQL", isCorrect: false },
                    { text: "Алгоритм сортировки", isCorrect: false },
                    { text: "Тип репликации", isCorrect: false }
                ]
            },
            {
                text: "Что такое хранимая процедура (stored procedure)?",
                type: "single",
                answers: [
                    { text: "Заранее скомпилированный набор SQL-команд, хранящийся на сервере", isCorrect: true },
                    { text: "Триггер, срабатывающий при изменении данных", isCorrect: false },
                    { text: "Представление (VIEW) таблицы", isCorrect: false },
                    { text: "Временная таблица", isCorrect: false }
                ]
            },
            {
                text: "Какие уровни изоляции транзакций существуют в SQL?",
                type: "multiple",
                answers: [
                    { text: "READ UNCOMMITTED", isCorrect: true },
                    { text: "READ COMMITTED", isCorrect: true },
                    { text: "REPEATABLE READ", isCorrect: true },
                    { text: "FULL ISOLATION", isCorrect: false }
                ]
            },
            {
                text: "Чем документная (document-oriented) база данных отличается от реляционной?",
                type: "single",
                answers: [
                    { text: "Данные хранятся в документах (JSON/BSON) без фиксированной схемы", isCorrect: true },
                    { text: "Документные БД всегда быстрее реляционных", isCorrect: false },
                    { text: "Документные БД поддерживают только числовые данные", isCorrect: false },
                    { text: "В документных БД нет возможности делать запросы", isCorrect: false }
                ]
            },
            {
                text: "Что такое шардинг (sharding) базы данных?",
                type: "single",
                answers: [
                    { text: "Горизонтальное разбиение данных на несколько узлов для масштабирования", isCorrect: true },
                    { text: "Создание резервной копии базы данных", isCorrect: false },
                    { text: "Вертикальное масштабирование сервера БД", isCorrect: false },
                    { text: "Шифрование данных", isCorrect: false }
                ]
            },
            {
                text: "Какие команды относятся к DDL (Data Definition Language) в SQL?",
                type: "multiple",
                answers: [
                    { text: "CREATE", isCorrect: true },
                    { text: "ALTER", isCorrect: true },
                    { text: "DROP", isCorrect: true },
                    { text: "SELECT", isCorrect: false }
                ]
            },
            {
                text: "Что такое представление (VIEW) в SQL?",
                type: "single",
                answers: [
                    { text: "Виртуальная таблица, основанная на результате SQL-запроса", isCorrect: true },
                    { text: "Физическая копия таблицы", isCorrect: false },
                    { text: "Тип индекса", isCorrect: false },
                    { text: "Хранимая процедура", isCorrect: false }
                ]
            },
            {
                text: "Что такое репликация базы данных?",
                type: "single",
                answers: [
                    { text: "Копирование данных на один или несколько серверов для отказоустойчивости", isCorrect: true },
                    { text: "Удаление устаревших данных", isCorrect: false },
                    { text: "Сжатие данных на диске", isCorrect: false },
                    { text: "Разбиение таблицы на части", isCorrect: false }
                ]
            },
            {
                text: "Что делает оператор EXPLAIN в PostgreSQL?",
                type: "single",
                answers: [
                    { text: "Показывает план выполнения запроса для анализа производительности", isCorrect: true },
                    { text: "Выполняет запрос и возвращает результат", isCorrect: false },
                    { text: "Создаёт индекс для запроса", isCorrect: false },
                    { text: "Выводит структуру таблицы", isCorrect: false }
                ]
            },
            {
                text: "Какие проблемы может решить добавление составного индекса?",
                type: "multiple",
                answers: [
                    { text: "Ускорение запросов с фильтрацией по нескольким столбцам", isCorrect: true },
                    { text: "Ускорение сортировки по нескольким полям", isCorrect: true },
                    { text: "Оптимизация запросов с покрытием (index-only scan)", isCorrect: true },
                    { text: "Автоматическое сжатие таблицы", isCorrect: false }
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
                    { text: "Платформа для контейнеризации приложений", isCorrect: true },
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
                    { text: "Google Cloud Platform", isCorrect: true },
                    { text: "Microsoft Azure", isCorrect: true },
                    { text: "Docker Cloud", isCorrect: false }
                ]
            },
            {
                text: "Что такое CI/CD?",
                type: "single",
                answers: [
                    { text: "Непрерывная интеграция и непрерывная доставка/развёртывание", isCorrect: true },
                    { text: "Центральный интерфейс доступа", isCorrect: false },
                    { text: "Кодирование и интеграция", isCorrect: false },
                    { text: "Компилятор и интерпретатор", isCorrect: false }
                ]
            },
            {
                text: "Что такое Kubernetes (K8s)?",
                type: "single",
                answers: [
                    { text: "Система оркестрации контейнеров для автоматизации развёртывания и масштабирования", isCorrect: true },
                    { text: "Язык конфигурации", isCorrect: false },
                    { text: "Облачный провайдер", isCorrect: false },
                    { text: "Система мониторинга", isCorrect: false }
                ]
            },
            {
                text: "Чем образ (image) Docker отличается от контейнера?",
                type: "single",
                answers: [
                    { text: "Образ — шаблон, контейнер — запущенный экземпляр образа", isCorrect: true },
                    { text: "Они одно и то же", isCorrect: false },
                    { text: "Образ работает, контейнер — нет", isCorrect: false },
                    { text: "Контейнер занимает больше места на диске", isCorrect: false }
                ]
            },
            {
                text: "Какие инструменты CI/CD широко используются?",
                type: "multiple",
                answers: [
                    { text: "Jenkins", isCorrect: true },
                    { text: "GitHub Actions", isCorrect: true },
                    { text: "GitLab CI", isCorrect: true },
                    { text: "Postman", isCorrect: false }
                ]
            },
            {
                text: "Что такое Infrastructure as Code (IaC)?",
                type: "single",
                answers: [
                    { text: "Управление инфраструктурой через декларативные конфигурационные файлы", isCorrect: true },
                    { text: "Написание приложений на серверном коде", isCorrect: false },
                    { text: "Виртуализация серверов", isCorrect: false },
                    { text: "Мониторинг инфраструктуры", isCorrect: false }
                ]
            },
            {
                text: "Какие инструменты относятся к IaC?",
                type: "multiple",
                answers: [
                    { text: "Terraform", isCorrect: true },
                    { text: "Ansible", isCorrect: true },
                    { text: "Pulumi", isCorrect: true },
                    { text: "Grafana", isCorrect: false }
                ]
            },
            {
                text: "Что такое load balancer?",
                type: "single",
                answers: [
                    { text: "Компонент, распределяющий входящий трафик между несколькими серверами", isCorrect: true },
                    { text: "Инструмент для мониторинга нагрузки", isCorrect: false },
                    { text: "База данных для хранения логов", isCorrect: false },
                    { text: "Система контроля версий", isCorrect: false }
                ]
            },
            {
                text: "Что такое blue-green deployment?",
                type: "single",
                answers: [
                    { text: "Стратегия выкатки с двумя идентичными средами для переключения без даунтайма", isCorrect: true },
                    { text: "Цветовая схема UI дашборда", isCorrect: false },
                    { text: "Тип Docker-сети", isCorrect: false },
                    { text: "Алгоритм балансировки нагрузки", isCorrect: false }
                ]
            },
            {
                text: "Какие метрики обычно отслеживаются в системах мониторинга?",
                type: "multiple",
                answers: [
                    { text: "CPU utilization", isCorrect: true },
                    { text: "Memory usage", isCorrect: true },
                    { text: "Request latency", isCorrect: true },
                    { text: "Количество строк кода", isCorrect: false }
                ]
            },
            {
                text: "Что такое Pod в Kubernetes?",
                type: "single",
                answers: [
                    { text: "Минимальная единица развёртывания, содержащая один или несколько контейнеров", isCorrect: true },
                    { text: "Виртуальная машина", isCorrect: false },
                    { text: "Сеть контейнеров", isCorrect: false },
                    { text: "Конфигурационный файл", isCorrect: false }
                ]
            },
            {
                text: "Какие инструменты используются для мониторинга и алертинга?",
                type: "multiple",
                answers: [
                    { text: "Prometheus", isCorrect: true },
                    { text: "Grafana", isCorrect: true },
                    { text: "Alertmanager", isCorrect: true },
                    { text: "Webpack", isCorrect: false }
                ]
            },
            {
                text: "Что такое Helm в контексте Kubernetes?",
                type: "single",
                answers: [
                    { text: "Менеджер пакетов для Kubernetes, использующий charts для описания приложений", isCorrect: true },
                    { text: "Система мониторинга", isCorrect: false },
                    { text: "Оркестратор контейнеров", isCorrect: false },
                    { text: "Инструмент резервного копирования", isCorrect: false }
                ]
            },
            {
                text: "Что такое canary deployment?",
                type: "single",
                answers: [
                    { text: "Постепенное развёртывание новой версии для части пользователей перед полным выкатом", isCorrect: true },
                    { text: "Развёртывание только в тестовой среде", isCorrect: false },
                    { text: "Откат к предыдущей версии", isCorrect: false },
                    { text: "Развёртывание без тестирования", isCorrect: false }
                ]
            },
            {
                text: "Что такое service mesh (сервисная сетка)?",
                type: "single",
                answers: [
                    { text: "Инфраструктурный слой для управления взаимодействием микросервисов", isCorrect: true },
                    { text: "Тип Docker-сети", isCorrect: false },
                    { text: "Балансировщик нагрузки", isCorrect: false },
                    { text: "Система логирования", isCorrect: false }
                ]
            },
            {
                text: "Какие сервисы AWS чаще всего используются?",
                type: "multiple",
                answers: [
                    { text: "EC2 (виртуальные машины)", isCorrect: true },
                    { text: "S3 (объектное хранилище)", isCorrect: true },
                    { text: "RDS (управляемые базы данных)", isCorrect: true },
                    { text: "AWS Paint", isCorrect: false }
                ]
            },
            {
                text: "Что такое autoscaling в облачных платформах?",
                type: "single",
                answers: [
                    { text: "Автоматическое добавление или удаление ресурсов в зависимости от нагрузки", isCorrect: true },
                    { text: "Автоматическое обновление ОС", isCorrect: false },
                    { text: "Автоматическое резервное копирование", isCorrect: false },
                    { text: "Управление DNS-записями", isCorrect: false }
                ]
            },
            {
                text: "Что такое Docker Compose?",
                type: "single",
                answers: [
                    { text: "Инструмент для определения и запуска многоконтейнерных приложений через YAML-файл", isCorrect: true },
                    { text: "Аналог Kubernetes", isCorrect: false },
                    { text: "Инструмент для создания Docker-образов", isCorrect: false },
                    { text: "Облачный реестр образов", isCorrect: false }
                ]
            },
            {
                text: "Что описывает SLA (Service Level Agreement) в контексте DevOps?",
                type: "single",
                answers: [
                    { text: "Соглашение об уровне обслуживания, включая гарантии доступности и времени отклика", isCorrect: true },
                    { text: "Документация к API", isCorrect: false },
                    { text: "Политика безопасности", isCorrect: false },
                    { text: "Список используемых технологий", isCorrect: false }
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
                    { text: "Криптографические протоколы для безопасной передачи данных", isCorrect: true },
                    { text: "Язык программирования", isCorrect: false },
                    { text: "База данных", isCorrect: false },
                    { text: "Операционная система", isCorrect: false }
                ]
            },
            {
                text: "Какие виды кибератак существуют?",
                type: "multiple",
                answers: [
                    { text: "DDoS", isCorrect: true },
                    { text: "Phishing", isCorrect: true },
                    { text: "Man-in-the-Middle", isCorrect: true },
                    { text: "SQL Injection", isCorrect: true }
                ]
            },
            {
                text: "Что такое двухфакторная аутентификация (2FA)?",
                type: "single",
                answers: [
                    { text: "Подтверждение личности двумя независимыми способами (пароль + код/токен)", isCorrect: true },
                    { text: "Пароль из двух символов", isCorrect: false },
                    { text: "Исключительно биометрическая защита", isCorrect: false },
                    { text: "Сетевой экран", isCorrect: false }
                ]
            },
            {
                text: "Что такое XSS-атака?",
                type: "single",
                answers: [
                    { text: "Внедрение вредоносного JavaScript-кода в страницу, отображаемую другим пользователям", isCorrect: true },
                    { text: "Перехват сетевого трафика", isCorrect: false },
                    { text: "Подбор пароля перебором", isCorrect: false },
                    { text: "Атака на DNS-серверы", isCorrect: false }
                ]
            },
            {
                text: "Что такое SQL-инъекция?",
                type: "single",
                answers: [
                    { text: "Внедрение SQL-кода через пользовательский ввод для манипуляции базой данных", isCorrect: true },
                    { text: "Оптимизация SQL-запросов", isCorrect: false },
                    { text: "Тип репликации данных", isCorrect: false },
                    { text: "Зашифрованный запрос к БД", isCorrect: false }
                ]
            },
            {
                text: "Какие методы защиты от SQL-инъекций используются?",
                type: "multiple",
                answers: [
                    { text: "Параметризованные запросы (prepared statements)", isCorrect: true },
                    { text: "Экранирование пользовательского ввода", isCorrect: false },
                    { text: "ORM с валидацией данных", isCorrect: true },
                    { text: "Использование только GET-запросов", isCorrect: false }
                ]
            },
            {
                text: "Что такое CSRF-атака?",
                type: "single",
                answers: [
                    { text: "Принуждение авторизованного пользователя выполнить нежелательное действие на сайте", isCorrect: true },
                    { text: "Подбор паролей", isCorrect: false },
                    { text: "Перехват куки", isCorrect: false },
                    { text: "Внедрение скриптов в страницу", isCorrect: false }
                ]
            },
            {
                text: "Что такое симметричное шифрование?",
                type: "single",
                answers: [
                    { text: "Шифрование и расшифровка данных одним и тем же ключом", isCorrect: true },
                    { text: "Шифрование двумя разными ключами", isCorrect: false },
                    { text: "Хеширование данных", isCorrect: false },
                    { text: "Цифровая подпись", isCorrect: false }
                ]
            },
            {
                text: "Какие алгоритмы хеширования используются для паролей?",
                type: "multiple",
                answers: [
                    { text: "bcrypt", isCorrect: true },
                    { text: "Argon2", isCorrect: true },
                    { text: "PBKDF2", isCorrect: true },
                    { text: "MD5 (не рекомендуется)", isCorrect: false }
                ]
            },
            {
                text: "Что такое firewall (межсетевой экран)?",
                type: "single",
                answers: [
                    { text: "Система безопасности для фильтрации сетевого трафика по правилам", isCorrect: true },
                    { text: "Антивирусная программа", isCorrect: false },
                    { text: "VPN-клиент", isCorrect: false },
                    { text: "Прокси-сервер", isCorrect: false }
                ]
            },
            {
                text: "Что такое OWASP Top 10?",
                type: "single",
                answers: [
                    { text: "Список десяти наиболее критичных угроз безопасности веб-приложений", isCorrect: true },
                    { text: "Топ-10 лучших инструментов для разработки", isCorrect: false },
                    { text: "Десять принципов безопасного программирования", isCorrect: false },
                    { text: "Список десяти уязвимостей только для мобильных приложений", isCorrect: false }
                ]
            },
            {
                text: "Что такое penetration testing (пентест)?",
                type: "single",
                answers: [
                    { text: "Авторизованная имитация атак для выявления уязвимостей системы", isCorrect: true },
                    { text: "Автоматическое сканирование вирусов", isCorrect: false },
                    { text: "Тестирование производительности", isCorrect: false },
                    { text: "Тестирование интерфейса пользователя", isCorrect: false }
                ]
            },
            {
                text: "Какие категории угроз включает модель STRIDE?",
                type: "multiple",
                answers: [
                    { text: "Spoofing (подделка)", isCorrect: true },
                    { text: "Tampering (изменение данных)", isCorrect: true },
                    { text: "Repudiation (отказ от действий)", isCorrect: true },
                    { text: "Replication (репликация)", isCorrect: false }
                ]
            },
            {
                text: "Что такое Zero Trust Architecture?",
                type: "single",
                answers: [
                    { text: "Модель безопасности, при которой никто не доверяется по умолчанию, даже внутри сети", isCorrect: true },
                    { text: "Система без паролей", isCorrect: false },
                    { text: "Архитектура без шифрования", isCorrect: false },
                    { text: "Изолированная сеть без интернета", isCorrect: false }
                ]
            },
            {
                text: "Что такое VPN?",
                type: "single",
                answers: [
                    { text: "Зашифрованный туннель для безопасной передачи данных через публичную сеть", isCorrect: true },
                    { text: "Вид межсетевого экрана", isCorrect: false },
                    { text: "Антивирусное программное обеспечение", isCorrect: false },
                    { text: "Протокол аутентификации", isCorrect: false }
                ]
            },
            {
                text: "Что такое принцип наименьших привилегий (least privilege)?",
                type: "single",
                answers: [
                    { text: "Предоставление пользователю минимальных прав, необходимых для работы", isCorrect: true },
                    { text: "Использование самых слабых паролей для простоты", isCorrect: false },
                    { text: "Отключение шифрования для повышения скорости", isCorrect: false },
                    { text: "Ограничение числа серверов", isCorrect: false }
                ]
            },
            {
                text: "Какие типы вредоносного ПО существуют?",
                type: "multiple",
                answers: [
                    { text: "Троян (Trojan)", isCorrect: true },
                    { text: "Ransomware (программа-вымогатель)", isCorrect: true },
                    { text: "Spyware (шпионское ПО)", isCorrect: true },
                    { text: "Compiler (компилятор)", isCorrect: false }
                ]
            },
            {
                text: "Что такое OAuth 2.0?",
                type: "single",
                answers: [
                    { text: "Протокол авторизации, позволяющий сторонним приложениям получать ограниченный доступ к ресурсам", isCorrect: true },
                    { text: "Алгоритм шифрования", isCorrect: false },
                    { text: "Протокол передачи файлов", isCorrect: false },
                    { text: "Стандарт управления паролями", isCorrect: false }
                ]
            },
            {
                text: "Что такое security audit (аудит безопасности)?",
                type: "single",
                answers: [
                    { text: "Систематическая проверка системы для оценки её соответствия требованиям безопасности", isCorrect: true },
                    { text: "Сканирование на вирусы", isCorrect: false },
                    { text: "Резервное копирование данных", isCorrect: false },
                    { text: "Обновление программного обеспечения", isCorrect: false }
                ]
            },
            {
                text: "Какие протоколы обеспечивают безопасную аутентификацию в сетях?",
                type: "multiple",
                answers: [
                    { text: "Kerberos", isCorrect: true },
                    { text: "LDAP over SSL (LDAPS)", isCorrect: true },
                    { text: "SAML", isCorrect: true },
                    { text: "FTP", isCorrect: false }
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
                text: "Какой язык используется для нативной iOS разработки?",
                type: "single",
                answers: [
                    { text: "Swift", isCorrect: true },
                    { text: "Kotlin", isCorrect: false },
                    { text: "Java", isCorrect: false },
                    { text: "Python", isCorrect: false }
                ]
            },
            {
                text: "Какой язык используется для нативной Android разработки?",
                type: "single",
                answers: [
                    { text: "Kotlin", isCorrect: true },
                    { text: "Swift", isCorrect: false },
                    { text: "Objective-C", isCorrect: false },
                    { text: "Ruby", isCorrect: false }
                ]
            },
            {
                text: "Что такое APK в контексте Android?",
                type: "single",
                answers: [
                    { text: "Android Package — формат файла для установки приложений на Android", isCorrect: true },
                    { text: "Язык программирования", isCorrect: false },
                    { text: "Тип базы данных", isCorrect: false },
                    { text: "Протокол связи", isCorrect: false }
                ]
            },
            {
                text: "Что такое жизненный цикл Activity в Android?",
                type: "multiple",
                answers: [
                    { text: "onCreate()", isCorrect: true },
                    { text: "onResume()", isCorrect: true },
                    { text: "onPause()", isCorrect: true },
                    { text: "onFetch()", isCorrect: false }
                ]
            },
            {
                text: "Что такое Flutter?",
                type: "single",
                answers: [
                    { text: "UI-фреймворк от Google для создания кроссплатформенных приложений на языке Dart", isCorrect: true },
                    { text: "Библиотека для iOS разработки", isCorrect: false },
                    { text: "Язык программирования", isCorrect: false },
                    { text: "Среда разработки", isCorrect: false }
                ]
            },
            {
                text: "Что такое push-уведомления в мобильных приложениях?",
                type: "single",
                answers: [
                    { text: "Сообщения, отправляемые сервером на устройство пользователя даже при закрытом приложении", isCorrect: true },
                    { text: "Уведомления только внутри приложения", isCorrect: false },
                    { text: "SMS-сообщения", isCorrect: false },
                    { text: "Email-рассылки", isCorrect: false }
                ]
            },
            {
                text: "Какие сервисы используются для отправки push-уведомлений?",
                type: "multiple",
                answers: [
                    { text: "Firebase Cloud Messaging (FCM)", isCorrect: true },
                    { text: "Apple Push Notification Service (APNs)", isCorrect: true },
                    { text: "OneSignal", isCorrect: true },
                    { text: "AWS Lambda", isCorrect: false }
                ]
            },
            {
                text: "Что такое deep linking в мобильных приложениях?",
                type: "single",
                answers: [
                    { text: "Ссылка, открывающая конкретный экран приложения напрямую", isCorrect: true },
                    { text: "Ссылка на внешний сайт", isCorrect: false },
                    { text: "Метод загрузки данных в фоне", isCorrect: false },
                    { text: "Тип анимации", isCorrect: false }
                ]
            },
            {
                text: "Что такое SQLite в контексте мобильных приложений?",
                type: "single",
                answers: [
                    { text: "Встраиваемая реляционная база данных, работающая локально на устройстве", isCorrect: true },
                    { text: "Облачная база данных", isCorrect: false },
                    { text: "Тип JSON-хранилища", isCorrect: false },
                    { text: "NoSQL база данных", isCorrect: false }
                ]
            },
            {
                text: "Что такое Jetpack Compose в Android?",
                type: "single",
                answers: [
                    { text: "Современный декларативный UI-фреймворк для Android на Kotlin", isCorrect: true },
                    { text: "Архитектурный паттерн", isCorrect: false },
                    { text: "Набор иконок", isCorrect: false },
                    { text: "Инструмент для тестирования", isCorrect: false }
                ]
            },
            {
                text: "Что такое SwiftUI?",
                type: "single",
                answers: [
                    { text: "Декларативный UI-фреймворк Apple для создания интерфейсов на Swift", isCorrect: true },
                    { text: "IDE для iOS разработки", isCorrect: false },
                    { text: "Язык программирования", isCorrect: false },
                    { text: "Система управления зависимостями", isCorrect: false }
                ]
            },
            {
                text: "Какие архитектурные паттерны используются в мобильной разработке?",
                type: "multiple",
                answers: [
                    { text: "MVVM", isCorrect: true },
                    { text: "MVP", isCorrect: true },
                    { text: "Clean Architecture", isCorrect: true },
                    { text: "FIFO", isCorrect: false }
                ]
            },
            {
                text: "Что такое React Native Bridge?",
                type: "single",
                answers: [
                    { text: "Механизм коммуникации между JavaScript-кодом и нативными модулями платформы", isCorrect: true },
                    { text: "Компонент навигации в React Native", isCorrect: false },
                    { text: "Инструмент для публикации приложений", isCorrect: false },
                    { text: "База данных React Native", isCorrect: false }
                ]
            },
            {
                text: "Что такое App Store Review Guidelines?",
                type: "single",
                answers: [
                    { text: "Правила Apple, которым должны соответствовать приложения для публикации в App Store", isCorrect: true },
                    { text: "Руководство по дизайну iOS-приложений", isCorrect: false },
                    { text: "Документация по Swift", isCorrect: false },
                    { text: "Требования к производительности", isCorrect: false }
                ]
            },
            {
                text: "Что такое Expo в контексте React Native?",
                type: "single",
                answers: [
                    { text: "Платформа и набор инструментов для упрощённой разработки React Native приложений", isCorrect: true },
                    { text: "Облачный сервис для хранения данных", isCorrect: false },
                    { text: "Тип нативного компонента", isCorrect: false },
                    { text: "Система тестирования", isCorrect: false }
                ]
            },
            {
                text: "Какие подходы к локальному хранению данных в мобильных приложениях существуют?",
                type: "multiple",
                answers: [
                    { text: "SQLite", isCorrect: true },
                    { text: "SharedPreferences / UserDefaults", isCorrect: true },
                    { text: "Realm", isCorrect: true },
                    { text: "SMTP", isCorrect: false }
                ]
            },
            {
                text: "Что такое биометрическая аутентификация в мобильных приложениях?",
                type: "single",
                answers: [
                    { text: "Аутентификация с использованием Touch ID, Face ID или сканера отпечатков пальцев", isCorrect: true },
                    { text: "Аутентификация по email и паролю", isCorrect: false },
                    { text: "SMS-код подтверждения", isCorrect: false },
                    { text: "QR-код авторизации", isCorrect: false }
                ]
            },
            {
                text: "Что такое background fetch в мобильных приложениях?",
                type: "single",
                answers: [
                    { text: "Фоновое обновление данных приложением, когда оно не находится на переднем плане", isCorrect: true },
                    { text: "Скачивание файлов в браузере", isCorrect: false },
                    { text: "Тип анимации", isCorrect: false },
                    { text: "Метод управления памятью", isCorrect: false }
                ]
            },
            {
                text: "Что такое Gradle в Android разработке?",
                type: "single",
                answers: [
                    { text: "Система сборки и управления зависимостями для Android-проектов", isCorrect: true },
                    { text: "Язык программирования", isCorrect: false },
                    { text: "Эмулятор Android", isCorrect: false },
                    { text: "Система тестирования", isCorrect: false }
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
                    { text: "Раздел ИИ, где модели обучаются на данных без явного программирования правил", isCorrect: true },
                    { text: "Сбор данных из интернета", isCorrect: false },
                    { text: "Визуализация данных", isCorrect: false },
                    { text: "Хранение больших объёмов данных", isCorrect: false }
                ]
            },
            {
                text: "Что такое supervised learning (обучение с учителем)?",
                type: "single",
                answers: [
                    { text: "Обучение модели на размеченных данных с известными правильными ответами", isCorrect: true },
                    { text: "Обучение без меток", isCorrect: false },
                    { text: "Обучение через взаимодействие со средой", isCorrect: false },
                    { text: "Генерация новых данных", isCorrect: false }
                ]
            },
            {
                text: "Какие алгоритмы машинного обучения относятся к классификации?",
                type: "multiple",
                answers: [
                    { text: "Logistic Regression", isCorrect: true },
                    { text: "Decision Tree", isCorrect: true },
                    { text: "Support Vector Machine (SVM)", isCorrect: true },
                    { text: "K-Means", isCorrect: false }
                ]
            },
            {
                text: "Что такое overfitting (переобучение)?",
                type: "single",
                answers: [
                    { text: "Модель хорошо работает на обучающих данных, но плохо на новых", isCorrect: true },
                    { text: "Модель не обучилась вовсе", isCorrect: false },
                    { text: "Слишком маленький датасет", isCorrect: false },
                    { text: "Отсутствие нормализации данных", isCorrect: false }
                ]
            },
            {
                text: "Что такое train/test split?",
                type: "single",
                answers: [
                    { text: "Разделение данных на обучающую и тестовую выборки для оценки модели", isCorrect: true },
                    { text: "Разделение данных по типу", isCorrect: false },
                    { text: "Очистка данных от дубликатов", isCorrect: false },
                    { text: "Нормализация признаков", isCorrect: false }
                ]
            },
            {
                text: "Какие метрики используются для оценки классификационных моделей?",
                type: "multiple",
                answers: [
                    { text: "Accuracy (точность)", isCorrect: true },
                    { text: "Precision (точность предсказания)", isCorrect: true },
                    { text: "Recall (полнота)", isCorrect: true },
                    { text: "Mean Absolute Error", isCorrect: false }
                ]
            },
            {
                text: "Что такое нейронная сеть?",
                type: "single",
                answers: [
                    { text: "Вычислительная модель, вдохновлённая структурой мозга, состоящая из слоёв узлов", isCorrect: true },
                    { text: "Компьютерная сеть", isCorrect: false },
                    { text: "Тип базы данных", isCorrect: false },
                    { text: "Алгоритм кластеризации", isCorrect: false }
                ]
            },
            {
                text: "Что такое feature engineering?",
                type: "single",
                answers: [
                    { text: "Процесс создания и преобразования признаков для улучшения качества модели", isCorrect: true },
                    { text: "Разработка программных функций", isCorrect: false },
                    { text: "Визуализация данных", isCorrect: false },
                    { text: "Оценка модели на тестовой выборке", isCorrect: false }
                ]
            },
            {
                text: "Какие методы работы с пропущенными данными существуют?",
                type: "multiple",
                answers: [
                    { text: "Удаление строк с пропусками", isCorrect: true },
                    { text: "Заполнение средним/медианой", isCorrect: true },
                    { text: "Импутация с помощью модели", isCorrect: true },
                    { text: "Игнорирование пропусков", isCorrect: false }
                ]
            },
            {
                text: "Что такое unsupervised learning (обучение без учителя)?",
                type: "single",
                answers: [
                    { text: "Обучение на неразмеченных данных для поиска скрытых паттернов", isCorrect: true },
                    { text: "Обучение с правильными ответами", isCorrect: false },
                    { text: "Обучение через награду и наказание", isCorrect: false },
                    { text: "Обучение на синтетических данных", isCorrect: false }
                ]
            },
            {
                text: "Что такое K-Means кластеризация?",
                type: "single",
                answers: [
                    { text: "Алгоритм разбиения данных на K кластеров по близости к центроидам", isCorrect: true },
                    { text: "Алгоритм классификации с K ближайшими соседями", isCorrect: false },
                    { text: "Метод снижения размерности", isCorrect: false },
                    { text: "Алгоритм построения деревьев решений", isCorrect: false }
                ]
            },
            {
                text: "Что такое PCA (Principal Component Analysis)?",
                type: "single",
                answers: [
                    { text: "Метод снижения размерности, сохраняющий максимум дисперсии данных", isCorrect: true },
                    { text: "Алгоритм классификации", isCorrect: false },
                    { text: "Метод очистки данных", isCorrect: false },
                    { text: "Тип нейронной сети", isCorrect: false }
                ]
            },
            {
                text: "Какие библиотеки Python используются для глубокого обучения?",
                type: "multiple",
                answers: [
                    { text: "TensorFlow", isCorrect: true },
                    { text: "PyTorch", isCorrect: true },
                    { text: "Keras", isCorrect: true },
                    { text: "Matplotlib", isCorrect: false }
                ]
            },
            {
                text: "Что такое gradient descent (градиентный спуск)?",
                type: "single",
                answers: [
                    { text: "Алгоритм оптимизации, минимизирующий функцию потерь итеративным обновлением параметров", isCorrect: true },
                    { text: "Метод нормализации данных", isCorrect: false },
                    { text: "Тип регуляризации", isCorrect: false },
                    { text: "Алгоритм кластеризации", isCorrect: false }
                ]
            },
            {
                text: "Что такое confusion matrix?",
                type: "single",
                answers: [
                    { text: "Таблица, показывающая число правильных и ошибочных предсказаний классификатора", isCorrect: true },
                    { text: "Матрица корреляции признаков", isCorrect: false },
                    { text: "Таблица весов нейронной сети", isCorrect: false },
                    { text: "График обучения", isCorrect: false }
                ]
            },
            {
                text: "Что такое A/B тестирование в контексте Data Science?",
                type: "single",
                answers: [
                    { text: "Сравнительный эксперимент между двумя версиями для проверки статистической гипотезы", isCorrect: true },
                    { text: "Тестирование двух моделей машинного обучения", isCorrect: false },
                    { text: "Тест производительности кода", isCorrect: false },
                    { text: "Проверка качества данных", isCorrect: false }
                ]
            },
            {
                text: "Что такое regularization (регуляризация) в машинном обучении?",
                type: "single",
                answers: [
                    { text: "Техника для уменьшения переобучения путём добавления штрафа за сложность модели", isCorrect: true },
                    { text: "Нормализация данных", isCorrect: false },
                    { text: "Увеличение размера датасета", isCorrect: false },
                    { text: "Метод оценки модели", isCorrect: false }
                ]
            },
            {
                text: "Какие виды регуляризации существуют?",
                type: "multiple",
                answers: [
                    { text: "L1 (Lasso)", isCorrect: true },
                    { text: "L2 (Ridge)", isCorrect: true },
                    { text: "Elastic Net", isCorrect: true },
                    { text: "Softmax", isCorrect: false }
                ]
            },
            {
                text: "Что такое cross-validation (кросс-валидация)?",
                type: "single",
                answers: [
                    { text: "Метод оценки модели путём многократного разбиения данных на обучающую и тестовую части", isCorrect: true },
                    { text: "Обучение модели на нескольких GPU", isCorrect: false },
                    { text: "Аугментация данных", isCorrect: false },
                    { text: "Объединение нескольких моделей", isCorrect: false }
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
                    { text: "Подход, при котором приложение делится на независимые слабосвязанные сервисы", isCorrect: true },
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
            },
            {
                text: "В чём главное отличие монолитной архитектуры от микросервисной?",
                type: "single",
                answers: [
                    { text: "Монолит — единое приложение, микросервисы — набор независимых сервисов", isCorrect: true },
                    { text: "Монолит всегда быстрее", isCorrect: false },
                    { text: "Микросервисы используют только одну базу данных", isCorrect: false },
                    { text: "Монолит нельзя масштабировать", isCorrect: false }
                ]
            },
            {
                text: "Что такое Event-Driven Architecture (EDA)?",
                type: "single",
                answers: [
                    { text: "Архитектурный подход, где компоненты взаимодействуют через асинхронные события", isCorrect: true },
                    { text: "Архитектура без баз данных", isCorrect: false },
                    { text: "Архитектура на основе REST API", isCorrect: false },
                    { text: "Тип паттерна MVC", isCorrect: false }
                ]
            },
            {
                text: "Что такое CQRS?",
                type: "single",
                answers: [
                    { text: "Command Query Responsibility Segregation — разделение операций чтения и записи", isCorrect: true },
                    { text: "Тип базы данных", isCorrect: false },
                    { text: "Метод шифрования", isCorrect: false },
                    { text: "Протокол коммуникации", isCorrect: false }
                ]
            },
            {
                text: "Какие инструменты используются как message broker (брокер сообщений)?",
                type: "multiple",
                answers: [
                    { text: "Apache Kafka", isCorrect: true },
                    { text: "RabbitMQ", isCorrect: true },
                    { text: "AWS SQS", isCorrect: true },
                    { text: "Redis Pub/Sub", isCorrect: true }
                ]
            },
            {
                text: "Что такое API Gateway?",
                type: "single",
                answers: [
                    { text: "Единая точка входа для всех клиентских запросов к микросервисам", isCorrect: true },
                    { text: "Тип базы данных", isCorrect: false },
                    { text: "Инструмент для тестирования API", isCorrect: false },
                    { text: "Протокол шифрования", isCorrect: false }
                ]
            },
            {
                text: "Что такое Circuit Breaker паттерн?",
                type: "single",
                answers: [
                    { text: "Паттерн для предотвращения каскадных сбоев путём прекращения запросов к недоступному сервису", isCorrect: true },
                    { text: "Метод авторизации", isCorrect: false },
                    { text: "Алгоритм балансировки нагрузки", isCorrect: false },
                    { text: "Тип кэширования", isCorrect: false }
                ]
            },
            {
                text: "Что такое CAP-теорема?",
                type: "single",
                answers: [
                    { text: "Невозможность одновременно обеспечить согласованность, доступность и устойчивость к разделению", isCorrect: true },
                    { text: "Принципы объектно-ориентированного программирования", isCorrect: false },
                    { text: "Требования к API", isCorrect: false },
                    { text: "Типы масштабирования", isCorrect: false }
                ]
            },
            {
                text: "Что такое Saga Pattern в микросервисах?",
                type: "single",
                answers: [
                    { text: "Паттерн управления распределёнными транзакциями через цепочку локальных транзакций", isCorrect: true },
                    { text: "Паттерн кэширования", isCorrect: false },
                    { text: "Паттерн балансировки нагрузки", isCorrect: false },
                    { text: "Метод аутентификации", isCorrect: false }
                ]
            },
            {
                text: "Какие принципы Domain-Driven Design (DDD) существуют?",
                type: "multiple",
                answers: [
                    { text: "Bounded Context (ограниченный контекст)", isCorrect: true },
                    { text: "Ubiquitous Language (единый язык)", isCorrect: true },
                    { text: "Aggregate (агрегат)", isCorrect: true },
                    { text: "Flat Architecture", isCorrect: false }
                ]
            },
            {
                text: "Что такое service discovery в микросервисной архитектуре?",
                type: "single",
                answers: [
                    { text: "Механизм автоматического обнаружения доступных экземпляров сервисов", isCorrect: true },
                    { text: "Документация API сервиса", isCorrect: false },
                    { text: "Тип балансировки нагрузки", isCorrect: false },
                    { text: "Инструмент мониторинга", isCorrect: false }
                ]
            },
            {
                text: "Что такое Strangler Fig Pattern?",
                type: "single",
                answers: [
                    { text: "Постепенная миграция монолита на микросервисы путём замены частей по очереди", isCorrect: true },
                    { text: "Паттерн для оптимизации SQL-запросов", isCorrect: false },
                    { text: "Тип кэша", isCorrect: false },
                    { text: "Метод шифрования данных", isCorrect: false }
                ]
            },
            {
                text: "Какие уровни (слои) типично присутствуют в Clean Architecture?",
                type: "multiple",
                answers: [
                    { text: "Entities (бизнес-объекты)", isCorrect: true },
                    { text: "Use Cases (бизнес-логика)", isCorrect: true },
                    { text: "Interface Adapters", isCorrect: true },
                    { text: "Cloud Layer", isCorrect: false }
                ]
            },
            {
                text: "Что такое идемпотентность в контексте API?",
                type: "single",
                answers: [
                    { text: "Свойство, при котором многократное выполнение операции даёт тот же результат, что и однократное", isCorrect: true },
                    { text: "Скорость выполнения запроса", isCorrect: false },
                    { text: "Защита API от несанкционированного доступа", isCorrect: false },
                    { text: "Формат ответа API", isCorrect: false }
                ]
            },
            {
                text: "Что такое backpressure в реактивных системах?",
                type: "single",
                answers: [
                    { text: "Механизм управления потоком данных, когда потребитель сигнализирует производителю о своей загруженности", isCorrect: true },
                    { text: "Тип нагрузочного тестирования", isCorrect: false },
                    { text: "Алгоритм сортировки", isCorrect: false },
                    { text: "Метод масштабирования БД", isCorrect: false }
                ]
            },
            {
                text: "Какие стратегии кэширования существуют?",
                type: "multiple",
                answers: [
                    { text: "Cache-aside (Lazy Loading)", isCorrect: true },
                    { text: "Write-through", isCorrect: true },
                    { text: "Write-back (Write-behind)", isCorrect: true },
                    { text: "Delete-first", isCorrect: false }
                ]
            },
            {
                text: "Что такое Bulkhead паттерн?",
                type: "single",
                answers: [
                    { text: "Изоляция компонентов системы для предотвращения каскадного распространения сбоев", isCorrect: true },
                    { text: "Паттерн маршрутизации запросов", isCorrect: false },
                    { text: "Метод шифрования", isCorrect: false },
                    { text: "Стратегия кэширования", isCorrect: false }
                ]
            },
            {
                text: "Что такое Twelve-Factor App?",
                type: "single",
                answers: [
                    { text: "Методология создания современных масштабируемых SaaS-приложений из 12 принципов", isCorrect: true },
                    { text: "Метод версионирования API", isCorrect: false },
                    { text: "Набор правил безопасности", isCorrect: false },
                    { text: "Тип облачной архитектуры", isCorrect: false }
                ]
            },
            {
                text: "Что такое distributed tracing (распределённая трассировка)?",
                type: "single",
                answers: [
                    { text: "Отслеживание пути запроса через все сервисы в распределённой системе", isCorrect: true },
                    { text: "Мониторинг CPU на серверах", isCorrect: false },
                    { text: "Логирование ошибок", isCorrect: false },
                    { text: "Профилирование отдельного сервиса", isCorrect: false }
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
                    { text: "Test-Driven Development — написание тестов до написания кода", isCorrect: true },
                    { text: "Technical Design Document", isCorrect: false },
                    { text: "Test Data Definition", isCorrect: false },
                    { text: "Time Division Duplexing", isCorrect: false }
                ]
            },
            {
                text: "Что такое BDD (Behavior-Driven Development)?",
                type: "single",
                answers: [
                    { text: "Разработка через описание поведения системы в понятных бизнесу формулировках (Given/When/Then)", isCorrect: true },
                    { text: "Тип unit-тестирования", isCorrect: false },
                    { text: "Нагрузочное тестирование", isCorrect: false },
                    { text: "Ручное тестирование", isCorrect: false }
                ]
            },
            {
                text: "Какие инструменты используются для E2E-тестирования веб-приложений?",
                type: "multiple",
                answers: [
                    { text: "Cypress", isCorrect: true },
                    { text: "Playwright", isCorrect: true },
                    { text: "Selenium", isCorrect: true },
                    { text: "Jest", isCorrect: false }
                ]
            },
            {
                text: "Что такое mock (мок) в тестировании?",
                type: "single",
                answers: [
                    { text: "Заглушка, имитирующая поведение реального объекта для изоляции тестируемого кода", isCorrect: true },
                    { text: "Реальное подключение к базе данных", isCorrect: false },
                    { text: "Тип нагрузочного теста", isCorrect: false },
                    { text: "Скрипт для автодеплоя", isCorrect: false }
                ]
            },
            {
                text: "Что такое test coverage (покрытие кода тестами)?",
                type: "single",
                answers: [
                    { text: "Процент кода приложения, выполняемый при запуске тестов", isCorrect: true },
                    { text: "Количество написанных тестов", isCorrect: false },
                    { text: "Время выполнения тестов", isCorrect: false },
                    { text: "Количество исправленных багов", isCorrect: false }
                ]
            },
            {
                text: "Какие фреймворки используются для unit-тестирования в JavaScript?",
                type: "multiple",
                answers: [
                    { text: "Jest", isCorrect: true },
                    { text: "Mocha", isCorrect: true },
                    { text: "Vitest", isCorrect: true },
                    { text: "Webpack", isCorrect: false }
                ]
            },
            {
                text: "Что такое smoke testing?",
                type: "single",
                answers: [
                    { text: "Поверхностное тестирование ключевых функций после сборки, чтобы убедиться в её работоспособности", isCorrect: true },
                    { text: "Тестирование производительности под нагрузкой", isCorrect: false },
                    { text: "Тестирование безопасности", isCorrect: false },
                    { text: "Ручное тестирование UI", isCorrect: false }
                ]
            },
            {
                text: "Что такое regression testing (регрессионное тестирование)?",
                type: "single",
                answers: [
                    { text: "Проверка, что новые изменения не сломали существующую функциональность", isCorrect: true },
                    { text: "Тестирование производительности", isCorrect: false },
                    { text: "Тестирование новой функциональности", isCorrect: false },
                    { text: "Тестирование безопасности", isCorrect: false }
                ]
            },
            {
                text: "Что такое test pyramid (пирамида тестирования)?",
                type: "single",
                answers: [
                    { text: "Концепция, предполагающая больше unit-тестов, меньше интеграционных, ещё меньше E2E", isCorrect: true },
                    { text: "Иерархия тест-инженеров в команде", isCorrect: false },
                    { text: "Структура тестового отчёта", isCorrect: false },
                    { text: "Стратегия нагрузочного тестирования", isCorrect: false }
                ]
            },
            {
                text: "Что такое performance testing (нагрузочное тестирование)?",
                type: "single",
                answers: [
                    { text: "Проверка поведения системы под различными уровнями нагрузки", isCorrect: true },
                    { text: "Тестирование пользовательского интерфейса", isCorrect: false },
                    { text: "Тестирование безопасности", isCorrect: false },
                    { text: "Проверка бизнес-логики", isCorrect: false }
                ]
            },
            {
                text: "Какие инструменты используются для нагрузочного тестирования?",
                type: "multiple",
                answers: [
                    { text: "Apache JMeter", isCorrect: true },
                    { text: "k6", isCorrect: true },
                    { text: "Locust", isCorrect: true },
                    { text: "Prettier", isCorrect: false }
                ]
            },
            {
                text: "Что такое stub (заглушка) в тестировании?",
                type: "single",
                answers: [
                    { text: "Объект с жёстко заданными ответами на вызовы, используемый вместо реальной зависимости", isCorrect: true },
                    { text: "Тип нагрузочного теста", isCorrect: false },
                    { text: "Автоматически генерируемый тест", isCorrect: false },
                    { text: "Конфигурационный файл тестов", isCorrect: false }
                ]
            },
            {
                text: "Что такое acceptance testing (приёмочное тестирование)?",
                type: "single",
                answers: [
                    { text: "Проверка соответствия системы требованиям заказчика перед сдачей в эксплуатацию", isCorrect: true },
                    { text: "Тестирование юнитов", isCorrect: false },
                    { text: "Автоматизированное регрессионное тестирование", isCorrect: false },
                    { text: "Нагрузочное тестирование", isCorrect: false }
                ]
            },
            {
                text: "Что такое flaky test?",
                type: "single",
                answers: [
                    { text: "Тест, который иногда проходит, иногда падает при одном и том же коде без видимых причин", isCorrect: true },
                    { text: "Очень медленный тест", isCorrect: false },
                    { text: "Тест с большим покрытием кода", isCorrect: false },
                    { text: "Тест на граничные условия", isCorrect: false }
                ]
            },
            {
                text: "Что такое mutation testing?",
                type: "single",
                answers: [
                    { text: "Оценка качества тестов путём внесения небольших изменений (мутаций) в код и проверки, ловят ли тесты ошибки", isCorrect: true },
                    { text: "Тестирование после изменения требований", isCorrect: false },
                    { text: "Тестирование на разных ОС", isCorrect: false },
                    { text: "Генерация случайных данных для тестов", isCorrect: false }
                ]
            },
            {
                text: "Что такое snapshot testing (тестирование снимков)?",
                type: "single",
                answers: [
                    { text: "Сравнение текущего вывода компонента с ранее сохранённым эталонным снимком", isCorrect: true },
                    { text: "Снимок экрана во время теста", isCorrect: false },
                    { text: "Создание резервной копии базы данных для тестов", isCorrect: false },
                    { text: "Тип интеграционного теста", isCorrect: false }
                ]
            },
            {
                text: "Какие подходы используются в тестировании API?",
                type: "multiple",
                answers: [
                    { text: "Проверка HTTP статус-кодов", isCorrect: true },
                    { text: "Проверка структуры ответа (JSON Schema)", isCorrect: true },
                    { text: "Контрактное тестирование (Contract Testing)", isCorrect: true },
                    { text: "Визуальное сравнение UI", isCorrect: false }
                ]
            },
            {
                text: "Что такое exploratory testing (исследовательское тестирование)?",
                type: "single",
                answers: [
                    { text: "Неструктурированное тестирование, при котором тестировщик исследует систему без заранее написанных тест-кейсов", isCorrect: true },
                    { text: "Автоматизированное тестирование", isCorrect: false },
                    { text: "Тестирование производительности", isCorrect: false },
                    { text: "Тестирование по чек-листу", isCorrect: false }
                ]
            },
            {
                text: "Что означает принцип Arrange-Act-Assert (AAA) в unit-тестировании?",
                type: "single",
                answers: [
                    { text: "Структура теста: подготовка данных → выполнение действия → проверка результата", isCorrect: true },
                    { text: "Три стадии CI/CD пайплайна", isCorrect: false },
                    { text: "Три уровня тестового покрытия", isCorrect: false },
                    { text: "Алгоритм нагрузочного тестирования", isCorrect: false }
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
                text: "Что такое ветка (branch) в Git?",
                type: "single",
                answers: [
                    { text: "Независимая линия разработки, указывающая на определённый коммит", isCorrect: true },
                    { text: "Тип файла", isCorrect: false },
                    { text: "Команда для отката изменений", isCorrect: false },
                    { text: "Удалённый репозиторий", isCorrect: false }
                ]
            },
            {
                text: "Что делает git merge?",
                type: "single",
                answers: [
                    { text: "Объединяет историю двух веток в одну", isCorrect: true },
                    { text: "Создаёт новую ветку", isCorrect: false },
                    { text: "Удаляет ветку", isCorrect: false },
                    { text: "Сохраняет незафиксированные изменения", isCorrect: false }
                ]
            },
            {
                text: "Чем git rebase отличается от git merge?",
                type: "single",
                answers: [
                    { text: "Rebase перемещает коммиты поверх другой ветки, создавая линейную историю", isCorrect: true },
                    { text: "Rebase удаляет конфликтующие коммиты", isCorrect: false },
                    { text: "Merge сохраняет линейную историю", isCorrect: false },
                    { text: "Они делают одно и то же", isCorrect: false }
                ]
            },
            {
                text: "Что такое git stash?",
                type: "single",
                answers: [
                    { text: "Временное сохранение незафиксированных изменений для чистого переключения ветки", isCorrect: true },
                    { text: "Удаление файлов из репозитория", isCorrect: false },
                    { text: "Создание нового коммита", isCorrect: false },
                    { text: "Клонирование репозитория", isCorrect: false }
                ]
            },
            {
                text: "Что такое Pull Request (PR) / Merge Request (MR)?",
                type: "single",
                answers: [
                    { text: "Запрос на включение изменений из одной ветки в другую с возможностью ревью кода", isCorrect: true },
                    { text: "Команда git pull", isCorrect: false },
                    { text: "Слияние всех веток разом", isCorrect: false },
                    { text: "Запрос на удаление ветки", isCorrect: false }
                ]
            },
            {
                text: "Что такое git cherry-pick?",
                type: "single",
                answers: [
                    { text: "Применение отдельного коммита из одной ветки в текущую", isCorrect: true },
                    { text: "Удаление выбранных коммитов", isCorrect: false },
                    { text: "Сортировка коммитов по дате", isCorrect: false },
                    { text: "Создание тэга для коммита", isCorrect: false }
                ]
            },
            {
                text: "Что делает git reset --hard HEAD~1?",
                type: "single",
                answers: [
                    { text: "Удаляет последний коммит и все его изменения без возможности восстановления", isCorrect: true },
                    { text: "Создаёт новый коммит, отменяющий последний", isCorrect: false },
                    { text: "Сохраняет изменения последнего коммита в рабочую директорию", isCorrect: false },
                    { text: "Сбрасывает индекс (staging area)", isCorrect: false }
                ]
            },
            {
                text: "Чем git revert отличается от git reset?",
                type: "single",
                answers: [
                    { text: "git revert создаёт новый коммит, отменяющий изменения, не удаляя историю", isCorrect: true },
                    { text: "git revert удаляет коммиты из истории", isCorrect: false },
                    { text: "Они полностью идентичны", isCorrect: false },
                    { text: "git reset создаёт новый коммит", isCorrect: false }
                ]
            },
            {
                text: "Что такое Git Flow?",
                type: "single",
                answers: [
                    { text: "Модель ветвления с разделением на main, develop, feature, release и hotfix ветки", isCorrect: true },
                    { text: "Инструмент для визуализации истории коммитов", isCorrect: false },
                    { text: "Тип хостинга репозиториев", isCorrect: false },
                    { text: "Команда для слияния всех веток", isCorrect: false }
                ]
            },
            {
                text: "Какие стратегии ветвления существуют?",
                type: "multiple",
                answers: [
                    { text: "Git Flow", isCorrect: true },
                    { text: "GitHub Flow", isCorrect: true },
                    { text: "Trunk-Based Development", isCorrect: true },
                    { text: "Linear Merge", isCorrect: false }
                ]
            },
            {
                text: "Что такое тег (tag) в Git?",
                type: "single",
                answers: [
                    { text: "Метка для конкретного коммита, обычно используемая для обозначения версий релиза", isCorrect: true },
                    { text: "Тип ветки", isCorrect: false },
                    { text: "Сообщение к коммиту", isCorrect: false },
                    { text: "Имя удалённого репозитория", isCorrect: false }
                ]
            },
            {
                text: "Что такое .gitignore?",
                type: "single",
                answers: [
                    { text: "Файл с шаблонами путей, которые Git должен игнорировать и не отслеживать", isCorrect: true },
                    { text: "Файл конфигурации GitHub", isCorrect: false },
                    { text: "Список заблокированных пользователей", isCorrect: false },
                    { text: "Файл прав доступа к репозиторию", isCorrect: false }
                ]
            },
            {
                text: "Что делает команда git bisect?",
                type: "single",
                answers: [
                    { text: "Помогает найти коммит, в котором появился баг, используя бинарный поиск", isCorrect: true },
                    { text: "Делит репозиторий на две части", isCorrect: false },
                    { text: "Создаёт две копии репозитория", isCorrect: false },
                    { text: "Сравнивает две ветки", isCorrect: false }
                ]
            },
            {
                text: "Что такое субмодуль (submodule) в Git?",
                type: "single",
                answers: [
                    { text: "Встроенный репозиторий внутри другого репозитория для управления зависимостями", isCorrect: true },
                    { text: "Тип ветки для модульных тестов", isCorrect: false },
                    { text: "Файл конфигурации Git", isCorrect: false },
                    { text: "Инструмент для анализа истории", isCorrect: false }
                ]
            },
            {
                text: "Что показывает команда git log --oneline?",
                type: "single",
                answers: [
                    { text: "Сокращённую историю коммитов — хеш и сообщение в одну строку", isCorrect: true },
                    { text: "Список всех веток", isCorrect: false },
                    { text: "Изменения в последнем коммите", isCorrect: false },
                    { text: "Статус рабочей директории", isCorrect: false }
                ]
            },
            {
                text: "Что делает команда git fetch?",
                type: "single",
                answers: [
                    { text: "Загружает изменения из удалённого репозитория, не применяя их к рабочей ветке", isCorrect: true },
                    { text: "Загружает и сразу применяет изменения", isCorrect: false },
                    { text: "Отправляет изменения на сервер", isCorrect: false },
                    { text: "Клонирует репозиторий", isCorrect: false }
                ]
            },
            {
                text: "Какие типы слияния (merge) поддерживает Git?",
                type: "multiple",
                answers: [
                    { text: "Fast-forward", isCorrect: true },
                    { text: "3-way merge (merge commit)", isCorrect: true },
                    { text: "Squash merge", isCorrect: true },
                    { text: "Circular merge", isCorrect: false }
                ]
            },
            {
                text: "Что такое конфликт слияния (merge conflict) в Git?",
                type: "single",
                answers: [
                    { text: "Ситуация, когда в двух ветках были изменены одни и те же строки файла, и Git не может выбрать нужное", isCorrect: true },
                    { text: "Ошибка при отправке коммита", isCorrect: false },
                    { text: "Несовместимость версий Git", isCorrect: false },
                    { text: "Попытка удалить защищённую ветку", isCorrect: false }
                ]
            },
            {
                text: "Что такое Conventional Commits?",
                type: "single",
                answers: [
                    { text: "Соглашение о форматировании сообщений коммитов для автоматизации changelog и версионирования", isCorrect: true },
                    { text: "Тип хранилища коммитов", isCorrect: false },
                    { text: "Инструмент для сравнения коммитов", isCorrect: false },
                    { text: "Команда для объединения коммитов", isCorrect: false }
                ]
            }
        ]
    }
];

async function setupInitialTests(pool) {
    console.log(' Проверка и добавление начальных тестов...');

    try {
        for (const test of initialTests) {
            const existingCategory = await pool.query(
                'SELECT id FROM categories WHERE name = $1',
                [test.name]
            );

            if (existingCategory.rows.length === 0) {
                console.log(`   Добавление категории: ${test.name}`);

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
                    console.log(`     Добавлена компетенция: ${test.competence}`);
                } else {
                    competenceId = existingComp.rows[0].id;
                }

                const category = await pool.query(
                    'INSERT INTO categories (name, description, competence_id) VALUES ($1, $2, $3) RETURNING id',
                    [test.name, test.description, competenceId]
                );
                const categoryId = category.rows[0].id;
                console.log(`     Категория добавлена с ID: ${categoryId}`);

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
                    console.log(`     Вопрос ${i + 1}/${test.questions.length} добавлен`);
                }
                console.log(`   Категория "${test.name}" полностью добавлена (${test.questions.length} вопросов)`);
            } else {
                console.log(`   Категория уже существует: ${test.name}`);
            }
        }
        console.log(' Все начальные тесты успешно добавлены!');
    } catch (error) {
        console.error(' Ошибка при добавлении начальных тестов:', error);
    }
}

module.exports = { setupInitialTests };
