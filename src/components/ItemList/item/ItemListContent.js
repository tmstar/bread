import Brightness1TwoToneIcon from '@mui/icons-material/Brightness1TwoTone';
import CommentIcon from '@mui/icons-material/Comment';
import DeleteIcon from '@mui/icons-material/Delete';
import Done from '@mui/icons-material/Done';
import RemoveCircleOutlineTwoToneIcon from '@mui/icons-material/RemoveCircleOutlineTwoTone';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import CircularProgress from '@mui/material/CircularProgress';
import { amber, blueGrey, teal, yellow } from '@mui/material/colors';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';
import withStyles from '@mui/styles/withStyles';
import clsx from 'clsx';
import React, { useMemo } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { useRecoilValue } from 'recoil';
import { listItemsInListState } from '../../../atoms';
import { useAllItems, useDeleteItem, useReorderItem, useToggleItem } from '../../../hooks/ListItemHooks';
import EmptyListSvg from './eating_together.svg';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(0, 1),
  },
  index: {
    margin: theme.spacing(1, 0, 1),
    width: 30,
  },
  label: {
    marginRight: theme.spacing(4),
  },
  checkColor1: {
    color: yellow['A200'],
  },
  uncheckColor1: {
    color: yellow['A200'],
  },
  checkColor2: {
    color: teal['A400'],
  },
  uncheckColor2: {
    color: teal['A400'],
  },
  checkColor3: {
    color: amber['A700'],
  },
  uncheckColor3: {
    color: amber['A700'],
  },
}));

const getItemStyle = (isDragging, draggableStyle) => ({
  ...draggableStyle,
  ...(isDragging && {
    background: '#404040',
  }),
});

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
  const { deleteItem } = useDeleteItem();

  const StrikeListItemText = useMemo(() => {
    return withStyles({
      root: {
        textDecoration: 'line-through',
        color: blueGrey['A200'],
      },
    })(ListItemText);
  }, []);

  const handleClickListItem = (todo) => {
    toggleItem(todo.id, todo.completed);
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

  const listSecondaryAction = (todo) => {
    return (
      <ListItemSecondaryAction>
        <IconButton
          edge="end"
          onClick={() => {
            setSelectedTodo(todo);
            setOpenForm(true);
          }}
          size="large"
        >
          <CommentIcon />
        </IconButton>
        <IconButton edge="end" onClick={() => deleteItem(todo.id)} size="large">
          <DeleteIcon />
        </IconButton>
      </ListItemSecondaryAction>
    );
  };

  const todoList = items.map((todo, index) => {
    const rowLength = items.length;
    return (
      <Draggable key={todo.id} draggableId={todo.id} index={index}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
          >
            <ListItem key={todo.id} button onClick={() => handleClickListItem(todo)} disabled={todo.color === 'indeterminate'}>
              <ListItemIcon>
                <Checkbox
                  edge="start"
                  disableRipple
                  checked={todo.completed}
                  checkedIcon={<Done />}
                  indeterminateIcon={<RemoveCircleOutlineTwoToneIcon />}
                  icon={
                    <Brightness1TwoToneIcon
                      className={clsx(
                        { [classes.uncheckColor1]: todo.color === 'color1' },
                        { [classes.uncheckColor2]: todo.color === 'color2' },
                        { [classes.uncheckColor3]: todo.color === 'color3' }
                      )}
                    />
                  }
                  className={clsx(
                    { [classes.checkColor1]: todo.color === 'color1' },
                    { [classes.checkColor2]: todo.color === 'color2' },
                    { [classes.checkColor3]: todo.color === 'color3' }
                  )}
                  color={todo.color === 'default' ? 'primary' : 'default'}
                  indeterminate={todo.color === 'indeterminate'}
                />
                <Typography variant="h6" className={classes.index}>
                  {index + 1}
                </Typography>
              </ListItemIcon>
              {todo.completed ? (
                <StrikeListItemText primary={todo.title} secondary={todo.note} className={hideSwitch ? '' : classes.label} />
              ) : (
                <ListItemText primary={todo.title} secondary={todo.note} className={hideSwitch ? '' : classes.label} />
              )}
              {hideSwitch ? '' : listSecondaryAction(todo)}
            </ListItem>
            {index + 1 !== rowLength && !snapshot.isDragging ? <Divider /> : ''}
          </div>
        )}
      </Draggable>
    );
  });

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
