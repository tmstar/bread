import { useAuth0 } from '@auth0/auth0-react';
import { createContext, useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { v4 as uuid_v4 } from 'uuid';
import { listItemsInListState, listsInTagState, selectedListState, selectedTagState, tagsInListState, uniqueTagsState } from '../atoms';
import Hasura from '../services/hasura';
import ListService from '../services/itemList';
import TagService from '../services/tags';
import TodoService from '../services/todos';

export const ItemContext = createContext();

export const ItemProvider = ({ children }) => {
  const [uniqueTags, setUniqueTags] = useRecoilState(uniqueTagsState);
  const selectedTag = useRecoilValue(selectedTagState);
  const [lists, setLists] = useRecoilState(listsInTagState); // lists in a tag
  const [listItems, setListItems] = useRecoilState(listItemsInListState); // list items in a list
  const [tagsInList, setTagsInList] = useRecoilState(tagsInListState); // tags in a list
  const [selectedList, setSelectedList] = useRecoilState(selectedListState);
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [token, setToken] = useState();

  const _modifyUpdatedAt = (updatedList) => {
    const list = lists.find((list) => list.id === updatedList.id);
    const latestList = { ...list, updated_at: updatedList.updated_at };
    // Due to a bug, aggregation is done in js instead of GraphQL.
    latestList._item_count = updatedList.items.filter((e) => !e.completed).length;
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
    return getAccessTokenSilently()
      .then((token) => {
        return TagService.add(token, listId, newTag);
      })
      .then((addedTag) => {
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
    getAccessTokenSilently()
      .then((token) => {
        return TagService.getAll(token);
      })
      .then((tagLists) => {
        setUniqueTags(tagLists);
      });
  }, [token, getAccessTokenSilently, setUniqueTags]);

  useEffect(() => {
    if (!token) {
      return;
    }
    setLists([]);
    getAccessTokenSilently()
      .then((token) => {
        return ListService.getAll(token, selectedTag?.id);
      })
      .then((itemLists) => {
        itemLists.map((list) => (list._item_count = list.items_aggregate.aggregate.count));
        setLists(itemLists);
      });
  }, [token, getAccessTokenSilently, selectedTag, setLists]);

  useEffect(() => {
    if (!selectedList) {
      setTagsInList([]);
      setListItems([]);
      return;
    }
    const newTags = selectedList.item_list_tags.map((listTag) => {
      const tag = listTag.tag;
      return { id: tag.id, name: tag.name };
    });
    setTagsInList(newTags);
    setListItems([]);
    getAccessTokenSilently()
      .then((token) => {
        return TodoService.getAll(token, selectedList.id);
      })
      .then((todos) => {
        setListItems(todos);
      });
  }, [selectedList, setListItems, setTagsInList, getAccessTokenSilently]);

  const toggleTodo = (id, completed) => {
    const todo = listItems.find((todo) => todo.id === id);
    const newTodo = { ...todo, completed: !completed };

    // quick update displayed list
    const toggledTodos = listItems.map((todo) => (todo.id !== newTodo.id ? todo : newTodo));
    setListItems(toggledTodos);

    getAccessTokenSilently()
      .then((token) => {
        return TodoService.update(token, id, newTodo, selectedList.id);
      })
      .then((result) => {
        _modifyUpdatedAt(result.itemList);
      })
      .finally(() => {
        newTodo._updating = false;
      });
  };

  const reorderTodo = (id, position) => {
    const todo = listItems.find((todo) => todo.id === id);

    const newTodo = { ...todo, position: position };

    getAccessTokenSilently()
      .then((token) => {
        return TodoService.update(token, id, newTodo, selectedList.id);
      })
      .then((result) => {
        _modifyUpdatedAt(result.itemList);
      });
  };

  const updateTodo = (id, title, note, color) => {
    if (!title) {
      // ignore empty title
      return Promise.resolve();
    }
    const todo = listItems.find((todo) => todo.id === id);
    const newTodo = { ...todo, title: title, note: note, color: color };

    return getAccessTokenSilently()
      .then((token) => {
        return TodoService.update(token, id, newTodo, selectedList.id);
      })
      .then((result) => {
        const newTodos = listItems.map((todo) => (todo.id !== result.item.id ? todo : result.item));
        setListItems(newTodos);
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

    return getAccessTokenSilently()
      .then((token) => {
        return ListService.update(token, id, newList);
      })
      .then((updatedList) => {
        _replaceList(updatedList);
      });
  };

  const deleteTodo = (id) => {
    getAccessTokenSilently()
      .then((token) => {
        return TodoService.delete(token, id, selectedList.id);
      })
      .then((result) => {
        const newTodos = listItems.filter((todo) => todo.id !== result.item.id);
        setListItems(newTodos);
        _modifyUpdatedAt(result.itemList);
      });
  };

  const deleteCompletedTodos = (listId) => {
    getAccessTokenSilently()
      .then((token) => {
        return TodoService.deleteCompleted(token, listId);
      })
      .then((result) => {
        const newTodos = listItems.filter((todo) => !result.items.some((d) => d.id === todo.id));
        setListItems(newTodos);
        _modifyUpdatedAt(result.itemList);
      });
  };

  const deleteList = (id) => {
    getAccessTokenSilently()
      .then((token) => {
        return ListService.delete(token, id);
      })
      .then((result) => {
        const newLists = lists.filter((list) => list.id !== result.itemListId);
        setLists(newLists);

        const unUsedTagIds = result.tags.filter((t) => !t.tag.item_list_tags_aggregate.aggregate.count).map((t) => t.tag_id);
        if (!unUsedTagIds.length) {
          return;
        }
        getAccessTokenSilently()
          .then((token) => {
            return TagService.deleteAll(token, unUsedTagIds);
          })
          .then((deletedTags) => {
            const newTags = uniqueTags.filter((tag) => !deletedTags.some((t) => t.id === tag.id));
            setUniqueTags(newTags);
          });
      });
  };

  const removeTag = (tagId) => {
    getAccessTokenSilently()
      .then((token) => {
        return TagService.remove(token, selectedList.id, tagId);
      })
      .then((removedTag) => {
        const newTags = tagsInList.filter((tag) => tag.id !== removedTag.tag_id);
        setTagsInList(newTags);

        const hasLists = removedTag.tag.item_list_tags_aggregate.aggregate.count;
        if (!hasLists) {
          return TagService.delete(token, tagId);
        }
      })
      .then((deleteTag) => {
        if (deleteTag) {
          const newTags = uniqueTags.filter((tag) => tag.id !== deleteTag.id).sort((a, b) => a.name.localeCompare(b.name));
          setUniqueTags(newTags);
        }
        return ListService.getAll(token, selectedTag?.id).then((itemLists) => {
          setLists(itemLists);
        });
      });
  };

  const addTodo = (title) => {
    if (!title) {
      // ignore empty title
      return Promise.resolve();
    }
    const newPosition = listItems.length ? Math.max(...listItems.map((item) => item.position)) + 1 : 1;
    const newTodo = {
      title: title,
      completed: false,
      is_active: true,
      position: newPosition,
      id: uuid_v4(),
      item_list_id: selectedList.id,
    };
    return getAccessTokenSilently()
      .then((token) => {
        return TodoService.add(token, newTodo);
      })
      .then((result) => {
        setListItems([result.item].concat(listItems));
        _modifyUpdatedAt(result.itemList);
      });
  };

  const addList = (listName) => {
    setTagsInList([]);
    setListItems([]);
    const newItemList = { name: listName, id: uuid_v4() };
    return getAccessTokenSilently()
      .then((token) => {
        return ListService.add(token, newItemList);
      })
      .then((addedList) => {
        addedList._item_count = 0;
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
        toggleTodo: toggleTodo,
        reorderTodo: reorderTodo,
        updateTodo: updateTodo,
        updateList: updateList,
        deleteTodo: deleteTodo,
        deleteCompletedTodos: deleteCompletedTodos,
        deleteList: deleteList,
        removeTag: removeTag,
        addTodo: addTodo,
        addList: addList,
        addTag: addTag,
      }}
    >
      {children}
    </ItemContext.Provider>
  );
};
