import axios from "axios";
import { print } from "graphql";
import gql from "graphql-tag";

const gqlUrl = process.env.REACT_APP_HASURA_SERVER_URL;

const headers = {
  "content-type": "application/json",
  "x-hasura-admin-secret": process.env.REACT_APP_HASURA_ADMIN_SECRET,
};

const ALL_LISTS = gql`
  query AllLists {
    item_list {
      id
      updated_at
      name
    }
  }
`;

const CREATE_LIST = gql`
  mutation CreateList($id: uuid!, $name: String!) {
    insert_item_list_one(object: { id: $id, name: $name }) {
      id
      updated_at
      name
    }
  }
`;

const getAll = async () => {
  const response = await axios.post(`${gqlUrl}`, { query: print(ALL_LISTS) }, { headers: headers });
  console.log(response);
  return response.data.data.item_list;
};

const add = async (newList) => {
  const response = await axios.post(
    `${gqlUrl}`,
    {
      query: print(CREATE_LIST),
      variables: {
        id: newList.id,
        name: newList.name,
      },
    },
    { headers: headers }
  );
  return response.data.data.insert_item_list_one;
};

const api = { getAll, add };
export default api;
