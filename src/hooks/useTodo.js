import { useState, useEffect } from "react";
import todoService from "../services/todos";

export default function useTodo() {
  const [todos, setTodos] = useState([]);
  useEffect(() => {
    todoService.getAll().then(todos => {
      setTodos(todos.reverse());
    });
  }, []);
  return { todos };
}
