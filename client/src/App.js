import { useEffect, useState } from 'react';
const api_base = 'http://localhost:3001';

function App() {
  // Стан для зберігання списку задач
  const [todos, setTodos] = useState([]);
  // Стан для відстеження активності вікна popup
  const [popupActive, setPopupActive] = useState(false);
  // Стан для зберігання нової задачі
  const [newTodo, setNewTodo] = useState("");

  // Завантаження списку задач при монтажі компонента
  useEffect(() => {
    GetTodos();
  }, []);

  // Функція для отримання списку задач
  const GetTodos = () => {
    fetch(api_base + '/todos')
        .then(res => res.json())
        .then(data => setTodos(data))
        .catch((err) => console.error("Помилка: ", err));
  }

  // Функція для відзначення задачі як виконаної або невиконаної
  const completeTodo = async id => {
    const data = await fetch(api_base + '/todo/complete/' + id).then(res => res.json());

    // Оновлення стану списку задач
    setTodos(todos => todos.map(todo => {
      if (todo._id === data._id) {
        todo.complete = data.complete;
      }

      return todo;
    }));
  }

  // Функція для додавання нової задачі
  const addTodo = async () => {
    const data = await fetch(api_base + "/todo/new", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        text: newTodo
      })
    }).then(res => res.json());

    // Додавання нової задачі до списку
    setTodos([...todos, data]);

    // Закриття popup вікна та очищення поля для нової задачі
    setPopupActive(false);
    setNewTodo("");
  }

  // Функція для видалення задачі
  const deleteTodo = async id => {
    const data = await fetch(api_base + '/todo/delete/' + id, { method: "DELETE" }).then(res => res.json());

    // Оновлення стану списку задач (видалення задачі)
    setTodos(todos => todos.filter(todo => todo._id !== data.result._id));
  }

  return (
      <div className="App">
        <h1>Ласкаво просимо, Дмитре!</h1>
        <h4>Ваші завдання:</h4>

        <div className="todos">
          {/* Відображення списку задач */}
          {todos.length > 0 ? todos.map(todo => (
              <div className={
                  "todo" + (todo.complete ? " is-complete" : "")
              } key={todo._id} onClick={() => completeTodo(todo._id)}>
                <div className="checkbox"></div>

                <div className="text">{todo.text}</div>

                {/* Кнопка для видалення задачі */}
                <div className="delete-todo" onClick={() => deleteTodo(todo._id)}>x</div>
              </div>
          )) : (
              <p>Список завдань порожній!</p>
          )}
        </div>

        {/* Кнопка для відкриття popup вікна для додавання нової задачі */}
        <div className="addPopup" onClick={() => setPopupActive(true)}>+</div>

        {/* Вікно для додавання нової задачі */}
        {popupActive ? (
            <div className="popup">
              <div className="closePopup" onClick={() => setPopupActive(false)}>X</div>
              <div className="content">
                <h3>Додати завдання</h3>
                {/* Поле для введення нової задачі */}
                <input type="text" className="add-todo-input" onChange={e => setNewTodo(e.target.value)} value={newTodo} />
                {/* Кнопка для створення нової задачі */}
                <div className="button" onClick={addTodo}>Створити завдання</div>
              </div>
            </div>
        ) : ''}
      </div>
  );
}

export default App;
