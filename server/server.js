// Імпорт необхідних модулів
const express = require('express'); // Імпортуємо фреймворк Express.js
const mongoose = require('mongoose'); // Імпортуємо ORM Mongoose для MongoDB
const cors = require('cors'); // Імпортуємо проміжний програмний засіб CORS для включення Cross-Origin Resource Sharing

// Ініціалізація додатку Express
const app = express();

// Проміжний програмний засіб для розбору запитів у форматі JSON
app.use(express.json());
// Проміжний програмний засіб для включення CORS
app.use(cors());

// Підключення до бази даних MongoDB з назвою 'todo-list-db'
mongoose.connect('mongodb://127.0.0.1:27017/todo-list-db', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("Підключено до MongoDB!")).catch(console.error);

// Імпортуємо модель Todo
const Todo = require('./models/Todo');

// Маршрут для отримання всіх задач
app.get('/todos', async (req, res) => {
    // Пошук усіх задач у базі даних
    const todos = await Todo.find();

    // Надсилаємо задачі у вигляді JSON відповіді
    res.json(todos);
});

// Маршрут для створення нової задачі
app.post('/todo/new', (req, res) => {
    // Створення нового екземпляру Todo з текстом із запиту
    const todo = new Todo({
        text: req.body.text
    });

    // Збереження задачі у базі даних
    todo.save();

    // Надсилання створеної задачі у вигляді JSON-відповіді
    res.json(todo);
});

// Маршрут для видалення задачі за її ідентифікатором
app.delete('/todo/delete/:id', async (req, res) => {
    // Пошук і видалення задачі за її ідентифікатором
    const result = await Todo.findByIdAndDelete(req.params.id);

    // Надсилання результату операції видалення у вигляді JSON-відповіді
    res.json({result});
});

// Маршрут для відзначення задачі як виконаної чи невиконаної
app.get('/todo/complete/:id', async (req, res) => {
    try {
        // Пошук задачі за її ідентифікатором
        const todo = await Todo.findById(req.params.id);

        // Якщо задачу не знайдено, повертаємо помилку 404
        if (!todo) {
            return res.status(404).json({error: 'Задачу не знайдено'});
        }

        // Перемикаємо статус виконання задачі
        todo.complete = !todo.complete;

        // Зберігаємо оновлену задачу
        await todo.save();

        // Надсилаємо оновлену задачу у вигляді JSON-відповіді
        res.json(todo);
    } catch (err) {
        // Обробка серверної помилки
        console.error(err);
        res.status(500).json({error: 'Помилка сервера'});
    }
});

// Маршрут для оновлення задачі за її ідентифікатором
app.put('/todo/update/:id', async (req, res) => {
    // Пошук задачі за її ідентифікатором
    const todo = await Todo.findById(req.params.id);

    // Оновлення тексту задачі із текстом із тіла запиту
    todo.text = req.body.text;

    // Збереження оновленої задачі
    todo.save();

    // Надсилання оновленої задачі у вигляді JSON-відповіді
    res.json(todo);
});

// Прослуховування порту 3001
app.listen(3001);
