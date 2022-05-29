let uid;
let email;
let token;

const url = process.env.REACT_APP_HASURA_SERVER_URL;

const initialize = (user, accessToken) => {
  uid = user.sub;
  email = user.email;
  token = accessToken;
};

const getHeadersWithToken = (token) => {
  return {
    'content-type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
};

const gql = {
  url,
  get currentUid() {
    return uid;
  },
  get currentEmail() {
    return email;
  },
  initialize,
  getHeadersWithToken,
};
export default gql;
