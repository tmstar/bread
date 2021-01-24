import { gql } from "@apollo/client";
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
import InboxIcon from "@material-ui/icons/Inbox";
import ListAltIcon from "@material-ui/icons/ListAlt";
import MoreIcon from "@material-ui/icons/MoreVert";
import React, { useMemo, useState } from "react";
import { graphql } from "react-apollo";
import AlertDialog from "./AlertDialog";
import TodoForm from "./TodoForm";
import TodoList from "./TodoList";

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
    // display: "flex",
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
}));

const UPDATE_LIST = gql`
  mutation UpdateList($id: uuid!, $name: String!) {
    update_item_list_by_pk(pk_columns: { id: $id }, _set: { name: $name }) {
      id
      updated_at
      name
    }
  }
`;

function TodoView({ td, setOpen, mutate }) {
  const classes = useStyles();
  const {
    lists,
    setLists,
    selectedListIndex,
    todos,
    toggleTodo,
    hideTodo,
    updateTodo,
    deleteTodo,
    deleteList,
    addTodo,
  } = td;

  const [filter, setFilter] = useState("active");
  const [alertOpen, setAlertOpen] = useState(false);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const [title, setTitle] = useState("");

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleDeleteListOk = () => {
    deleteList(lists[selectedListIndex].id);
    setOpen(false);
  };

  const handleFilter = (newValue) => {
    if (newValue !== null) {
      setFilter(newValue);
    }
    setMobileMoreAnchorEl(null);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("handleSubmit");
    mutate({
      variables: { id: lists[selectedListIndex].id, name: title },
    }).then((result) => {
      const updated = result.data.update_item_list_by_pk;
      const updatedLists = lists.map((list) => (list.id !== updated.id ? list : updated));
      setLists(updatedLists);
    });
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
      <MenuItem onClick={() => handleFilter("all")}>
        <IconButton aria-label="show all" color="inherit">
          <ListAltIcon />
        </IconButton>
        <p>リストの編集</p>
      </MenuItem>
      <MenuItem
        onClick={() => {
          setAlertOpen(true);
          setMobileMoreAnchorEl(null);
        }}
      >
        <IconButton aria-label="delete this list" color="inherit">
          <DeleteIcon />
        </IconButton>
        <p>リストの削除</p>
      </MenuItem>
      <MenuItem onClick={() => handleFilter("active")}>
        <IconButton aria-label="show active" color="inherit">
          <AllInboxIcon />
        </IconButton>
        <p>完了済みを表示</p>
      </MenuItem>
      <MenuItem onClick={() => handleFilter("inProgress")}>
        <IconButton aria-label="show inProgress" color="inherit">
          <InboxIcon />
        </IconButton>
        <p>完了済みを非表示</p>
      </MenuItem>
    </Menu>
  );

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
          >
            <ChevronRightIcon />
          </IconButton>
          <form onSubmit={handleSubmit}>
            <InputBase
              className={classes.title}
              defaultValue={lists[selectedListIndex] ? lists[selectedListIndex].name : ""}
              placeholder="リストのタイトル"
              inputProps={{ "aria-label": "naked" }}
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

export default graphql(UPDATE_LIST)(TodoView);
