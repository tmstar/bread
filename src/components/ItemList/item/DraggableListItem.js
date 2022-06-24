import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import Brightness1TwoToneIcon from '@mui/icons-material/Brightness1TwoTone';
import DeleteIcon from '@mui/icons-material/Delete';
import Done from '@mui/icons-material/Done';
import DragHandleIcon from '@mui/icons-material/DragHandle';
import RemoveCircleOutlineTwoToneIcon from '@mui/icons-material/RemoveCircleOutlineTwoTone';
import Checkbox from '@mui/material/Checkbox';
import { amber, blueGrey, grey, teal, yellow } from '@mui/material/colors';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';
import withStyles from '@mui/styles/withStyles';
import clsx from 'clsx';
import React, { useMemo } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { useDeleteItem } from '../../../hooks/ListItemHooks';

const useStyles = makeStyles((theme) => ({
  index: {
    margin: theme.spacing(1, 0, 1),
    width: 30,
  },
  label: {
    marginRight: theme.spacing(4),
  },
  checkColor1: {
    color: yellow['A200'],
  },
  checkColor2: {
    color: teal['A400'],
  },
  checkColor3: {
    color: amber['A700'],
  },
}));

const getItemStyle = (isDragging, draggableStyle) => ({
  ...draggableStyle,
  ...(isDragging && {
    background: '#404040',
  }),
});

export const DraggableListItem = (props) => {
  const { todo: item, index, rowLength, hideSwitch, handleClickListItem } = props;
  const classes = useStyles();
  const { deleteItem } = useDeleteItem();

  const StrikeListItemText = useMemo(() => {
    return withStyles({
      root: {
        textDecoration: 'line-through',
        color: blueGrey['A200'],
      },
    })(ListItemText);
  }, []);

  const SwitchListItemText = ({ completed, ...props }) => {
    return completed ? <StrikeListItemText {...props} /> : <ListItemText {...props} />;
  };

  const SecondaryAction = (props) => {
    return (
      <ListItemSecondaryAction
        sx={{
          display: 'flex',
          '& hr': { ml: 2, mr: 1 },
        }}
      >
        <IconButton edge="end" size="large">
          <ArrowRightIcon />
        </IconButton>
        <Divider orientation="vertical" variant="middle" flexItem sx={{ borderColor: grey['600'] }} />
        <IconButton
          edge="end"
          size="large"
          onClick={(event) => {
            event.stopPropagation();
            deleteItem(props.id);
          }}
        >
          <DeleteIcon />
        </IconButton>
      </ListItemSecondaryAction>
    );
  };

  const colorClass = clsx(
    { [classes.checkColor1]: item.color === 'color1' },
    { [classes.checkColor2]: item.color === 'color2' },
    { [classes.checkColor3]: item.color === 'color3' }
  );

  const ReadOnlyListItem = ({ item, provided }) => {
    return (
      <ListItem button onClick={() => handleClickListItem(item)} disabled={item.color === 'indeterminate'}>
        <ListItemIcon>
          <Checkbox
            edge="start"
            disableRipple
            checked={item.completed}
            checkedIcon={<Done />}
            indeterminateIcon={<RemoveCircleOutlineTwoToneIcon />}
            icon={<Brightness1TwoToneIcon className={colorClass} />}
            className={colorClass}
            color={item.color === 'default' ? 'primary' : 'default'}
            indeterminate={item.color === 'indeterminate'}
          />
          <Typography variant="h6" className={classes.index}>
            {index + 1}
          </Typography>
        </ListItemIcon>
        <SwitchListItemText completed={item.completed} primary={item.title} secondary={item.note} />
        <div {...provided.dragHandleProps} />
      </ListItem>
    );
  };

  const EditableListItem = ({ item, provided }) => (
    <ListItem
      button
      onClick={() => handleClickListItem(item)}
      disabled={item.color === 'indeterminate'}
      secondaryAction={<SecondaryAction id={item.id} />}
    >
      <ListItemIcon>
        <IconButton {...provided.dragHandleProps} edge="start" size="large" sx={{ pl: 1.15, mr: 0.3, pr: 0.8, color: grey['600'] }}>
          <DragHandleIcon className={colorClass} />
        </IconButton>
        <Typography variant="h6" className={classes.index}>
          {index + 1}
        </Typography>
      </ListItemIcon>
      <SwitchListItemText completed={item.completed} primary={item.title} secondary={item.note} className={classes.label} />
    </ListItem>
  );

  return (
    <Draggable draggableId={item.id} index={index}>
      {(provided, snapshot) => (
        <div ref={provided.innerRef} {...provided.draggableProps} style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}>
          {hideSwitch ? <ReadOnlyListItem item={item} provided={provided} /> : <EditableListItem item={item} provided={provided} />}
          {index + 1 !== rowLength && !snapshot.isDragging ? <Divider /> : ''}
        </div>
      )}
    </Draggable>
  );
};
