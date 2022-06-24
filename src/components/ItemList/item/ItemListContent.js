import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';
import React from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { useRecoilValue } from 'recoil';
import { listItemsInListState } from '../../../atoms';
import { useAllItems, useReorderItem, useToggleItem } from '../../../hooks/ListItemHooks';
import { DraggableListItem } from './DraggableListItem';
import EmptyListSvg from './eating_together.svg';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(0, 1),
  },
}));

const getPosition = (items, newIndex) => {
  let posUpper;
  if (newIndex) {
    posUpper = items[newIndex - 1].position || 0;
  } else {
    // if top of list, max value + 1
    posUpper = items[0].position + 1 || 1;
  }
  // if bottom of list, use 0
  const posLower = items[newIndex]?.position || 0;

  return (posUpper + posLower) / 2;
};

function ItemListContent({ hideSwitch, setSelectedTodo, setOpenForm }) {
  const classes = useStyles();
  const items = useRecoilValue(listItemsInListState);

  const { loading, data } = useAllItems();
  const { toggleItem } = useToggleItem();
  const { reorderItem } = useReorderItem();

  const handleClickListItem = (todo) => {
    if (hideSwitch) {
      toggleItem(todo.id, todo.completed);
    } else {
      setSelectedTodo(todo);
      setOpenForm(true);
    }
  };

  const handleDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination || destination.index === source.index) {
      return;
    }

    const newItems = [...items];
    const [removed] = newItems.splice(source.index, 1);
    const newRemoved = { ...removed };
    newRemoved.position = getPosition(newItems, destination.index);

    newItems.splice(destination.index, 0, newRemoved);
    reorderItem(newRemoved.id, newRemoved.position, newItems);
  };

  const todoList = items.map((todo, index) => (
    <DraggableListItem
      key={todo.id}
      todo={todo}
      index={index}
      rowLength={items.length}
      hideSwitch={hideSwitch}
      handleClickListItem={handleClickListItem}
    />
  ));

  if (loading)
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );

  if (data && !data.item.length) {
    return (
      <Grid container spacing={0} direction="column" alignItems="center" justifyContent="center" style={{ minHeight: '70vh' }}>
        <Grid item>
          <Box sx={{ px: 11, pb: 3 }}>
            <img src={EmptyListSvg} style={{ width: '100%', maxWidth: '364px' }} alt="empty list" />
          </Box>
        </Grid>
        <Grid item>
          <Typography variant="body">{'アイテムがありません'}</Typography>
        </Grid>
        <Grid item>
          <Typography variant="caption">{'右下のボタンからアイテムを追加できます。'}</Typography>
        </Grid>
      </Grid>
    );
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="droppable-list">
        {(provided) => (
          <List className={classes.root} ref={provided.innerRef}>
            {todoList}
            {provided.placeholder}
          </List>
        )}
      </Droppable>
    </DragDropContext>
  );
}

export default ItemListContent;
