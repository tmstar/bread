import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import EditIcon from "@material-ui/icons/Edit";
import SaveIcon from "@material-ui/icons/Save";
import SpeedDial from "@material-ui/lab/SpeedDial";
import SpeedDialAction from "@material-ui/lab/SpeedDialAction";
import SpeedDialIcon from "@material-ui/lab/SpeedDialIcon";
import React, { useState } from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    height: 380,
    transform: "translateZ(0px)",
    flexGrow: 1,
  },
  speedDial: {
    position: "absolute",
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
}));

const actions = [{ icon: <SaveIcon />, name: "Create" }];

function TodoForm({ addTodo }) {
  const classes = useStyles();
  const [value, setValue] = useState("");
  const [open, setOpen] = React.useState(false);
  const [openForm, setOpenForm] = React.useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    addTodo(value).then(() => {
      setValue("");
    });
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleClickOpen = () => {
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
  };

  return (
    <div>
      <SpeedDial
        ariaLabel="SpeedDial openIcon example"
        className={classes.speedDial}
        icon={<SpeedDialIcon openIcon={<EditIcon />} />}
        onClose={handleClose}
        onOpen={handleOpen}
        open={open}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            onClick={handleClickOpen}
          />
        ))}
      </SpeedDial>
      <Dialog
        open={openForm}
        onClose={handleCloseForm}
        aria-labelledby="form-dialog-title"
      >
        <form onSubmit={handleSubmit}>
          <DialogTitle id="form-dialog-title">買うもの</DialogTitle>
          <DialogContent>
            <DialogContentText>追加する食材を入力してください.</DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="テキスト"
              fullWidth
              value={value}
              onChange={(event) => setValue(event.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseForm} color="primary">
              Cancel
            </Button>
            <Button onClick={handleCloseForm} color="primary" type="submit">
              OK
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}

export default TodoForm;
