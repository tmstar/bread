import Drawer from '@mui/material/Drawer';
import makeStyles from '@mui/styles/makeStyles';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { openListState } from '../atoms';
import TodoView from './ItemList/ItemListPage';

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
  const openList = useRecoilValue(openListState);

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
