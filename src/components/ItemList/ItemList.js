import Fab from '@mui/material/Fab';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import makeStyles from '@mui/styles/makeStyles';
import React, { useState } from 'react';
import ItemEditForm from './item/ItemEditForm';
import ItemListContent from './item/ItemListContent';

const useStyles = makeStyles((theme) => ({
  speedDial: {
    position: 'fixed',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
}));

function TodoList({ hideSwitch }) {
  const classes = useStyles();
  const [selectedTodo, setSelectedTodo] = useState();
  const [openForm, setOpenForm] = useState(false);

  const handleClickOpen = () => {
    setSelectedTodo(null);
    setOpenForm(true);
  };

  return (
    <>
      <ItemEditForm todo={selectedTodo} open={openForm} setOpen={setOpenForm} />
      <ItemListContent hideSwitch={hideSwitch} setSelectedTodo={setSelectedTodo} setOpenForm={setOpenForm} />
      <Fab aria-label="add item" className={classes.speedDial} onClick={handleClickOpen}>
        <SpeedDialIcon />
      </Fab>
    </>
  );
}

export default TodoList;
