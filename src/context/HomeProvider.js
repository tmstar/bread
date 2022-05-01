import React, { useState, useEffect, createContext } from 'react';

const defaultMainTitle = 'すべてのリスト';

export const HomeContext = createContext();

export const HomeProvider = ({ children }) => {
  const [openMenu, setOpenMenu] = useState(false);
  const [mainTitle, setMainTitle] = useState();
  const [openList, setOpenList] = useState(false);
  const [listTitle, setListTitle] = useState();

  useEffect(() => {
    if (!mainTitle) {
      setMainTitle(defaultMainTitle);
    }
  }, [mainTitle]);

  const toggleMenu = (open) => () => {
    setOpenMenu(open);
  };

  return (
    <HomeContext.Provider
      value={{
        openMenu,
        openList,
        mainTitle,
        listTitle,
        defaultMainTitle,
        toggleMenu: toggleMenu,
        toggleList: setOpenList,
        setMainTitle: setMainTitle,
        setListTitle: setListTitle,
      }}
    >
      {children}
    </HomeContext.Provider>
  );
};
