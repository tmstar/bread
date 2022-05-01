import { ApolloClient, ApolloLink, from, HttpLink, InMemoryCache } from '@apollo/client';
import { blue, grey } from '@mui/material/colors';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, StyledEngineProvider, ThemeProvider } from '@mui/material/styles';
import React from 'react';
import { ApolloProvider } from 'react-apollo';
import { Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import ItemList from './components/ItemList';
import Logout from './components/Logout';
import { HomeProvider } from './context/HomeProvider';
import { ItemProvider } from './hooks/ItemProvider';
import ProtectedRoute from './components/ProtectedRoute';

const darkTheme = createTheme({
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
    background: {
      paper: '#303030',
      default: '#303030',
    },
  },
  components: {
    MuiRadio: {
      defaultProps: {
        color: 'primary',
      },
    },
    MuiSwitch: {
      defaultProps: {
        color: 'primary',
      },
    },
    MuiFab: {
      defaultProps: {
        color: 'primary',
      },
    },
    MuiList: {
      defaultProps: {
        dense: true,
      },
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
          <header>
            <ItemProvider>
              <HomeProvider>
                <Routes>
                  <Route index element={<ProtectedRoute component={Home} />} />
                  <Route path="item-list" element={<ProtectedRoute component={ItemList} />} />
                  <Route path="logout" element={<Logout />} />
                </Routes>
              </HomeProvider>
            </ItemProvider>
          </header>
        </ApolloProvider>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

export default App;
