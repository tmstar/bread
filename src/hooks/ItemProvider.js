import { useAuth0 } from '@auth0/auth0-react';
import { createContext, useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { v4 as uuid_v4 } from 'uuid';
import { listItemsInListState, listsInTagState, selectedListState, selectedTagState, tagsInListState, uniqueTagsState } from '../atoms';
import Hasura from '../services/hasura';
import ListService from '../services/itemList';
import TagService from '../services/tags';

export const ItemContext = createContext();

export const ItemProvider = ({ children }) => {
  const [uniqueTags, setUniqueTags] = useRecoilState(uniqueTagsState);
  const selectedTag = useRecoilValue(selectedTagState);
  const [lists, setLists] = useRecoilState(listsInTagState); // lists in a tag
  const setListItems = useSetRecoilState(listItemsInListState); // list items in a list
  const [tagsInList, setTagsInList] = useRecoilState(tagsInListState); // tags in a list
  const [selectedList, setSelectedList] = useRecoilState(selectedListState);
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [token, setToken] = useState();

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
      Hasura.initialize(user);
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
  }, [selectedList, setListItems, setTagsInList, getAccessTokenSilently]);

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

  const addList = (listName) => {
    setTagsInList([]);
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
        updateList: updateList,
        deleteList: deleteList,
        removeTag: removeTag,
        addList: addList,
        addTag: addTag,
      }}
    >
      {children}
    </ItemContext.Provider>
  );
};
