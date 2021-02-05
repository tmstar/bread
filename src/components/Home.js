import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import MenuDrawer from "./Home/MenuDrawer";
import HomeMain from "./HomeMain";
import { HomeProvider } from "../context/HomeProvider";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
}));

function Home() {
  const classes = useStyles();

  return (
    <HomeProvider>
      <div className={classes.root}>
        <HomeMain />
        <MenuDrawer />
      </div>
    </HomeProvider>
  );
}

export default Home;
