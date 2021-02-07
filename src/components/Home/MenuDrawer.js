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
import Typography from "@material-ui/core/Typography";
import Toolbar from "@material-ui/core/Toolbar";
import InboxIcon from "@material-ui/icons/MoveToInbox";

const useStyles = makeStyles((theme) => ({
  list: {
    width: 250,
    padding: theme.spacing(1),
  },
  tag: {
    paddingLeft: theme.spacing(4),
  },
}));

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
          <ListItemText primary={<Typography>{defaultMainTitle}</Typography>} />
        </ListItem>
      </List>
      <List subheader={<ListSubheader>タグ</ListSubheader>}>
        {uniqueTags.map((tag) => (
          <ListItem button key={tag.id} onClick={handleListClick(tag)} className={classes.tag}>
            <ListItemText primary={<Typography>{tag.name}</Typography>} />
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <SwipeableDrawer anchor="left" open={openMenu} onClose={toggleMenu(false)} onOpen={toggleMenu(true)}>
      <Toolbar />
      <Divider />
      {list()}
    </SwipeableDrawer>
  );
}

export default MenuDrawer;
