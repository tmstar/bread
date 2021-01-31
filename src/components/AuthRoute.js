import React, { useContext } from "react";
import { Route } from "react-router-dom";
import { AuthContext } from "../hooks/AuthProvider";
import Login from "./Login";

const AuthRoute = ({ component: RouteComponent, ...options }) => {
  const { currentUser } = useContext(AuthContext);

  const Component = currentUser ? RouteComponent : Login;
  return <Route {...options} component={Component} />;
};

export default AuthRoute;
