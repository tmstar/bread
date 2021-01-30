import AppBar from "@material-ui/core/AppBar";
import IconButton from "@material-ui/core/IconButton";
import InputBase from "@material-ui/core/InputBase";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { makeStyles } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import AllInboxIcon from "@material-ui/icons/AllInbox";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import DeleteIcon from "@material-ui/icons/Delete";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import ListAltIcon from "@material-ui/icons/ListAlt";
import MoreIcon from "@material-ui/icons/MoreVert";
import React, { useMemo, useState } from "react";
import AlertDialog from "./AlertDialog";
import TodoForm from "./TodoForm";
import TodoList from "./TodoList";
import TagEditForm from "./TagEditForm";
import LocalOfferIcon from "@material-ui/icons/LocalOffer";
import Chip from "@material-ui/core/Chip";

const useStyles = makeStyles((theme) => ({
  appBar: {
    color: theme.palette.text.primary,
    backgroundColor: theme.palette.background.default,
    boxShadow: "none",
    borderBottom: "1px solid",
    borderBottomColor: theme.palette.divider,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  sectionMobile: {
    marginLeft: "auto",
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: "flex-start",
  },
  title: {
    flexGrow: 1,
  },
  tagList: {
    margin: theme.spacing(0, 2),
  },
}));

function TodoView({ td, setOpen, title, setTitle }) {
  const classes = useStyles();
  const {
    todos,
    selectedList,
    toggleTodo,
    hideTodo,
    updateTodo,
    updateList,
    deleteTodo,
    deleteCompletedTodos,
    deleteList,
    removeTag,
    addTodo,
  } = td;

  const [filter, setFilter] = useState("active");
  const isListEdit = filter === "all";

  const [BottomDrawerOpen, setBottomDrawerOpen] = useState(false);

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
      case "active":
        return todos.filter((todo) => todo.is_active);
      case "inProgress":
        return todos.filter((todo) => todo.is_active && !todo.completed);
      case "completed":
        return todos.filter((todo) => todo.is_active && todo.completed);
      case "all":
      default:
        return todos;
    }
  }, [todos, filter]);

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMobileMenuOpen}
      onClose={() => setMobileMoreAnchorEl(null)}
    >
      {isListEdit ? (
        <MenuItem onClick={() => handleFilter("active")}>
          <IconButton aria-label="show active" color="inherit">
            <AllInboxIcon />
          </IconButton>
          <p>リストの編集を終了</p>
        </MenuItem>
      ) : (
        <MenuItem onClick={() => handleFilter("all")}>
          <IconButton aria-label="show all" color="inherit">
            <ListAltIcon />
          </IconButton>
          <p>リストを編集</p>
        </MenuItem>
      )}
      <MenuItem onClick={() => handleDeleteCompleted()}>
        <IconButton aria-label="delete completed" color="inherit">
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
        <IconButton aria-label="delete this list" color="inherit">
          <DeleteForeverIcon />
        </IconButton>
        <p>リストを削除</p>
      </MenuItem>
    </Menu>
  );

  const handleChipDelete = (id) => {
    removeTag(id);
  };

  const tagList = selectedList.item_list_tags.map((listTag) => {
    const tag = listTag.tag;
    return <Chip key={tag.id} variant="outlined" size="small" label={tag.name} onDelete={() => handleChipDelete(tag.id)} />;
  });

  return (
    <>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <IconButton color="inherit" aria-label="open drawer" onClick={handleDrawerClose} edge="start" className={classes.menuButton}>
            <ChevronRightIcon />
          </IconButton>
          <form onSubmit={handleSubmit}>
            <InputBase
              className={classes.title}
              value={title}
              placeholder="リストのタイトル"
              inputProps={{ "aria-label": "edit title" }}
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
          >
            <LocalOfferIcon fontSize="small" />
          </IconButton>
          {tagList}
        </div>
        <TagEditForm td={td} listId={selectedList.id} open={BottomDrawerOpen} setOpen={setBottomDrawerOpen} />
        <TodoForm addTodo={addTodo} />
        <TodoList
          todos={filteredTodos}
          toggleTodo={toggleTodo}
          hideTodo={hideTodo}
          updateTodo={updateTodo}
          deleteTodo={deleteTodo}
          hideSwitch={filter !== "all"}
        />
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
