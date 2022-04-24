import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import makeStyles from '@mui/styles/makeStyles';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import React, { useContext } from 'react';
import { HomeContext } from '../../context/HomeProvider';
import { ItemContext } from '../../hooks/ItemProvider';
import LogoutButton from '../Logout';

const useStyles = makeStyles((theme) => ({
  title: {
    paddingLeft: theme.spacing(4.7),
  },
  list: {
    width: 250,
  },
  listItemTop: {
    paddingBottom: theme.spacing(1),
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
        <ListItem button onClick={handleListClick([])} className={classes.listItemTop}>
          <ListItemIcon>
            <InboxIcon />
          </ListItemIcon>
          <ListItemText
            className={classes.menu}
            primary={defaultMainTitle}
            primaryTypographyProps={{
              variant: 'body1',
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
            primary={'タグ'}
            primaryTypographyProps={{
              variant: 'body1',
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
        <Typography variant="body1" color="textSecondary" className={classes.title}>
          {'Bread'}
        </Typography>
      </Toolbar>
      <Divider />
      {list()}
      <LogoutButton />
    </SwipeableDrawer>
  );
}

export default MenuDrawer;
