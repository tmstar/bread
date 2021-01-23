import CssBaseline from "@material-ui/core/CssBaseline";
import React from "react";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import "./App.css";
import AuthRoute from "./components/AuthRoute";
import Home from "./components/Home";
import Login from "./components/Login";
import Logout from "./components/Logout";
import { AuthProvider } from "./services/authProvider";
import { MuiThemeProvider, unstable_createMuiStrictModeTheme as createMuiTheme } from "@material-ui/core/styles";
import { blue, grey } from "@material-ui/core/colors";

const darkTheme = createMuiTheme({
  palette: {
    type: "dark",
    primary: {
      light: "#eeffff",
      main: blue["100"],
      dark: "#8aacc8",
    },
    secondary: {
      light: "#ffffff",
      main: grey["300"],
      dark: "#aeaeae",
    },
  },
  props: {
    MuiCheckbox: {
      color: "primary",
    },
    MuiRadio: {
      color: "primary",
    },
    MuiSwitch: {
      color: "primary",
    },
    MuiList: {
      dense: true,
    },
  },
  typography: {
    fontFamily: `"Prompt","Yu Gothic Medium","游ゴシック Medium",YuGothic,"游ゴシック体","Roboto","Helvetica","Arial",sans-serif`,
  },
});

function App() {
  return (
    <MuiThemeProvider theme={darkTheme}>
      <CssBaseline />
      <div className="App">
        <header>
          <AuthProvider>
            <BrowserRouter>
              <Switch>
                <Redirect exact path="/" to="/login" />
                <Route path="/login" component={Login} />
                <Route path="/logout" component={Logout} />
                <AuthRoute exact path="/home" component={Home} />
              </Switch>
            </BrowserRouter>
          </AuthProvider>
        </header>
      </div>
    </MuiThemeProvider>
  );
}

export default App;
