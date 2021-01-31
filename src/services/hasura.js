let uid;
let email;

const url = process.env.REACT_APP_HASURA_SERVER_URL;

const headers = {
  "content-type": "application/json",
  "x-hasura-admin-secret": process.env.REACT_APP_HASURA_ADMIN_SECRET,
};

const initialize = (user) => {
  uid = user.uid;
  email = user.email;
};

const gql = {
  url,
  headers,
  get currentUid() {
    return uid;
  },
  get currentEmail() {
    return email;
  },
  initialize,
};
export default gql;
