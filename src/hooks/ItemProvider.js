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
  const setLists = useSetRecoilState(listsInTagState); // lists in a tag
  const setListItems = useSetRecoilState(listItemsInListState); // list items in a list
  const [tagsInList, setTagsInList] = useRecoilState(tagsInListState); // tags in a list
  const selectedList = useRecoilValue(selectedListState);
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [token, setToken] = useState();

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
        removeTag: removeTag,
        addTag: addTag,
      }}
    >
      {children}
    </ItemContext.Provider>
  );
};
