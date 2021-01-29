let uid;

const url = process.env.REACT_APP_HASURA_SERVER_URL;

const headers = {
  "content-type": "application/json",
  "x-hasura-admin-secret": process.env.REACT_APP_HASURA_ADMIN_SECRET,
};

const initialize = (userId) => {
  uid = userId;
};

const currentUid = () => {
  return uid;
};

const gql = {
  url,
  headers,
  initialize,
  currentUid,
};
export default gql;
