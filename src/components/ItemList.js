import Drawer from '@mui/material/Drawer';
import makeStyles from '@mui/styles/makeStyles';
import React, { useContext, useEffect } from 'react';
import { HomeContext } from '../context/HomeProvider';
import TodoView from './ItemList/TodoView';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();

  const { openList } = useContext(HomeContext);

  useEffect(() => {
    if (!openList) {
      // redirect when coming directly to the URL
      navigate('/', { replace: true });
    }
  }, [openList, navigate]);

  return (
    <Drawer className={classes.drawer} anchor="right" open={openList} classes={{ paper: classes.drawerPaper }}>
      <TodoView />
    </Drawer>
  );
}

export default ItemList;
