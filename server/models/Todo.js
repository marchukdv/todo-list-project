const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Створюємо схему для задач
const TodoSchema = new Schema({
    text: {
        type: String, // Тип поля: рядок
        required: true // Поле є обов'язковим
    },
    complete: {
        type: Boolean, // Тип поля: логічний
        default: false // Значення за замовчуванням: false
    },
    timestamp: {
        type: String, // Тип поля: рядок
        default: Date.now() // Значення за замовчуванням: поточна дата та час
    }
});

// Створюємо модель Todo на основі схеми
const Todo = mongoose.model("Todo", TodoSchema);

// Експортуємо модель Todo для використання у інших частинах додатку
module.exports = Todo;
