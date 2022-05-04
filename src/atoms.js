import { atom } from 'recoil';

export const openMenuState = atom({
  key: 'openMenu',
  default: false,
});

export const defaultMainTitle = 'すべてのリスト';
export const mainTitleState = atom({
  key: 'mainTitle',
  default: defaultMainTitle,
});

export const openListState = atom({
  key: 'openList',
  default: false,
});

export const listTitleState = atom({
  key: 'listTitle',
  default: '',
});
