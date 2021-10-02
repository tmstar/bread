import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import { makeStyles } from "@material-ui/core/styles";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import LocalOfferIcon from "@material-ui/icons/LocalOffer";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import React, { useContext } from "react";
import { HomeContext } from "../../context/HomeProvider";
import { ItemContext } from "../../hooks/ItemProvider";

const useStyles = makeStyles((theme) => ({
  title: {
    paddingLeft: theme.spacing(4.7),
  },
  list: {
    width: 250,
  },
  listItem: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  menu: {
    marginLeft: theme.spacing(-2.5),
  },
  tag: {
    paddingLeft: theme.spacing(6.9),
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
        <ListItem button onClick={handleListClick([])} className={classes.listItem}>
          <ListItemIcon>
            <InboxIcon />
          </ListItemIcon>
          <ListItemText
            className={classes.menu}
            primary={defaultMainTitle}
            primaryTypographyProps={{
              variant: "body1",
            }}
          />
        </ListItem>
        <Divider />
        <ListItem className={classes.listItem}>
          <ListItemIcon>
            <LocalOfferIcon />
          </ListItemIcon>
          <ListItemText
            className={classes.menu}
            primary={"タグ"}
            primaryTypographyProps={{
              variant: "body1",
            }}
          />
        </ListItem>
        {uniqueTags.map((tag) => (
          <ListItem button key={tag.id} onClick={handleListClick(tag)} className={classes.tag}>
            <ListItemText primary={tag.name} primaryTypographyProps={{ noWrap: true }} />
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <SwipeableDrawer anchor="left" open={openMenu} onClose={toggleMenu(false)} onOpen={toggleMenu(true)}>
      <Toolbar>
        <Typography variant="h5" color="textSecondary" className={classes.title}>
          {"Bread"}
        </Typography>
      </Toolbar>
      <Divider />
      {list()}
    </SwipeableDrawer>
  );
}

export default MenuDrawer;
