import MenuIcon from '@mui/icons-material/Menu';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';
import moment from 'moment';
import 'moment/locale/ja';
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { listsInTagState, listTitleState, mainTitleState, openListState, openMenuState, selectedListState } from '../../atoms';
import { ItemContext } from '../../hooks/ItemProvider';

const drawerWidth = '100%';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    color: theme.palette.text.primary,
    backgroundImage: 'none',
    boxShadow: 'none',
    borderBottom: '1px solid',
    borderBottomColor: theme.palette.divider,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: 0, //`calc(100% - ${drawerWidth})`,
    marginRight: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  sectionMobile: {
    // display: "flex",
    marginLeft: 'auto',
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    // flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
    backgroundImage: 'none',
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-start',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(0, 1),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    // marginRight: "-100%",
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
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
    fontSize: '0.88em',
  },
}));

function HomeMain() {
  const classes = useStyles();
  const selectList = useSetRecoilState(selectedListState);
  const toggleMenu = useSetRecoilState(openMenuState);
  const mainTitle = useRecoilValue(mainTitleState);
  const lists = useRecoilValue(listsInTagState);
  const toggleList = useSetRecoilState(openListState);
  const setListTitle = useSetRecoilState(listTitleState);
  const { addList } = useContext(ItemContext);

  const handleNewList = () => () => {
    const newName = moment().format('M/D');
    setListTitle(newName);
    toggleList(true);
    addList(newName);
  };

  const listContents = lists.map((list, index) => {
    const rowLength = lists.length;
    const remainCount = list.items_aggregate?.aggregate.count;
    return (
      <div key={list.id + '-div'}>
        <ListItem
          key={list.id}
          button
          component={Link}
          to={'item-list'}
          onClick={() => {
            setListTitle(list.name);
            selectList(list);
            toggleList(true);
          }}
        >
          <ListItemText
            primary={list.name}
            primaryTypographyProps={{
              color: 'primary',
              fontWeight: 'medium',
              variant: 'body1',
            }}
            secondary={remainCount ? `あと ${remainCount} 件` : 'なし'}
          />
          <Box className={classes.timeCaptionBox}>
            <Typography variant="caption" color="textSecondary" className={classes.timeCaption}>
              {moment(list.updated_at).fromNow()}
            </Typography>
          </Box>
        </ListItem>
        {index + 1 !== rowLength ? <Divider /> : ''}
      </div>
    );
  });

  return (
    <>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <IconButton color="inherit" edge="start" className={classes.menuButton} onClick={() => toggleMenu(true)} size="large">
            <MenuIcon />
          </IconButton>
          <Typography className={classes.title} variant="h6" noWrap>
            {mainTitle}
          </Typography>
          <div className={classes.drawerHeader}>
            <IconButton edge="end" onClick={handleNewList()} size="large" component={Link} to="/item-list">
              <PlaylistAddIcon />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      <main className={classes.content}>
        <div className={classes.list}>
          <Toolbar />
          <List>{listContents}</List>
        </div>
      </main>
    </>
  );
}

export default HomeMain;
