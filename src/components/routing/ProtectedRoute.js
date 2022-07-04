import { withAuthenticationRequired } from '@auth0/auth0-react';
import React from 'react';
import { useCreateDemoItems } from '../../hooks/DemoDataHooks';
import Loader from './Loader';

function ProtectedRoute({ component, ...options }) {
  const { loadingDemo } = useCreateDemoItems();
  if (loadingDemo) return <Loader />;

  const Component = withAuthenticationRequired(component, {
    onRedirecting: () => <Loader />,
  });

  return <Component {...options} />;
}

export default ProtectedRoute;
