import { useEffect, useState } from "react";
import { v4 as uuid_v4 } from "uuid";
import TodoService from "../services/todos";
import ListService from "../services/itemList";

export default function useTodo() {
  const [todos, setTodos] = useState([]);
  const [lists, setLists] = useState([]);
  const [selectedListIndex, setSelectedListIndex] = useState(0);

  useEffect(() => {
    console.log("useEffect");
    ListService.getAll().then((itemLists) => {
      setLists(itemLists.reverse());
    });
  }, []);

  useEffect(() => {
    if (!lists.length) {
      return;
    }
    TodoService.getAll(lists[selectedListIndex].id).then((todos) => {
      setTodos(todos.reverse());
    });
  }, [lists, selectedListIndex]);

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

  const deleteList = (id) => {
    ListService.delete(id).then((deletedListId) => {
      const newLists = lists.filter((list) => list.id !== deletedListId);
      setLists(newLists);
    });
  };

  const addTodo = (todo) => {
    const newTodo = {
      title: todo,
      completed: false,
      is_active: true,
      id: uuid_v4(),
      item_list_id: lists[selectedListIndex].id,
    };
    return TodoService.add(newTodo).then((addedTodo) => {
      setTodos([addedTodo].concat(todos));
    });
  };

  const addList = (listName) => {
    const newItemList = { name: listName, id: uuid_v4() };
    return ListService.add(newItemList).then((addedList) => {
      setLists([addedList].concat(lists));
    });
  };

  return {
    todos,
    lists,
    setLists,
    selectedListIndex,
    setSelectedListIndex,
    toggleTodo,
    hideTodo,
    updateTodo,
    deleteTodo,
    deleteList,
    addTodo,
    addList,
  };
}
