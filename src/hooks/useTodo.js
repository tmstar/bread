import { useEffect, useState } from "react";
import { v4 as uuid_v4 } from "uuid";
import todoService from "../services/todos";

export default function useTodo() {
  const [todos, setTodos] = useState([]);
  useEffect(() => {
    todoService.getAll().then((todos) => {
      setTodos(todos.reverse());
    });
  }, []);

  const toggleTodo = (id, completed) => {
    const todo = todos.find((todo) => todo.id === id);
    const newTodo = { ...todo, completed: !completed };

    todoService.update(id, newTodo).then((updatedTodo) => {
      const newTodos = todos.map((todo) => (todo.id !== updatedTodo.id ? todo : updatedTodo));
      setTodos(newTodos);
    });
  };

  const hideTodo = (id, isActive) => {
    const todo = todos.find((todo) => todo.id === id);
    const newTodo = { ...todo, isActive: !isActive };

    todoService.update(id, newTodo).then((updatedTodo) => {
      const newTodos = todos.map((todo) => (todo.id !== updatedTodo.id ? todo : updatedTodo));
      setTodos(newTodos);
    });
  };

  const updateTodo = (id, title, note) => {
    const todo = todos.find((todo) => todo.id === id);
    const newTodo = { ...todo, title: title, note: note };

    return todoService.update(id, newTodo).then((updatedTodo) => {
      const newTodos = todos.map((todo) => (todo.id !== updatedTodo.id ? todo : updatedTodo));
      setTodos(newTodos);
    });
  };

  const deleteTodo = (id) => {
    todoService.delete(id).then((deletedTodoId) => {
      const newTodos = todos.filter((todo) => todo.id !== deletedTodoId);
      setTodos(newTodos);
    });
  };

  const addTodo = (todo) => {
    const newTodo = { title: todo, completed: false, isActive: true, id: uuid_v4() };
    return todoService.add(newTodo).then((addedTodo) => {
      setTodos([addedTodo].concat(todos));
    });
  };

  return { todos, toggleTodo, hideTodo, updateTodo, deleteTodo, addTodo };
}
