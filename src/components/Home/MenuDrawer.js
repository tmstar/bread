import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import React, { useContext } from "react";
import { HomeContext } from "../../context/HomeProvider";
import { ItemContext } from "../../hooks/ItemProvider";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListSubheader from "@material-ui/core/ListSubheader";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import InboxIcon from "@material-ui/icons/MoveToInbox";

const useStyles = makeStyles({
  list: {
    width: 250,
  },
});

function MenuDrawer() {
  const classes = useStyles();
  const { uniqueTags, selectTag } = useContext(ItemContext);
  const { openMenu, toggleMenu, setMainTitle, defaultMainTitle } = useContext(HomeContext);

  const handleListClick = (tag) => () => {
    setMainTitle(tag?.name);
    selectTag(tag);
  };

  const list = () => (
    <div className={classes.list} onClick={toggleMenu(false)}>
      <List>
        <ListItem button onClick={handleListClick([])}>
          <ListItemIcon>
            <InboxIcon />
          </ListItemIcon>
          <ListItemText primary={defaultMainTitle} />
        </ListItem>
      </List>
      <Divider />
      <List subheader={<ListSubheader>タグ</ListSubheader>}>
        {uniqueTags.map((tag) => (
          <ListItem button key={tag.id} onClick={handleListClick(tag)}>
            <ListItemText primary={tag.name} />
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <SwipeableDrawer anchor="left" open={openMenu} onClose={toggleMenu(false)} onOpen={toggleMenu(true)}>
      {list()}
    </SwipeableDrawer>
  );
}

export default MenuDrawer;
