import React, { useState } from "react";
import { GoogleLogin } from "react-google-login";
import AuthService from "../services/auth";
import Typography from "@material-ui/core/Typography";
import { Redirect } from "react-router-dom";

const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

function Login() {
  const [showLogin, toggleShow] = useState(true);
  const onSuccess = (res) => {
    AuthService.login();
    toggleShow(false);
  };
  const onFailure = (res) => {
    AuthService.logout();
  };

  return showLogin ? (
    <>
      <Typography variant="h6" className="content-header">
        You need to login before viewing this page.
      </Typography>
      <form>
        <div className="justify-center">
          <GoogleLogin
            clientId={clientId}
            buttonText="Login"
            onSuccess={onSuccess}
            onFailure={onFailure}
            cookiePolicy={"single_host_origin"}
            style={{ marginTop: "100px" }}
          />
        </div>
      </form>
    </>
  ) : (
    <Redirect to="/home" />
  );
}

export default Login;
