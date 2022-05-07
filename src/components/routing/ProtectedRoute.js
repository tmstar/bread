import { withAuthenticationRequired } from '@auth0/auth0-react';
import React from 'react';
import Loader from './Loader';

function ProtectedRoute({ component, ...options }) {
  const Component = withAuthenticationRequired(component, {
    onRedirecting: () => <Loader />,
  });

  return <Component {...options} />;
}

export default ProtectedRoute;
