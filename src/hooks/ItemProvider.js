import { useEffect, useState, createContext, useContext } from "react";
import { v4 as uuid_v4 } from "uuid";
import TodoService from "../services/todos";
import ListService from "../services/itemList";
import TagService from "../services/tags";
import { AuthContext } from "./AuthProvider";

export const ItemContext = createContext();

export const ItemProvider = ({ children }) => {
  const [uniqueTags, setUniqueTags] = useState([]);
  const [lists, setLists] = useState([]); // lists in a tag
  const [todos, setTodos] = useState([]); // todos in a list
  const [tagsInList, setTagsInList] = useState([]); // tags in a list
  const [selectedTag, setSelectedTag] = useState();
  const [selectedList, setSelectedList] = useState();
  const { currentUser } = useContext(AuthContext);

  const _modifyUpdatedAt = (updatedList) => {
    const list = lists.find((list) => list.id === updatedList.id);
    const latestList = { ...list, updated_at: updatedList.updated_at };
    const newLists = lists
      .map((list) => (list.id !== latestList.id ? list : latestList))
      .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
    setLists(newLists);
  };

  useEffect(() => {
    if (!currentUser) {
      return;
    }
    TagService.getAll().then((tagLists) => {
      setUniqueTags(tagLists);
    });
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser) {
      return;
    }
    setLists([]);
    ListService.getAll(selectedTag?.id).then((itemLists) => {
      setLists(itemLists);
    });
  }, [currentUser, selectedTag]);

  useEffect(() => {
    if (!selectedList) {
      return;
    }
    const newTags = selectedList.item_list_tags.map((listTag) => {
      const tag = listTag.tag;
      return { id: tag.id, name: tag.name };
    });
    setTagsInList(newTags);
    setTodos([]);
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

    TodoService.update(id, newTodo, selectedList.id).then((result) => {
      const newTodos = todos.map((todo) => (todo.id !== result.item.id ? todo : result.item));
      setTodos(newTodos);
      _modifyUpdatedAt(result.itemList);
    });
  };

  const hideTodo = (id, is_active) => {
    const todo = todos.find((todo) => todo.id === id);
    const newTodo = { ...todo, is_active: !is_active };

    // quick update displayed list
    const hidedTodos = todos.map((todo) => (todo.id !== newTodo.id ? todo : newTodo));
    setTodos(hidedTodos);

    TodoService.update(id, newTodo, selectedList.id).then((result) => {
      const newTodos = todos.map((todo) => (todo.id !== result.item.id ? todo : result.item));
      setTodos(newTodos);
      _modifyUpdatedAt(result.itemList);
    });
  };

  const updateTodo = (id, title, note, color) => {
    if (!title) {
      // ignore empty title
      return Promise.resolve();
    }
    const todo = todos.find((todo) => todo.id === id);
    const newTodo = { ...todo, title: title, note: note, color: color };

    return TodoService.update(id, newTodo, selectedList.id).then((result) => {
      const newTodos = todos.map((todo) => (todo.id !== result.item.id ? todo : result.item));
      setTodos(newTodos);
      _modifyUpdatedAt(result.itemList);
    });
  };

  const updateList = (id, name) => {
    if (!name) {
      // ignore empty name
      return Promise.resolve();
    }
    const list = lists.find((list) => list.id === id);
    const newList = { ...list, name: name };

    return ListService.update(id, newList).then((updatedList) => {
      const newLists = lists.map((list) => (list.id !== updatedList.id ? list : updatedList));
      setLists(newLists);
    });
  };

  const deleteTodo = (id) => {
    TodoService.delete(id, selectedList.id).then((result) => {
      const newTodos = todos.filter((todo) => todo.id !== result.item.id);
      setTodos(newTodos);
      _modifyUpdatedAt(result.itemList);
    });
  };

  const deleteCompletedTodos = (listId) => {
    TodoService.deleteCompleted(listId).then((result) => {
      const newTodos = todos.filter((todo) => !result.items.some((d) => d.id === todo.id));
      setTodos(newTodos);
      _modifyUpdatedAt(result.itemList);
    });
  };

  const deleteList = (id) => {
    ListService.delete(id).then((deletedListId) => {
      const newLists = lists.filter((list) => list.id !== deletedListId);
      setLists(newLists);
    });
  };

  const removeTag = (tagId) => {
    TagService.remove(selectedList.id, tagId).then((removedTag) => {
      const newTags = tagsInList.filter((tag) => tag.id !== removedTag.tag_id);
      setTagsInList(newTags);
    });
  };

  const addTodo = (title) => {
    if (!title) {
      // ignore empty title
      return Promise.resolve();
    }
    const newTodo = {
      title: title,
      completed: false,
      is_active: true,
      id: uuid_v4(),
      item_list_id: selectedList.id,
    };
    return TodoService.add(newTodo).then((result) => {
      setTodos([result.item].concat(todos));
      _modifyUpdatedAt(result.itemList);
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
      // ignore empty tag
      return Promise.resolve();
    }
    const newTag = { id: uuid_v4(), name: tag };
    return TagService.add(listId, newTag).then((addedTag) => {
      if (!tagsInList.some((tag) => tag.name === addedTag.name)) {
        setTagsInList(tagsInList.concat([addedTag]));
      }
    });
  };

  return (
    <ItemContext.Provider
      value={{
        selectTag: setSelectedTag,
        selectList: setSelectedList,
        toggleTodo: toggleTodo,
        hideTodo: hideTodo,
        updateTodo: updateTodo,
        updateList: updateList,
        deleteTodo: deleteTodo,
        deleteCompletedTodos: deleteCompletedTodos,
        deleteList: deleteList,
        removeTag: removeTag,
        addTodo: addTodo,
        addList: addList,
        addTag: addTag,
        todos,
        uniqueTags,
        lists,
        selectedList,
        tags: tagsInList,
      }}
    >
      {children}
    </ItemContext.Provider>
  );
};
