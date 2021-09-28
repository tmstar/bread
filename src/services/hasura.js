let uid;
let email;
let token;

const url = process.env.REACT_APP_HASURA_SERVER_URL;
const customTokenUrl = process.env.REACT_APP_HASURA_TOKEN_KEY;

const initialize = (user, idToken) => {
  uid = user[customTokenUrl]["x-hasura-user-id"];
  email = user.email;
  token = idToken;
};

const getHeaders = () => {
  return {
    "content-type": "application/json",
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
  getHeaders,
};
export default gql;
