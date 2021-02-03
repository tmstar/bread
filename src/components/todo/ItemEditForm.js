import React, { useState, useEffect, useContext } from "react";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import InputBase from "@material-ui/core/InputBase";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import { ItemContext } from "../../hooks/ItemProvider";

const useStyles = makeStyles((theme) => ({
  form: {
    margin: theme.spacing(0, 0, 5),
  },
  tag: {},
}));

export default function ItemEditForm({ open, setOpen, todo }) {
  const classes = useStyles();
  const { updateTodo, addTodo } = useContext(ItemContext);

  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    if (todo) {
      setTitle(todo.title);
      setNote(todo.note);
    } else {
      setTitle("");
      setNote("");
    }
  }, [todo]);

  const toggleDrawer = (isOpen) => () => {
    setOpen(isOpen);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (todo) {
      updateTodo(todo.id, title, note).then(() => {
        setOpen(false);
      });
    } else {
      addTodo(title).then(() => {
        setTitle("");
      });
    }
  };

  return (
    <SwipeableDrawer anchor="bottom" open={open} onClose={toggleDrawer(false)} onOpen={toggleDrawer(true)}>
      <form onSubmit={handleSubmit}>
        <div className={classes.form}>
          <DialogContent>
            <InputBase
              className={classes.tag}
              margin="dense"
              autoFocus
              label="タイトル"
              value={title}
              placeholder="タイトルの追加..."
              inputProps={{ "aria-label": "add tag" }}
              onChange={(event) => setTitle(event.target.value)}
              fullWidth
            />
            {todo ? (
              <InputBase
                className={classes.tag}
                margin="dense"
                autoFocus
                multiline
                rows={4}
                label="メモ"
                value={note || ""} // textarea cannot be null
                placeholder="コメントの追加..."
                inputProps={{ "aria-label": "add tag" }}
                onChange={(event) => setNote(event.target.value)}
                fullWidth
              />
            ) : (
              ""
            )}
          </DialogContent>
          <DialogActions>
            <Button color="primary" onClick={toggleDrawer(false)}>
              キャンセル
            </Button>
            <Button type="submit" color="primary">
              保存
            </Button>
          </DialogActions>
        </div>
      </form>
    </SwipeableDrawer>
  );
}
