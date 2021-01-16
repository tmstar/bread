import "./App.css";
import React, { useState, useMemo } from "react";
import TodoList from "./components/TodoList";
import TodoForm from "./components/TodoForm";
import TodoFilter from "./components/TodoFilter";
import useTodo from "./hooks/useTodo";

function App() {
  const { todos, toggleTodo, deleteTodo, addTodo } = useTodo();
  const [filter, setFilter] = useState("all");
  const handleFilter = (event) => {
    setFilter(event.target.value);
  };
  const filteredTodos = useMemo(() => {
    switch (filter) {
      case "inProgress":
        return todos.filter((todo) => !todo.completed);
      case "completed":
        return todos.filter((todo) => todo.completed);
      case "all":
      default:
        return todos;
    }
  }, [todos, filter]);
  return (
    <div className="App">
      <h1>TodoList</h1>
      <TodoFilter handleFilter={handleFilter} selectedFilter={filter} />
      <TodoForm addTodo={addTodo} />
      <TodoList
        todos={filteredTodos}
        toggleTodo={toggleTodo}
        deleteTodo={deleteTodo}
      />
    </div>
  );
}

export default App;
