import "./App.css";
import TodoList from "./components/TodoList";
import useTodo from "./hooks/useTodo";

function App() {
  const { todos } = useTodo();
  return (
    <div className="App">
      <h1>TodoList</h1>
      <TodoList todos={todos} />
    </div>
  );
}

export default App;
