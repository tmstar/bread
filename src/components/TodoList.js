import Checkbox from "@material-ui/core/Checkbox";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import { makeStyles } from "@material-ui/core/styles";
import DeleteIcon from "@material-ui/icons/Delete";
import React, {useState} from "react";
import Switch from "@material-ui/core/Switch";
import ListSubheader from "@material-ui/core/ListSubheader";
import CommentIcon from "@material-ui/icons/Comment";
import TodoEditForm from "./TodoEditForm";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    maxWidth: 720,
    backgroundColor: theme.palette.background.paper,
  },
}));

function TodoList({ todos, toggleTodo, hideTodo, deleteTodo, hideSwitch, updateTodo }) {
  const classes = useStyles();
  const [selectedTodo, setSelectedTodo] = useState([]);
  const [openForm, setOpenForm] = useState(false);

  const listItemMain = (todo) => {
    return (
      <>
        <ListItemIcon>
          <Checkbox
            edge="start"
            disableRipple
            checked={todo.completed}
            onChange={() => toggleTodo(todo.id, todo.completed)}
          />
        </ListItemIcon>
        <ListItemText primary={todo.title} secondary={todo.note}/>

      </>
    );
  };

  const listItemSwitch = (todo) => {
    return (
      <>
        <ListItemIcon>
          <Switch
            edge="start"
            disableRipple
            onChange={() => hideTodo(todo.id, todo.isActive)}
            checked={todo.isActive}
          />
        </ListItemIcon>
        <ListItemText primary={todo.title} secondary={todo.note}/>
        <ListItemSecondaryAction>
          <IconButton edge="end">
            <CommentIcon onClick={() => {setSelectedTodo(todo);setOpenForm(true);}} />
          </IconButton>
          <IconButton edge="end">
            <DeleteIcon onClick={() => deleteTodo(todo.id)} />
          </IconButton>
        </ListItemSecondaryAction>
      </>
    );
  };

  const todoList = todos.map((todo) => {
    return (
      <ListItem key={todo.id}>
        {hideSwitch ? listItemMain(todo) : listItemSwitch(todo)}
      </ListItem>
    );
  });

  return (
    <>
      <List
        className={classes.root}
        subheader={
          <ListSubheader>
            {!hideSwitch ? "表示する食材を選んでください." : ""}
          </ListSubheader>
        }
      >
        {todoList}
      </List>
      <TodoEditForm todo={selectedTodo} openForm={openForm} setOpenForm={setOpenForm} updateTodo={updateTodo}/>
    </>
  );
}

export default TodoList;
