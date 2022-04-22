import React, { useState } from "react";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import InputBase from "@mui/material/InputBase";
import Button from "@mui/material/Button";
import makeStyles from '@mui/styles/makeStyles';
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import { ItemContext } from "../../hooks/ItemProvider";
import { useContext } from "react";

const useStyles = makeStyles((theme) => ({
  form: {
    margin: theme.spacing(0, 0, 5),
  },
  tag: {},
}));

export default function TagEditForm({ open, setOpen }) {
  const classes = useStyles();
  const { addTag } = useContext(ItemContext);

  const [tag, setTag] = useState("");
  const toggleDrawer = (isOpen) => () => {
    setOpen(isOpen);
  };

  const handleTagSubmit = (event) => {
    event.preventDefault();
    addTag(tag).then(() => {
      setOpen(false);
      setTag("");
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
