import React from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Checkbox from "@material-ui/core/Checkbox";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    maxWidth: 720,
    backgroundColor: theme.palette.background.paper,
  },
}));

function TodoList({ todos, toggleTodo, deleteTodo }) {
  const classes = useStyles();

  const todoList = todos.map((todo) => {
    return (
      <ListItem
        key={todo.id}
        onClick={() => toggleTodo(todo.id, todo.completed)}
      >
        <ListItemIcon>
          <Checkbox edge="start" disableRipple checked={todo.completed} />
        </ListItemIcon>
        <ListItemText primary={todo.title} />
        <ListItemSecondaryAction>
          <IconButton edge="end" onClick={() => deleteTodo(todo.id)}>
            <DeleteIcon />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
    );
  });

  return <List className={classes.root}>{todoList}</List>;
}

export default TodoList;
