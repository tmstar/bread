import AppBar from '@mui/material/AppBar';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import makeStyles from '@mui/styles/makeStyles';
import Toolbar from '@mui/material/Toolbar';
import AllInboxIcon from '@mui/icons-material/AllInbox';
import ArrowBack from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ListAltIcon from '@mui/icons-material/ListAlt';
import MoreIcon from '@mui/icons-material/MoreVert';
import React, { useMemo, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import AlertDialog from '../todo/AlertDialog';
import TodoList from '../todo/TodoList';
import TagEditForm from '../todo/TagEditForm';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import Chip from '@mui/material/Chip';
import { ItemContext } from '../../hooks/ItemProvider';

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
  sectionMobile: {
    marginLeft: 'auto',
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

function TodoView({ setOpen, title, setTitle }) {
  const classes = useStyles();
  const { todos, selectedList, tags, updateList, deleteCompletedTodos, deleteList, removeTag } = useContext(ItemContext);

  const [filter, setFilter] = useState('active');
  const isListEdit = filter === 'all';

  const [bottomDrawerOpen, setBottomDrawerOpen] = useState(false);

  const [alertOpen, setAlertOpen] = useState(false);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleDeleteListOk = () => {
    deleteList(selectedList.id);
    setOpen(false);
  };

  const handleFilter = (newValue) => {
    if (newValue !== null) {
      setFilter(newValue);
    }
    setMobileMoreAnchorEl(null);
  };

  const handleDeleteCompleted = () => {
    deleteCompletedTodos(selectedList.id);
    setMobileMoreAnchorEl(null);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    updateList(selectedList.id, title);
  };

  const filteredTodos = useMemo(() => {
    switch (filter) {
      case 'active':
        return todos.filter((todo) => todo.is_active);
      case 'inProgress':
        return todos.filter((todo) => todo.is_active && !todo.completed);
      case 'completed':
        return todos.filter((todo) => todo.is_active && todo.completed);
      case 'all':
      default:
        return todos;
    }
  }, [todos, filter]);

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
      {isListEdit ? (
        <MenuItem onClick={() => handleFilter('active')}>
          <IconButton aria-label="show active" color="inherit" size="large">
            <AllInboxIcon />
          </IconButton>
          <p>リストの編集を終了</p>
        </MenuItem>
      ) : (
        <MenuItem onClick={() => handleFilter('all')}>
          <IconButton aria-label="show all" color="inherit" size="large">
            <ListAltIcon />
          </IconButton>
          <p>リストを編集</p>
        </MenuItem>
      )}
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
            component={Link}
            to="/"
            onClick={handleDrawerClose}
            edge="start"
            className={classes.menuButton}
            size="large"
          >
            <ArrowBack />
          </IconButton>
          <form onSubmit={handleSubmit}>
            <InputBase
              className={classes.title}
              value={title}
              placeholder="リストのタイトル"
              inputProps={{ 'aria-label': 'edit title' }}
              onChange={(event) => setTitle(event.target.value)}
            />
          </form>
          <div className={classes.sectionMobile}>
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
          </div>
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
        <TodoList todos={filteredTodos} hideSwitch={filter !== 'all'} />
        <AlertDialog
          open={alertOpen}
          setOpen={setAlertOpen}
          title="リストの削除"
          msg="リスト内にあるチェック項目はすべて削除されます。よろしいですか。"
          handleOk={handleDeleteListOk}
        />
      </div>
    </>
  );
}

export default TodoView;
