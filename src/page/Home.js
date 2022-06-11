import makeStyles from '@mui/styles/makeStyles';
import React from 'react';
import MenuDrawer from '../components/Home/menu/MenuDrawer';
import HomeMain from '../components/Home/HomeMain';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    textAlign: 'center',
  },
}));

function Home() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <HomeMain />
      <MenuDrawer />
    </div>
  );
}

export default Home;
