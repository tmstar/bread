import { useEffect, useState } from "react";
import { v4 as uuid_v4 } from "uuid";
import TodoService from "../services/todos";

export default function useTodo() {
  const [todos, setTodos] = useState([]);
  useEffect(() => {
    TodoService.getAll().then((todos) => {
      setTodos(todos.reverse());
    });
  }, []);

  const toggleTodo = (id, completed) => {
    const todo = todos.find((todo) => todo.id === id);
    const newTodo = { ...todo, completed: !completed };

    // quick update displayed list
    const toggledTodos = todos.map((todo) => (todo.id !== newTodo.id ? todo : newTodo));
    setTodos(toggledTodos);

    TodoService.update(id, newTodo).then((updatedTodo) => {
      const newTodos = todos.map((todo) => (todo.id !== updatedTodo.id ? todo : updatedTodo));
      setTodos(newTodos);
    });
  };

  const hideTodo = (id, is_active) => {
    const todo = todos.find((todo) => todo.id === id);
    const newTodo = { ...todo, is_active: !is_active };

    // quick update displayed list
    const hidedTodos = todos.map((todo) => (todo.id !== newTodo.id ? todo : newTodo));
    setTodos(hidedTodos);

    TodoService.update(id, newTodo).then((updatedTodo) => {
      const newTodos = todos.map((todo) => (todo.id !== updatedTodo.id ? todo : updatedTodo));
      setTodos(newTodos);
    });
  };

  const updateTodo = (id, title, note) => {
    const todo = todos.find((todo) => todo.id === id);
    const newTodo = { ...todo, title: title, note: note };

    return TodoService.update(id, newTodo).then((updatedTodo) => {
      const newTodos = todos.map((todo) => (todo.id !== updatedTodo.id ? todo : updatedTodo));
      setTodos(newTodos);
    });
  };

  const deleteTodo = (id) => {
    TodoService.delete(id).then((deletedTodoId) => {
      const newTodos = todos.filter((todo) => todo.id !== deletedTodoId);
      setTodos(newTodos);
    });
  };

  const addTodo = (todo) => {
    const newTodo = { title: todo, completed: false, is_active: true, id: uuid_v4() };
    return TodoService.add(newTodo).then((addedTodo) => {
      setTodos([addedTodo].concat(todos));
    });
  };

  return { todos, toggleTodo, hideTodo, updateTodo, deleteTodo, addTodo };
}
