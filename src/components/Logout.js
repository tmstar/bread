import React, { useContext } from "react";
import { AuthContext } from "../services/authProvider";
import { Redirect } from "react-router-dom";

function Logout() {
  const { signOut } = useContext(AuthContext);
  signOut();

  return <Redirect to="/login" />;
}

export default Logout;
