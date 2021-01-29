import CircularProgress from "@material-ui/core/CircularProgress";
import React, { useContext } from "react";
import { Redirect } from "react-router-dom";
import { AuthContext } from "../services/authProvider";
import SignIn from "./SignIn";

function Login() {
  const { currentUser, isReady } = useContext(AuthContext);

  if (!isReady) {
    // loading
    return <CircularProgress />;
  }

  if (currentUser) {
    return <Redirect to="/home" />;
  }

  return <SignIn />;
}

export default Login;
