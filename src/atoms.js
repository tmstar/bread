import { atom, selector } from 'recoil';

export const openMenuState = atom({
  key: 'openMenu', // Menu drawer state
  default: false,
});

export const uniqueTagsState = atom({
  key: 'uniqueTags', // Unique tags displayed in Menu drawer
  default: [],
});

export const selectedTagState = atom({
  key: 'selectedTag', // Selected tag obj
  default: null,
});

export const listsInTagState = atom({
  key: 'listsInTag', // Lists in a specified tag
  default: [],
});

export const defaultMainTitle = 'すべてのリスト';
export const mainTitleState = atom({
  key: 'mainTitle', // Title on the top of Home
  default: defaultMainTitle,
});

export const openListState = atom({
  key: 'openList', // List drawer state
  default: false,
});

export const listState = atom({
  key: 'list', // Selected list obj
  default: null,
});

export const selectedListState = selector({
  key: 'selectedList',
  get: ({ get }) => get(listState),
  set: ({ set }, newValue) => {
    newValue || set(listItemsInListState, []);
    set(openListState, newValue ? true : false);
    set(listState, newValue);
  },
});

export const listItemsInListState = atom({
  key: 'listItemsInList', // List items in a specified list
  default: [],
  dangerouslyAllowMutability: true,
});

export const listTitleState = atom({
  key: 'listTitle', // List title
  default: '',
});

export const tagsInListState = atom({
  key: 'tagsInList', // Tags in a specified list
  default: [],
});
