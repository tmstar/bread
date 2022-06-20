import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import Button from '@mui/material/Button';
import { amber, teal, yellow } from '@mui/material/colors';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import FormControlLabel from '@mui/material/FormControlLabel';
import InputBase from '@mui/material/InputBase';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import makeStyles from '@mui/styles/makeStyles';
import withStyles from '@mui/styles/withStyles';
import React, { useEffect, useState } from 'react';
import { useAddItem, useUpdateItem } from '../../../hooks/ListItemHooks';

const useStyles = makeStyles((theme) => ({
  form: {
    margin: theme.spacing(0, 0, 5),
  },
  tag: {},
}));

const Color1Radio = withStyles({
  root: {
    color: yellow['A100'],
    '&$checked': {
      color: yellow['A200'],
    },
  },
  checked: {},
})((props) => <Radio color="default" {...props} />);

const Color2Radio = withStyles({
  root: {
    color: teal['A200'],
    '&$checked': {
      color: teal['A400'],
    },
  },
  checked: {},
})((props) => <Radio color="default" {...props} />);

const Color3Radio = withStyles({
  root: {
    color: amber['A400'],
    '&$checked': {
      color: amber['A700'],
    },
  },
  checked: {},
})((props) => <Radio color="default" {...props} />);

const IndeterminateRadio = withStyles({
  root: {
    color: 'default',
    '&$checked': {
      color: 'default',
    },
  },
  checked: {},
})((props) => <Radio color="default" icon={<RemoveCircleOutlineIcon />} checkedIcon={<RemoveCircleIcon />} {...props} />);

export default function ItemEditForm({ open, setOpen, todo }) {
  const classes = useStyles();
  const { updateItem } = useUpdateItem();
  const { addItem } = useAddItem();

  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');
  const [color, setColor] = React.useState('default');

  useEffect(() => {
    if (todo) {
      setTitle(todo.title);
      setNote(todo.note);
      setColor(todo.color);
    } else {
      setTitle('');
      setNote('');
      setColor('default');
    }
  }, [todo]);

  const toggleDrawer = (isOpen) => () => {
    setOpen(isOpen);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (todo) {
      updateItem(todo.id, title, note, color).then(() => {
        setOpen(false);
      });
    } else {
      addItem(title).then(() => {
        setTitle('');
      });
    }
  };

  const handleChange = (event) => {
    setColor(event.target.value);
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
              placeholder="アイテムの追加..."
              inputProps={{ 'aria-label': 'add tag' }}
              onChange={(event) => setTitle(event.target.value)}
              fullWidth
            />
            {todo ? (
              <>
                <InputBase
                  className={classes.tag}
                  margin="dense"
                  autoFocus
                  multiline
                  rows={4}
                  label="メモ"
                  value={note || ''} // textarea cannot be null
                  placeholder="コメントの追加..."
                  inputProps={{ 'aria-label': 'add tag' }}
                  onChange={(event) => setNote(event.target.value)}
                  fullWidth
                />
                <RadioGroup row aria-labelledby="color-radio-buttons" name="row-radio-buttons" sx={{ px: 1 }}>
                  <FormControlLabel
                    checked={color === 'default'}
                    value="default"
                    control={<Radio size="small" />}
                    onChange={handleChange}
                  />
                  <FormControlLabel
                    checked={color === 'color1'}
                    value="color1"
                    control={<Color1Radio size="small" />}
                    onChange={handleChange}
                  />
                  <FormControlLabel
                    checked={color === 'color2'}
                    value="color2"
                    control={<Color2Radio size="small" />}
                    onChange={handleChange}
                  />
                  <FormControlLabel
                    checked={color === 'color3'}
                    value="color3"
                    control={<Color3Radio size="small" />}
                    onChange={handleChange}
                  />
                  <FormControlLabel
                    checked={color === 'indeterminate'}
                    value="indeterminate"
                    control={<IndeterminateRadio size="small" />}
                    onChange={handleChange}
                  />
                </RadioGroup>
              </>
            ) : (
              ''
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
