import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import TextField from '@mui/material/TextField';
import makeStyles from '@mui/styles/makeStyles';
import React, { useContext, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { uniqueTagsState } from '../../atoms';
import { ItemContext } from '../../hooks/ItemProvider';

const useStyles = makeStyles((theme) => ({
  form: {
    margin: theme.spacing(0, 0, 5),
  },
  tag: {},
}));

export default function TagEditForm({ open, setOpen }) {
  const classes = useStyles();
  const uniqueTags = useRecoilValue(uniqueTagsState);
  const { addTag } = useContext(ItemContext);
  const [tag] = useState(''); // selected value
  const [inputTag, setInputTag] = useState(''); // text input value

  const toggleDrawer = (isOpen) => () => {
    setOpen(isOpen);
  };

  const handleTagSubmit = (event) => {
    event.preventDefault();
    addTag(inputTag).then(() => {
      setOpen(false);
      setInputTag('');
    });
  };

  return (
    <SwipeableDrawer anchor="bottom" open={open} onClose={toggleDrawer(false)} onOpen={toggleDrawer(true)}>
      <form onSubmit={handleTagSubmit}>
        <div className={classes.form}>
          <DialogContent>
            <Autocomplete
              className={classes.tag}
              autoFocus
              value={tag}
              inputValue={inputTag}
              options={uniqueTags.map((tag) => tag.name)}
              freeSolo
              placeholder="タグの追加..."
              onInputChange={(event, newValue) => {
                setInputTag(newValue);
              }}
              fullWidth
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="standard"
                  placeholder="タグの追加..."
                  InputProps={{ ...params.InputProps, disableUnderline: true }}
                />
              )}
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
