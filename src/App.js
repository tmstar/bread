import "./App.css";
import TodoList from "./components/TodoList";
import TodoForm from "./components/TodoForm";
import useTodo from "./hooks/useTodo";

function App() {
  const { todos, toggleTodo, deleteTodo, addTodo } = useTodo();
  return (
    <div className="App">
      <h1>TodoList</h1>
      <TodoForm addTodo={addTodo} />
      <TodoList todos={todos} toggleTodo={toggleTodo} deleteTodo={deleteTodo}/>
    </div>
  );
}

export default App;
