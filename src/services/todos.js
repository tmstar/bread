import axios from "axios";
import { print } from "graphql";
import gql from "graphql-tag";
import Hasura from "./hasura";

const ALL_TODOS = gql`
  query AllTodos($item_list_id: uuid!) {
    item(where: { item_list_id: { _eq: $item_list_id } }) {
      id
      title
      note
      completed
      is_active
    }
  }
`;

const CREATE_TODO = gql`
  mutation CreateTodo($id: uuid!, $title: String!, $completed: Boolean!, $is_active: Boolean!, $item_list_id: uuid!) {
    insert_item_one(object: { id: $id, title: $title, completed: $completed, is_active: $is_active, item_list_id: $item_list_id }) {
      id
      title
      note
      completed
      is_active
      item_list_id
    }
  }
`;

const UPDATE_TODO = gql`
  mutation UpdateTodo($id: uuid!, $note: String, $title: String!, $completed: Boolean!, $is_active: Boolean!) {
    update_item_by_pk(pk_columns: { id: $id }, _set: { note: $note, title: $title, completed: $completed, is_active: $is_active }) {
      id
      title
      note
      completed
      is_active
    }
  }
`;

const DELETE_TODO = gql`
  mutation DeleteTodo($id: uuid!) {
    delete_item_by_pk(id: $id) {
      id
    }
  }
`;

const DELETE_COMPLETED_TODOS = gql`
  mutation DeleteCompletedTodos($item_list_id: uuid!) {
    delete_item(where: { item_list_id: { _eq: $item_list_id }, completed: { _eq: true } }) {
      returning {
        id
      }
    }
  }
`;

const getAll = async (listId) => {
  const response = await axios.post(
    `${Hasura.url}`,
    {
      query: print(ALL_TODOS),
      variables: {
        item_list_id: listId,
      },
    },
    { headers: Hasura.headers }
  );
  return response.data.data.item;
};

const update = async (id, newTodo) => {
  const response = await axios.post(
    `${Hasura.url}`,
    {
      query: print(UPDATE_TODO),
      variables: {
        id: id,
        title: newTodo.title,
        note: newTodo.note,
        completed: newTodo.completed,
        is_active: newTodo.is_active,
      },
    },
    { headers: Hasura.headers }
  );
  return response.data.data.update_item_by_pk;
};

const _delete = async (id) => {
  const response = await axios.post(
    `${Hasura.url}`,
    {
      query: print(DELETE_TODO),
      variables: { id: id },
    },
    { headers: Hasura.headers }
  );
  return response.data.data.delete_item_by_pk;
};

const deleteCompleted = async (listId) => {
  const response = await axios.post(
    `${Hasura.url}`,
    {
      query: print(DELETE_COMPLETED_TODOS),
      variables: { item_list_id: listId },
    },
    { headers: Hasura.headers }
  );
  return response.data.data.delete_item.returning;
};

const add = async (newTodo) => {
  const response = await axios.post(
    `${Hasura.url}`,
    {
      query: print(CREATE_TODO),
      variables: {
        id: newTodo.id,
        title: newTodo.title,
        completed: false,
        is_active: true,
        item_list_id: newTodo.item_list_id,
      },
    },
    { headers: Hasura.headers }
  );
  return response.data.data.insert_item_one;
};

const api = { getAll, update, delete: _delete, deleteCompleted, add };
export default api;
