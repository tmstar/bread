import React, { useState, createContext } from "react";

export const HomeContext = createContext();

export const HomeProvider = ({ children }) => {
  const [openMenu, setOpenMenu] = useState(false);

  const toggleMenu = (open) => () => {
    setOpenMenu(open);
  };

  return (
    <HomeContext.Provider
      value={{
        openMenu,
        toggleMenu: toggleMenu,
      }}
    >
      {children}
    </HomeContext.Provider>
  );
};
