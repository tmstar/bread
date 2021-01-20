import CircularProgress from "@material-ui/core/CircularProgress";
import React, { useContext } from "react";
import { Redirect } from "react-router-dom";
import AuthService from "../services/auth";
import { AuthContext } from "../services/authProvider";
import SignIn from "./SignIn";

function Login({ history }) {
  const { currentUser, isReady } = useContext(AuthContext);
  const onSuccess = () => {
    AuthService.login();
  };

  if (!isReady) {
    // loading
    return <CircularProgress />;
  }

  if (currentUser) {
    return <Redirect to="/home" />;
  }

  return <SignIn onSuccess={onSuccess} history={history} />;
}

export default Login;
