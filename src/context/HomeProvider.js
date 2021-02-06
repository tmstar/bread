import React, { useState, useEffect, createContext } from "react";

const defaultMainTitle = "すべてのリスト";

export const HomeContext = createContext();

export const HomeProvider = ({ children }) => {
  const [openMenu, setOpenMenu] = useState(false);
  const [mainTitle, setMainTitle] = useState();

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
        mainTitle,
        defaultMainTitle,
        toggleMenu: toggleMenu,
        setMainTitle: setMainTitle,
      }}
    >
      {children}
    </HomeContext.Provider>
  );
};
