import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export const AlertDialog = ({ onCloseOk, ...props }) => {
  return (
    <Dialog {...props} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
      <DialogTitle id="alert-dialog-title">{props.title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">{props.msg}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose} color="primary">
          {'キャンセル'}
        </Button>
        <Button onClick={onCloseOk} color="primary" autoFocus>
          {props.labelok}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
