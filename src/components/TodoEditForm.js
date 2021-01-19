import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import React, { useState, useEffect } from "react";

function TodoEditForm({ todo, openForm, setOpenForm, updateTodo }) {
  const [value, setValue] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    setValue(todo.title);
    setNote(todo.note);
  }, [todo]);

  const handleSubmit = (event) => {
    event.preventDefault();
    updateTodo(todo.id, value, note).then(() => {
      setValue(value);
      setNote(note);
    });
  };

  const handleCloseForm = () => {
    setOpenForm(false);
  };

  return (
    <Dialog open={openForm} onClose={handleCloseForm} aria-labelledby="edit-form-dialog-title">
      <form onSubmit={handleSubmit}>
        <DialogTitle id="form-dialog-title">買うもの</DialogTitle>
        <DialogContent>
          <DialogContentText>メモを入力してください.</DialogContentText>
          <TextField
            margin="dense"
            id="title"
            label="Todo"
            fullWidth
            value={value}
            onChange={(event) => setValue(event.target.value)}
          />
          <TextField
            autoFocus
            multiline
            rows={4}
            margin="dense"
            id="note"
            label="メモ"
            fullWidth
            value={note || ""}
            onChange={(event) => setNote(event.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseForm} color="primary">
            Cancel
          </Button>
          <Button onClick={handleCloseForm} color="primary" type="submit">
            Ok
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default TodoEditForm;
