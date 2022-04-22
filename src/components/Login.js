import LinearProgress from '@mui/material/LinearProgress';
import React, { useContext } from 'react';
import { Redirect } from 'react-router-dom';
import { AuthContext } from '../hooks/AuthProvider';
import SignIn from './SignIn';

function Login() {
  const { currentUser, isReady } = useContext(AuthContext);

  if (!isReady) {
    // loading
    return <LinearProgress />;
  }

  if (currentUser) {
    return <Redirect to="/home" />;
  }

  return <SignIn />;
}

export default Login;
