import Brightness1TwoToneIcon from '@mui/icons-material/Brightness1TwoTone';
import CommentIcon from '@mui/icons-material/Comment';
import DeleteIcon from '@mui/icons-material/Delete';
import Done from '@mui/icons-material/Done';
import RemoveCircleOutlineTwoToneIcon from '@mui/icons-material/RemoveCircleOutlineTwoTone';
import Checkbox from '@mui/material/Checkbox';
import { amber, blueGrey, teal, yellow } from '@mui/material/colors';
import Divider from '@mui/material/Divider';
import Fab from '@mui/material/Fab';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import ListItemText from '@mui/material/ListItemText';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';
import withStyles from '@mui/styles/withStyles';
import clsx from 'clsx';
import React, { useContext, useMemo, useState } from 'react';
import { ItemContext } from '../../hooks/ItemProvider';
import ItemEditForm from './ItemEditForm';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(0, 1),
  },
  index: {
    margin: theme.spacing(1, 0, 1),
    width: 30,
  },
  text: {
    paddingRight: 60,
  },
  label: {
    marginRight: theme.spacing(4),
  },
  speedDial: {
    position: 'fixed',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
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

function TodoList({ todos, hideSwitch }) {
  const classes = useStyles();
  const { toggleTodo, deleteTodo } = useContext(ItemContext);
  const [selectedTodo, setSelectedTodo] = useState();
  const [openForm, setOpenForm] = useState(false);

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

  const handleClickOpen = () => {
    setSelectedTodo(null);
    setOpenForm(true);
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
      <div key={todo.id + '-div'}>
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
        {index + 1 !== rowLength ? <Divider /> : ''}
      </div>
    );
  });

  return (
    <>
      <ItemEditForm todo={selectedTodo} open={openForm} setOpen={setOpenForm} />
      <List className={classes.root}>{todoList}</List>
      <Fab aria-label="add item" className={classes.speedDial} onClick={handleClickOpen}>
        <SpeedDialIcon />
      </Fab>
    </>
  );
}

export default TodoList;
