import Brightness1TwoToneIcon from '@mui/icons-material/Brightness1TwoTone';
import CommentIcon from '@mui/icons-material/Comment';
import DeleteIcon from '@mui/icons-material/Delete';
import Done from '@mui/icons-material/Done';
import RemoveCircleOutlineTwoToneIcon from '@mui/icons-material/RemoveCircleOutlineTwoTone';
import Checkbox from '@mui/material/Checkbox';
import { amber, blueGrey, teal, yellow } from '@mui/material/colors';
import Divider from '@mui/material/Divider';
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
import React, { useContext, useMemo } from 'react';
import { ItemContext } from '../../hooks/ItemProvider';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { listItemsInListState } from '../../atoms';
import { useRecoilState } from 'recoil';

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

function ItemListContent({ hideSwitch, setSelectedTodo, setOpenForm }) {
  const classes = useStyles();
  const [todos, setItems] = useRecoilState(listItemsInListState);

  const { toggleTodo, deleteTodo } = useContext(ItemContext);

  const StrikeListItemText = useMemo(() => {
    return withStyles({
      root: {
        textDecoration: 'line-through',
        color: blueGrey['A200'],
      },
    })(ListItemText);
  }, []);

  const handleClickListItem = (todo) => {
    if (todo._updating) {
      // ignore when updating
      return;
    }
    todo._updating = true;
    toggleTodo(todo.id, todo.completed);
  };

  const handleDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) {
      return;
    }
    const newItems = [...todos];
    const [removed] = newItems.splice(source.index, 1);
    newItems.splice(destination.index, 0, removed);
    setItems(newItems);
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
        <IconButton edge="end" onClick={() => deleteTodo(todo.id)} size="large">
          <DeleteIcon />
        </IconButton>
      </ListItemSecondaryAction>
    );
  };

  const todoList = todos.map((todo, index) => {
    const rowLength = todos.length;
    return (
      <Draggable key={todo.id} draggableId={todo.id} index={index}>
        {(provided, snapshot) => (
          <div
            key={todo.id + '-div'}
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
