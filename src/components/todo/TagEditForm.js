import React, { useState } from "react";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import InputBase from "@material-ui/core/InputBase";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";

const useStyles = makeStyles((theme) => ({
  form: {
    margin: theme.spacing(0, 0, 5),
  },
  tag: {},
}));

export default function TagEditForm({ td, open, setOpen, listId }) {
  const classes = useStyles();
  const { addTag } = td;

  const [tag, setTag] = useState("");
  const toggleDrawer = (isOpen) => () => {
    setOpen(isOpen);
  };

  const handleTagSubmit = (event) => {
    event.preventDefault();
    addTag(listId, tag).then(() => {
      setOpen(false);
    });
  };

  return (
    <SwipeableDrawer anchor="bottom" open={open} onClose={toggleDrawer(false)} onOpen={toggleDrawer(true)}>
      <form onSubmit={handleTagSubmit}>
        <div className={classes.form}>
          <DialogContent>
            <InputBase
              className={classes.tag}
              autoFocus
              value={tag}
              placeholder="タグの追加..."
              inputProps={{ "aria-label": "add tag" }}
              onChange={(event) => setTag(event.target.value)}
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button type="submit" color="primary">
              保存
            </Button>
          </DialogActions>
        </div>
      </form>
    </SwipeableDrawer>
  );
}
