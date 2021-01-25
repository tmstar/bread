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
    item_list(order_by: { updated_at: desc }) {
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

const UPDATE_LIST = gql`
  mutation UpdateList($id: uuid!, $name: String!) {
    update_item_list_by_pk(pk_columns: { id: $id }, _set: { name: $name }) {
      id
      updated_at
      name
    }
  }
`;

const DELETE_LIST = gql`
  mutation DeleteList($id: uuid!) {
    delete_item(where: { item_list_id: { _eq: $id } }) {
      returning {
        id
      }
    }
    delete_item_list_by_pk(id: $id) {
      id
    }
  }
`;

const getAll = async () => {
  const response = await axios.post(`${gqlUrl}`, { query: print(ALL_LISTS) }, { headers: headers });
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

const update = async (id, newList) => {
  const response = await axios.post(
    `${gqlUrl}`,
    {
      query: print(UPDATE_LIST),
      variables: {
        id: id,
        name: newList.name,
      },
    },
    { headers: headers }
  );
  return response.data.data.update_item_list_by_pk;
};

const _delete = async (id) => {
  await axios.post(
    `${gqlUrl}`,
    {
      query: print(DELETE_LIST),
      variables: { id: id },
    },
    { headers: headers }
  );
  return id;
};

const api = { getAll, add, update, delete: _delete };
export default api;
