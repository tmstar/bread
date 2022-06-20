import { useAuth0 } from '@auth0/auth0-react';

function Logout() {
  const { logout } = useAuth0();

  // redirect to location.origin
  logout({ returnTo: window.location.origin + '/login' });

  return null;
}

export default Logout;
