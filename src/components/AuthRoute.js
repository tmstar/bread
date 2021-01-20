import React from "react";
import { Redirect, Route } from "react-router";
import AuthService from "../services/auth";

const AuthRoute = (props) => {
  const { type } = props;
  const isAuthUser = AuthService.isAuthenticated();

  if (type === "guest" && isAuthUser) return <Redirect to="/home" />;
  else if (type === "private" && !isAuthUser) return <Redirect to="/" />;

  return <Route {...props} />;
};

export default AuthRoute;
