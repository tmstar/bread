import ArrowBack from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import MoreIcon from '@mui/icons-material/MoreVert';
import AppBar from '@mui/material/AppBar';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Toolbar from '@mui/material/Toolbar';
import makeStyles from '@mui/styles/makeStyles';
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';
import { listTitleState, selectedListState, tagsInListState } from '../../atoms';
import { ItemContext } from '../../hooks/ItemProvider';
import { useDeleteList, useUpdateList } from '../../hooks/ListHooks';
import { useDeleteCompletedItems } from '../../hooks/ListItemHooks';
import { AlertDialog } from '../utils/AlertDialog';
import { Snackbar, SnackbarButton } from '../utils/Snackbar';
import TodoList from './ItemList';
import TagEditForm from './TagEditForm';

const useStyles = makeStyles((theme) => ({
  appBar: {
    color: theme.palette.text.primary,
    backgroundImage: 'none',
    boxShadow: 'none',
    borderBottom: '1px solid',
    borderBottomColor: theme.palette.divider,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-start',
  },
  title: {
    flexGrow: 1,
  },
  tagList: {
    margin: theme.spacing(0, 2),
  },
}));

function TodoView() {
  const classes = useStyles();
  const navigate = useNavigate();
  const [listTitle, setListTitle] = useRecoilState(listTitleState);
  const [selectedList, selectList] = useRecoilState(selectedListState);
  const tags = useRecoilValue(tagsInListState);

  const { removeTag } = useContext(ItemContext);
  const { updateList } = useUpdateList();
  const { deleteList } = useDeleteList();

  const { deleteCompletedItems, deleteItemsFromState, restoreItemsToState } = useDeleteCompletedItems();
  const [isListEdit, setIsListEdit] = useState(false);

  const [bottomDrawerOpen, setBottomDrawerOpen] = useState(false);

  const [snackOpen, setSnackOpen] = useState({ isOpen: false, state: null });
  const [alertOpen, setAlertOpen] = useState(false);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleDrawerClose = () => {
    navigate(-1);
    selectList(null);
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleDeleteListOk = () => {
    deleteList(selectedList.id);
    navigate(-1);
    selectList(null);
  };

  const toggleMode = () => {
    const newVal = isListEdit ? false : true;
    setIsListEdit(newVal);
    setMobileMoreAnchorEl(null);
  };

  const handleDeleteCompleted = () => {
    deleteItemsFromState();
    setSnackOpen({ isOpen: true });
    setMobileMoreAnchorEl(null);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    updateList(selectedList.id, listTitle);
  };

  const handleSnackClose = (event, reason) => {
    if (reason === 'clickaway' || snackOpen.state === 'undo') {
      return;
    }
    deleteCompletedItems();
    setSnackOpen({ isOpen: false });
  };

  const handleSnackUndo = () => {
    restoreItemsToState();
    setSnackOpen({ isOpen: false, state: 'undo' });
  };

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMobileMenuOpen}
      onClose={() => setMobileMoreAnchorEl(null)}
    >
      <MenuItem onClick={() => handleDeleteCompleted()}>
        <IconButton aria-label="delete completed" color="inherit" size="large">
          <DeleteIcon />
        </IconButton>
        <p>完了済みを削除</p>
      </MenuItem>
      <MenuItem
        onClick={() => {
          setAlertOpen(true);
          setMobileMoreAnchorEl(null);
        }}
        sx={{ color: 'error.light' }}
      >
        <IconButton aria-label="delete this list" color="inherit" size="large">
          <DeleteForeverIcon />
        </IconButton>
        <p>リストを削除</p>
      </MenuItem>
    </Menu>
  );

  const handleChipDelete = (id) => {
    removeTag(id);
  };

  const tagList = tags.map((tag) => {
    return <Chip key={tag.id} variant="outlined" size="small" label={tag.name} onDelete={() => handleChipDelete(tag.id)} />;
  });

  return (
    <>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerClose}
            edge="start"
            className={classes.menuButton}
            size="large"
          >
            <ArrowBack />
          </IconButton>
          <form onSubmit={handleSubmit} style={{ display: 'flex', width: '100%' }}>
            <InputBase
              className={classes.title}
              value={listTitle}
              placeholder="リストのタイトル"
              inputProps={{ 'aria-label': 'edit title' }}
              onChange={(event) => setListTitle(event.target.value)}
            />
          </form>
          <IconButton aria-label="toggle mode" edge="end" size="large" sx={{ ml: 'auto' }} onClick={() => toggleMode()}>
            {isListEdit ? <LockOpenOutlinedIcon /> : <LockOutlinedIcon sx={{ color: '#fde5a6' }} />}
          </IconButton>
          <IconButton
            aria-label="show more"
            aria-controls={mobileMenuId}
            aria-haspopup="true"
            onClick={handleMobileMenuOpen}
            color="inherit"
            edge="end"
            size="large"
          >
            <MoreIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      <div className={classes.drawerHeader} />
      <div>
        <div className={classes.tagList}>
          <IconButton
            aria-label="add tag"
            onClick={() => {
              setBottomDrawerOpen(true);
            }}
            color="inherit"
            size="large"
          >
            <LocalOfferIcon fontSize="small" />
          </IconButton>
          {tagList}
        </div>
        <TagEditForm open={bottomDrawerOpen} setOpen={setBottomDrawerOpen} />
        <TodoList hideSwitch={!isListEdit} />
        <Snackbar
          open={snackOpen.isOpen}
          onClose={handleSnackClose}
          message="完了済みアイテムを削除しました"
          action={<SnackbarButton label="元に戻す" onClick={() => handleSnackUndo()} />}
        />
        <AlertDialog
          open={alertOpen}
          onClose={() => setAlertOpen(false)}
          onCloseOk={() => {
            setAlertOpen(false);
            handleDeleteListOk();
          }}
          title="リストを削除しますか？"
          msg="このリスト上のすべてのアイテムが完全に削除されます"
          labelok="削除"
        />
      </div>
    </>
  );
}

export default TodoView;
