import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react';
import React from 'react';
import { Navigate } from 'react-router-dom';
import Loader from './Loader';

function ProtectedRoute({ component, ...options }) {
  const { isLoading, isAuthenticated } = useAuth0();

  if (isLoading) return <Loader />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  const Component = withAuthenticationRequired(component, {
    onRedirecting: () => <Loader />,
  });

  return <Component {...options} />;
}

export default ProtectedRoute;
