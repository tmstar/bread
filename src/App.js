import { ApolloClient, ApolloLink, from, HttpLink, InMemoryCache } from '@apollo/client';
import { blue, grey } from '@mui/material/colors';
import CssBaseline from '@mui/material/CssBaseline';
import {
  ThemeProvider,
  StyledEngineProvider,
  unstable_createMuiStrictModeTheme as createMuiTheme,
  adaptV4Theme,
} from '@mui/material/styles';
import React from 'react';
import { ApolloProvider } from 'react-apollo';
import { BrowserRouter, Switch } from 'react-router-dom';
import './App.css';
import AuthRoute from './components/AuthRoute';
import Home from './components/Home';
import { ItemProvider } from './hooks/ItemProvider';

const darkTheme = createMuiTheme(
  adaptV4Theme({
    palette: {
      mode: 'dark',
      primary: {
        light: '#eeffff',
        main: blue['100'],
        dark: '#8aacc8',
      },
      secondary: {
        light: '#ffffff',
        main: grey['300'],
        dark: '#aeaeae',
      },
    },
    props: {
      MuiRadio: {
        color: 'primary',
      },
      MuiSwitch: {
        color: 'primary',
      },
      MuiFab: {
        color: 'primary',
      },
      MuiList: {
        dense: true,
      },
    },
    typography: {
      fontFamily: `"Prompt","Yu Gothic Medium","游ゴシック Medium",YuGothic,"游ゴシック体","Roboto","Helvetica","Arial",sans-serif`,
    },
  })
);

const httpLink = new HttpLink({ uri: process.env.REACT_APP_HASURA_SERVER_URL });

const authMiddleware = new ApolloLink((operation, forward) => {
  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      // "x-hasura-admin-secret": process.env.REACT_APP_HASURA_ADMIN_SECRET,
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
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <ApolloProvider client={client}>
          <div className="App">
            <header>
              <ItemProvider>
                <BrowserRouter>
                  <Switch>
                    <AuthRoute exact path="/" component={Home} />
                  </Switch>
                </BrowserRouter>
              </ItemProvider>
            </header>
          </div>
        </ApolloProvider>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

export default App;
