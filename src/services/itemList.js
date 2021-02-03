import axios from "axios";
import { print } from "graphql";
import gql from "graphql-tag";
import Hasura from "./hasura";

const ALL_LISTS = gql`
  query AllLists($user_id: String!, $user_email: String!) {
    item_list(
      order_by: { updated_at: desc }
      where: { _or: [{ user_id: { _eq: $user_id } }, { item_list_tags: { tag: { name: { _eq: $user_email } } } }] }
    ) {
      id
      updated_at
      name
      item_list_tags(where: { tag: { user_id: { _eq: $user_id } } }) {
        tag {
          id
          name
        }
      }
    }
  }
`;

const CREATE_LIST = gql`
  mutation CreateList($id: uuid!, $user_id: String!, $name: String!) {
    insert_item_list_one(object: { id: $id, user_id: $user_id, name: $name }) {
      id
      user_id
      updated_at
      name
      item_list_tags {
        tag {
          id
          name
        }
      }
    }
  }
`;

const UPDATE_LIST = gql`
  mutation UpdateList($id: uuid!, $name: String!) {
    update_item_list_by_pk(pk_columns: { id: $id }, _set: { name: $name }) {
      id
      updated_at
      name
      item_list_tags {
        tag {
          id
          name
        }
      }
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
  const response = await axios.post(
    `${Hasura.url}`,
    {
      query: print(ALL_LISTS),
      variables: {
        user_id: Hasura.currentUid,
        user_email: Hasura.currentEmail,
      },
    },
    { headers: Hasura.headers }
  );
  return response.data.data.item_list;
};

const add = async (newList) => {
  const response = await axios.post(
    `${Hasura.url}`,
    {
      query: print(CREATE_LIST),
      variables: {
        id: newList.id,
        user_id: Hasura.currentUid,
        name: newList.name,
      },
    },
    { headers: Hasura.headers }
  );
  return response.data.data.insert_item_list_one;
};

const update = async (id, newList) => {
  const response = await axios.post(
    `${Hasura.url}`,
    {
      query: print(UPDATE_LIST),
      variables: {
        id: id,
        name: newList.name,
      },
    },
    { headers: Hasura.headers }
  );
  return response.data.data.update_item_list_by_pk;
};

const _delete = async (id) => {
  await axios.post(
    `${Hasura.url}`,
    {
      query: print(DELETE_LIST),
      variables: { id: id },
    },
    { headers: Hasura.headers }
  );
  return id;
};

const api = { getAll, add, update, delete: _delete };
export default api;
