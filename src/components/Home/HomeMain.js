import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import makeStyles from '@mui/styles/makeStyles';
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import MenuIcon from "@mui/icons-material/Menu";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import clsx from "clsx";
import moment from "moment";
import "moment/locale/ja";
import React, { useContext, useState } from "react";
import { HomeContext } from "../../context/HomeProvider";
import { ItemContext } from "../../hooks/ItemProvider";
import TodoView from "../todo/TodoView";

const drawerWidth = "100%";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  appBar: {
    color: theme.palette.text.primary,
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
    width: 0, //`calc(100% - ${drawerWidth})`,
    marginRight: drawerWidth,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  sectionMobile: {
    // display: "flex",
    marginLeft: "auto",
  },
  hide: {
    display: "none",
  },
  drawer: {
    width: drawerWidth,
    // flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
    backgroundColor: theme.palette.background.default,
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: "flex-start",
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(0, 1),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    // marginRight: "-100%",
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginRight: 0,
  },
  title: {
    flexGrow: 1,
  },
  list: {
    flexGrow: 1,
    padding: theme.spacing(0, 1),
  },
  timeCaptionBox: {
    marginTop: -22,
  },
  timeCaption: {
    fontSize: "1em",
  },
}));

function HomeMain() {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const { lists, addList, selectList } = useContext(ItemContext);
  const { toggleMenu, mainTitle } = useContext(HomeContext);
  const [title, setTitle] = useState();

  const handleNewList = () => () => {
    const newName = moment().format("M/D");
    setTitle(newName);
    setOpen(true);
    addList(newName);
  };

  const listContents = lists.map((list, index) => {
    const rowLength = lists.length;
    const remainCount = list.items_aggregate?.aggregate.count;
    return (
      <div key={list.id + "-div"}>
        <ListItem
          key={list.id}
          button
          onClick={() => {
            setTitle(list.name);
            selectList(list);
            setOpen(true);
          }}
        >
          <ListItemText
            primary={list.name}
            primaryTypographyProps={{
              color: "primary",
              fontWeight: "medium",
              variant: "body1",
            }}
            secondary={remainCount ? `あと ${remainCount} 件` : "なし"}
          />
          <Box className={classes.timeCaptionBox}>
            <Typography variant="caption" color="textSecondary" className={classes.timeCaption}>
              {moment(list.updated_at).fromNow()}
            </Typography>
          </Box>
        </ListItem>
        {index + 1 !== rowLength ? <Divider /> : ""}
      </div>
    );
  });

  return <>
    <AppBar position="fixed" className={clsx(classes.appBar, { [classes.appBarShift]: open })}>
      <Toolbar>
        <IconButton
          color="inherit"
          edge="start"
          className={classes.menuButton}
          onClick={toggleMenu(true)}
          size="large">
          <MenuIcon />
        </IconButton>
        <Typography className={classes.title} variant="h6" noWrap>
          {mainTitle}
        </Typography>
        <div className={classes.drawerHeader}>
          <IconButton edge="end" onClick={handleNewList()} size="large">
            <PlaylistAddIcon />
          </IconButton>
        </div>
      </Toolbar>
    </AppBar>
    <main className={clsx(classes.content, { [classes.contentShift]: open })}>
      <div className={classes.list}>
        <Toolbar />
        <List>{listContents}</List>
      </div>
    </main>
    <Drawer className={classes.drawer} anchor="right" open={open} classes={{ paper: classes.drawerPaper }}>
      <TodoView setOpen={setOpen} title={title} setTitle={setTitle} />
    </Drawer>
  </>;
}

export default HomeMain;
