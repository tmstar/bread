import { useAuth0 } from '@auth0/auth0-react';
import { createContext, useEffect, useState } from 'react';
import { v4 as uuid_v4 } from 'uuid';
import Hasura from '../services/hasura';
import ListService from '../services/itemList';
import TagService from '../services/tags';
import TodoService from '../services/todos';

export const ItemContext = createContext();

export const ItemProvider = ({ children }) => {
  const [uniqueTags, setUniqueTags] = useState([]);
  const [lists, setLists] = useState([]); // lists in a tag
  const [todos, setTodos] = useState([]); // todos in a list
  const [tagsInList, setTagsInList] = useState([]); // tags in a list
  const [selectedTag, setSelectedTag] = useState();
  const [selectedList, setSelectedList] = useState();
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [token, setToken] = useState();

  const _modifyUpdatedAt = (updatedList) => {
    const list = lists.find((list) => list.id === updatedList.id);
    const latestList = { ...list, updated_at: updatedList.updated_at };
    // Due to a bug, aggregation is done in js instead of GraphQL.
    latestList.items_aggregate.aggregate.count = updatedList.items.filter((e) => !e.completed).length;
    const newLists = lists
      .map((list) => (list.id !== latestList.id ? list : latestList))
      .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
    setLists(newLists);
  };

  const _replaceList = (updatedList) => {
    const list = lists.find((list) => list.id === updatedList.id);
    const latestList = { ...list, updated_at: updatedList.updated_at, name: updatedList.name };
    const newLists = lists
      .map((list) => (list.id !== latestList.id ? list : latestList))
      .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
    setLists(newLists);
  };

  const _addTag = (listId, tagName, isReplaced) => {
    const newTag = { id: uuid_v4(), name: tagName };
    return TagService.add(listId, newTag).then((addedTag) => {
      if (isReplaced) {
        setTagsInList([addedTag]);
      } else if (!tagsInList.some((tag) => tag.name === addedTag.name)) {
        setTagsInList(tagsInList.concat([addedTag]));
      }
      if (!uniqueTags.some((tag) => tag.name === addedTag.name)) {
        const newTags = uniqueTags.concat([addedTag]).sort((a, b) => a.name.localeCompare(b.name));
        setUniqueTags(newTags);
      }
    });
  };

  useEffect(() => {
    if (!isAuthenticated || !user) {
      return;
    }
    getAccessTokenSilently().then((token) => {
      Hasura.initialize(user, token);
      setToken(token);
    });
  }, [isAuthenticated, user, getAccessTokenSilently]);

  useEffect(() => {
    if (!token) {
      return;
    }
    TagService.getAll().then((tagLists) => {
      setUniqueTags(tagLists);
    });
  }, [token]);

  useEffect(() => {
    if (!token) {
      return;
    }
    setLists([]);
    ListService.getAll(selectedTag?.id).then((itemLists) => {
      setLists(itemLists);
    });
  }, [token, selectedTag]);

  useEffect(() => {
    if (!selectedList) {
      setTagsInList([]);
      setTodos([]);
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

    TodoService.update(id, newTodo, selectedList.id)
      .then((result) => {
        const newTodos = todos.map((todo) => (todo.id !== result.item.id ? todo : result.item));
        setTodos(newTodos);
        _modifyUpdatedAt(result.itemList);
      })
      .catch((err) => {
        newTodo.updating = false;
        throw err;
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
      _replaceList(updatedList);
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
    ListService.delete(id).then((result) => {
      const newLists = lists.filter((list) => list.id !== result.itemListId);
      setLists(newLists);

      const unUsedTagIds = result.tags.filter((t) => !t.tag.item_list_tags_aggregate.aggregate.count).map((t) => t.tag_id);
      if (!unUsedTagIds.length) {
        return;
      }
      TagService.deleteAll(unUsedTagIds).then((deletedTags) => {
        const newTags = uniqueTags.filter((tag) => !deletedTags.some((t) => t.id === tag.id));
        setUniqueTags(newTags);
      });
    });
  };

  const removeTag = (tagId) => {
    TagService.remove(selectedList.id, tagId)
      .then((removedTag) => {
        const newTags = tagsInList.filter((tag) => tag.id !== removedTag.tag_id);
        setTagsInList(newTags);

        const hasLists = removedTag.tag.item_list_tags_aggregate.aggregate.count;
        if (!hasLists) {
          return TagService.delete(tagId);
        }
      })
      .then((deleteTag) => {
        if (deleteTag) {
          const newTags = uniqueTags.filter((tag) => tag.id !== deleteTag.id).sort((a, b) => a.name.localeCompare(b.name));
          setUniqueTags(newTags);
        }
        return ListService.getAll(selectedTag?.id).then((itemLists) => {
          setLists(itemLists);
        });
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
    setTagsInList([]);
    setTodos([]);
    const newItemList = { name: listName, id: uuid_v4() };
    return ListService.add(newItemList).then((addedList) => {
      addedList.items_aggregate = { aggregate: { count: 0 } };
      setLists([addedList].concat(lists));
      setSelectedList(addedList);

      if (selectedTag?.name) {
        _addTag(addedList.id, selectedTag.name, true);
      }
    });
  };

  const addTag = (tagName) => {
    if (!tagName) {
      // ignore empty tag
      return Promise.resolve();
    }
    return _addTag(selectedList.id, tagName);
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
