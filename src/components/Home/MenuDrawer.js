import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import React, { useContext } from "react";
import { HomeContext } from "../../context/HomeProvider";

function MenuDrawer() {
  const { openMenu, toggleMenu } = useContext(HomeContext);

  return (
    <SwipeableDrawer anchor="left" open={openMenu} onClose={toggleMenu(false)} onOpen={toggleMenu(true)}>
      テキスト
    </SwipeableDrawer>
  );
}

export default MenuDrawer;
