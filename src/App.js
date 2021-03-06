import { grey } from '@mui/material/colors';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, StyledEngineProvider, ThemeProvider } from '@mui/material/styles';
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import ItemList from './components/ItemList';
import ProtectedRoute from './components/routing/ProtectedRoute';
import ApolloProviderWithAuth0 from './hooks/ApolloProviderWithAuth0';
import { ItemProvider } from './hooks/ItemProvider';
import Home from './page/Home';
import Login from './page/Login';
import Logout from './page/Logout';
import Settings from './page/Settings';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      light: '#eeffff',
      main: '#e1f4ff',
      dark: '#8aacc8',
    },
    secondary: {
      light: '#ffffff',
      main: grey['300'],
      dark: '#aeaeae',
    },
    error: {
      light: '#ff8085',
      main: '#e7534c',
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
  shape: {
    borderRadius: 8,
  },
});

function App() {
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <header>
          <RecoilRoot>
            <ItemProvider>
              <ApolloProviderWithAuth0>
                <Routes>
                  <Route index element={<ProtectedRoute component={Home} />} />
                  <Route path="item-list" element={<ProtectedRoute component={ItemList} />} />
                  <Route path="settings" element={<ProtectedRoute component={Settings} />} />
                  <Route path="login" element={<Login />} />
                  <Route path="logout" element={<Logout />} />
                </Routes>
              </ApolloProviderWithAuth0>
            </ItemProvider>
          </RecoilRoot>
        </header>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

export default App;
