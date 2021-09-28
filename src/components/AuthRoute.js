import { withAuthenticationRequired } from "@auth0/auth0-react";
import React from "react";
import { Route } from "react-router-dom";

const AuthRoute = ({ component, ...options }) => {
  return <Route {...options} component={withAuthenticationRequired(component, {})} />;
};

export default AuthRoute;
