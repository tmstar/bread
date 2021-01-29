import axios from "axios";
import { print } from "graphql";
import gql from "graphql-tag";

const gqlUrl = process.env.REACT_APP_HASURA_SERVER_URL;

const headers = {
  "content-type": "application/json",
  "x-hasura-admin-secret": process.env.REACT_APP_HASURA_ADMIN_SECRET,
};

const CREATE_USER = gql`
  mutation CreateUser($id: String!, $name: String!) {
    insert_users_one(object: { id: $id, name: $name }, on_conflict: { constraint: users_pkey, update_columns: [name] }) {
      id
      name
    }
  }
`;

const add = async (newUser) => {
  const response = await axios.post(
    `${gqlUrl}`,
    {
      query: print(CREATE_USER),
      variables: {
        id: newUser.id,
        name: newUser.name,
      },
    },
    { headers: headers }
  );
  return response.data.data.insert_users_one;
};

const api = { add };
export default api;
