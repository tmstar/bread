import AppBar from "@material-ui/core/AppBar";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { makeStyles } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import AddIcon from "@material-ui/icons/Add";
import AllInboxIcon from "@material-ui/icons/AllInbox";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import InboxIcon from "@material-ui/icons/Inbox";
import MoreIcon from "@material-ui/icons/MoreVert";
import PlaylistAddIcon from "@material-ui/icons/PlaylistAdd";
import clsx from "clsx";
import React, { useMemo, useState } from "react";
import useTodo from "../hooks/useTodo";
import TodoForm from "./TodoForm";
import TodoList from "./TodoList";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  appBar: {
    backgroundColor: theme.palette.background.default,
    boxShadow: "none",
    borderBottom: "1px solid",
    borderBottomColor: theme.palette.divider,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  sectionMobile: {
    display: "flex",
    marginLeft: "auto",
  },
  hide: {
    display: "none",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: "flex-end",
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
  paper: {
    margin: theme.spacing(4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
}));

function Home() {
  const classes = useStyles();

  const [open, setOpen] = useState(true);
  const [filter, setFilter] = useState("active");
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const {
    todos,
    lists,
    selectedListIndex,
    setSelectedListIndex,
    toggleTodo,
    hideTodo,
    updateTodo,
    deleteTodo,
    addTodo,
    addList,
  } = useTodo();

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

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleFilter = (newValue) => {
    if (newValue !== null) {
      setFilter(newValue);
    }
  };

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
          <AddIcon />
        </IconButton>
        <p>リストの並び替え</p>
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
    <div className={classes.root}>
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={open ? handleDrawerClose : handleDrawerOpen}
            edge="start"
            className={classes.menuButton}
          >
            {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
          <Typography className={classes.title} variant="h6" noWrap>
            {lists[selectedListIndex] ? lists[selectedListIndex].name : ""}
          </Typography>
          <div className={classes.sectionMobile}>
            <IconButton
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={open}
        classes={{ paper: classes.drawerPaper }}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={() => addList("新規リスト")}>
            <PlaylistAddIcon />
          </IconButton>
        </div>
        <Divider />
        <List>
          {lists.map((list, index) => (
            <ListItem
              button
              key={list.id}
              selected={index === selectedListIndex}
              onClick={() => setSelectedListIndex(index)}
            >
              <ListItemText primary={list.name} secondary={new Date(list.updated_at).toLocaleString("ja-JP")} />
            </ListItem>
          ))}
        </List>
      </Drawer>
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: open,
        })}
      >
        <div className={classes.drawerHeader} />
        <div className={classes.paper}>
          <TodoForm addTodo={addTodo} />
          <TodoList
            todos={filteredTodos}
            toggleTodo={toggleTodo}
            hideTodo={hideTodo}
            updateTodo={updateTodo}
            deleteTodo={deleteTodo}
            hideSwitch={filter !== "all"}
          />
        </div>
      </main>
    </div>
  );
}

export default Home;
