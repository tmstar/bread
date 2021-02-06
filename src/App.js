import { ApolloClient, ApolloLink, from, HttpLink, InMemoryCache } from "@apollo/client";
import { blue, grey } from "@material-ui/core/colors";
import CssBaseline from "@material-ui/core/CssBaseline";
import { MuiThemeProvider, unstable_createMuiStrictModeTheme as createMuiTheme } from "@material-ui/core/styles";
import React from "react";
import { ApolloProvider } from "react-apollo";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import "./App.css";
import AuthRoute from "./components/AuthRoute";
import Home from "./components/Home";
import Login from "./components/Login";
import Logout from "./components/Logout";
import { AuthProvider } from "./hooks/AuthProvider";
import { ItemProvider } from "./hooks/ItemProvider";

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
    MuiRadio: {
      color: "primary",
    },
    MuiSwitch: {
      color: "primary",
    },
    MuiFab: {
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

const httpLink = new HttpLink({ uri: process.env.REACT_APP_HASURA_SERVER_URL });

const authMiddleware = new ApolloLink((operation, forward) => {
  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      "x-hasura-admin-secret": process.env.REACT_APP_HASURA_ADMIN_SECRET,
    },
  }));

  return forward(operation);
});

function App() {
  const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: from([authMiddleware, httpLink]),
  });

  return (
    <MuiThemeProvider theme={darkTheme}>
      <CssBaseline />
      <ApolloProvider client={client}>
        <div className="App">
          <header>
            <AuthProvider>
              <ItemProvider>
                <BrowserRouter>
                  <Switch>
                    <Redirect exact path="/" to="/login" />
                    <Route path="/login" component={Login} />
                    <Route path="/logout" component={Logout} />
                    <AuthRoute exact path="/home" component={Home} />
                  </Switch>
                </BrowserRouter>
              </ItemProvider>
            </AuthProvider>
          </header>
        </div>
      </ApolloProvider>
    </MuiThemeProvider>
  );
}

export default App;
