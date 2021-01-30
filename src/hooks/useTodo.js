import { useEffect, useState } from "react";
import { v4 as uuid_v4 } from "uuid";
import TodoService from "../services/todos";
import ListService from "../services/itemList";
import TagService from "../services/tags";
import Hasura from "../services/hasura";

export default function useTodo(uid) {
  const [todos, setTodos] = useState([]);
  const [lists, setLists] = useState([]);
  const [selectedList, setSelectedList] = useState();

  useEffect(() => {
    Hasura.initialize(uid);
    ListService.getAll().then((itemLists) => {
      setLists(itemLists);
    });
  }, []);

  useEffect(() => {
    if (!selectedList) {
      return;
    }
    TodoService.getAll(selectedList.id).then((todos) => {
      setTodos(todos.reverse());
    });
  }, [selectedList]);

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

  const updateList = (id, name) => {
    const list = lists.find((list) => list.id === id);
    const newList = { ...list, name: name };

    return ListService.update(id, newList).then((updatedList) => {
      const newLists = lists.map((list) => (list.id !== updatedList.id ? list : updatedList));
      setLists(newLists);
    });
  };

  const deleteTodo = (id) => {
    TodoService.delete(id).then((deletedTodoId) => {
      const newTodos = todos.filter((todo) => todo.id !== deletedTodoId);
      setTodos(newTodos);
    });
  };

  const deleteCompletedTodos = (listId) => {
    TodoService.deleteCompleted(listId).then((deletedTodos) => {
      const newTodos = todos.filter((todo) => !deletedTodos.some((d) => d.id === todo.id));
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
      item_list_id: selectedList.id,
    };
    return TodoService.add(newTodo).then((addedTodo) => {
      setTodos([addedTodo].concat(todos));
    });
  };

  const addList = (listName) => {
    const newItemList = { name: listName, id: uuid_v4() };
    return ListService.add(newItemList).then((addedList) => {
      setLists([addedList].concat(lists));
      setSelectedList(addedList);
    });
  };

  const addTag = (listId, tag) => {
    if (!tag) {
      // empty tag ignored
      return;
    }

    const newTag = { id: uuid_v4(), name: tag };
    return TagService.add(listId, newTag).then(() => {});
  };

  return {
    todos,
    lists,
    selectedList,
    setSelectedList,
    toggleTodo,
    hideTodo,
    updateTodo,
    updateList,
    deleteTodo,
    deleteCompletedTodos,
    deleteList,
    addTodo,
    addList,
    addTag,
  };
}
