import Drawer from '@mui/material/Drawer';
import makeStyles from '@mui/styles/makeStyles';
import React, { useContext } from 'react';
import { HomeContext } from '../context/HomeProvider';
import TodoView from './ItemList/TodoView';

const drawerWidth = '100%';

const useStyles = makeStyles((theme) => ({
  drawer: {
    width: drawerWidth,
    // flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
    backgroundImage: 'none',
  },
}));
function ItemList() {
  const classes = useStyles();
  const { openList, toggleList, listTitle, setListTitle } = useContext(HomeContext);

  return (
    <Drawer className={classes.drawer} anchor="right" open={openList} classes={{ paper: classes.drawerPaper }}>
      <TodoView setOpen={toggleList} title={listTitle} setTitle={setListTitle} />
    </Drawer>
  );
}

export default ItemList;
