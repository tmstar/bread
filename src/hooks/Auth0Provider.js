import { Auth0Provider as Provider } from '@auth0/auth0-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

function Auth0Provider({ children }) {
  const navigate = useNavigate();

  const domain = process.env.REACT_APP_AUTH0_DOMAIN;
  const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID;

  const onRedirectCallback = (appState) => {
    navigate(appState?.returnTo || window.location.pathname);
  };

  if (!(domain && clientId)) {
    return null;
  }

  return (
    <Provider domain={domain} clientId={clientId} redirectUri={window.location.origin} onRedirectCallback={onRedirectCallback}>
      {children}
    </Provider>
  );
}

export default Auth0Provider;