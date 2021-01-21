import CssBaseline from "@material-ui/core/CssBaseline";
import React from "react";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import "./App.css";
import AuthRoute from "./components/AuthRoute";
import Home from "./components/Home";
import Login from "./components/Login";
import Logout from "./components/Logout";
import { AuthProvider } from "./services/authProvider";

function App() {
  return (
    <div className="App">
      <CssBaseline />
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
  );
}

export default App;
