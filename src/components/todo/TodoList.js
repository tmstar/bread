import Checkbox from "@material-ui/core/Checkbox";
import { amber, teal, yellow } from "@material-ui/core/colors";
import Divider from "@material-ui/core/Divider";
import Fab from "@material-ui/core/Fab";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Brightness1TwoToneIcon from "@material-ui/icons/Brightness1TwoTone";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import CommentIcon from "@material-ui/icons/Comment";
import DeleteIcon from "@material-ui/icons/Delete";
import RemoveCircleOutlineTwoToneIcon from "@material-ui/icons/RemoveCircleOutlineTwoTone";
import SpeedDialIcon from "@material-ui/lab/SpeedDialIcon";
import clsx from "clsx";
import React, { useContext, useState } from "react";
import { ItemContext } from "../../hooks/ItemProvider";
import ItemEditForm from "./ItemEditForm";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.default,
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
    position: "fixed",
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
  checkColor1: {
    color: yellow["A200"],
  },
  uncheckColor1: {
    color: yellow["A200"],
  },
  checkColor2: {
    color: teal["A400"],
  },
  uncheckColor2: {
    color: teal["A400"],
  },
  checkColor3: {
    color: amber["A700"],
  },
  uncheckColor3: {
    color: amber["A700"],
  },
}));

function TodoList({ todos, hideSwitch }) {
  const classes = useStyles();
  const { toggleTodo, deleteTodo } = useContext(ItemContext);
  const [selectedTodo, setSelectedTodo] = useState();
  const [openForm, setOpenForm] = useState(false);

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
        >
          <CommentIcon />
        </IconButton>
        <IconButton edge="end" onClick={() => deleteTodo(todo.id)}>
          <DeleteIcon />
        </IconButton>
      </ListItemSecondaryAction>
    );
  };

  const todoList = todos.map((todo, index) => {
    const rowLength = todos.length;
    return (
      <div key={todo.id + "-div"}>
        <ListItem key={todo.id} button onClick={() => toggleTodo(todo.id, todo.completed)} disabled={todo.color === "indeterminate"}>
          <ListItemIcon>
            <Checkbox
              edge="start"
              disableRipple
              checked={todo.completed}
              checkedIcon={<CheckCircleOutlineIcon />}
              indeterminateIcon={<RemoveCircleOutlineTwoToneIcon />}
              icon={
                <Brightness1TwoToneIcon
                  className={clsx(
                    { [classes.uncheckColor1]: todo.color === "color1" },
                    { [classes.uncheckColor2]: todo.color === "color2" },
                    { [classes.uncheckColor3]: todo.color === "color3" }
                  )}
                />
              }
              className={clsx(
                { [classes.checkColor1]: todo.color === "color1" },
                { [classes.checkColor2]: todo.color === "color2" },
                { [classes.checkColor3]: todo.color === "color3" }
              )}
              color={todo.color === "default" ? "primary" : "default"}
              indeterminate={todo.color === "indeterminate"}
            />
            <Typography variant="h6" className={classes.index}>
              {index + 1}
            </Typography>
          </ListItemIcon>
          <ListItemText primary={todo.title} secondary={todo.note} className={hideSwitch ? "" : classes.label} />
          {hideSwitch ? "" : listSecondaryAction(todo)}
        </ListItem>
        {index + 1 !== rowLength ? <Divider /> : ""}
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
