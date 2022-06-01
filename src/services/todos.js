import axios from 'axios';
import { print } from 'graphql';
import gql from 'graphql-tag';
import Hasura from './hasura';

const ALL_TODOS = gql`
  query AllTodos($item_list_id: uuid!) {
    item(where: { item_list_id: { _eq: $item_list_id } }, order_by: { position: desc_nulls_last, created_at: desc }) {
      id
      title
      note
      color
      completed
      is_active
      position
    }
  }
`;

const CREATE_TODO = gql`
  mutation CreateTodo($id: uuid!, $title: String!, $completed: Boolean!, $is_active: Boolean!, $position: numeric!, $item_list_id: uuid!) {
    insert_item_one(
      object: { id: $id, title: $title, completed: $completed, is_active: $is_active, position: $position, item_list_id: $item_list_id }
    ) {
      id
      title
      note
      color
      completed
      is_active
      position
      item_list_id
    }
    update_item_list_by_pk(pk_columns: { id: $item_list_id }, _set: { updated_at: "2021-01-01" }) {
      id
      updated_at
      items {
        id
        completed
      }
    }
  }
`;

const UPDATE_TODO = gql`
  mutation UpdateTodo(
    $id: uuid!
    $title: String!
    $note: String
    $color: String
    $completed: Boolean!
    $is_active: Boolean!
    $position: numeric!
    $item_list_id: uuid!
  ) {
    update_item_by_pk(
      pk_columns: { id: $id }
      _set: { title: $title, note: $note, color: $color, completed: $completed, is_active: $is_active, position: $position }
    ) {
      id
      title
      note
      color
      completed
      is_active
      position
    }
    update_item_list_by_pk(pk_columns: { id: $item_list_id }, _set: { updated_at: "2021-01-01" }) {
      id
      updated_at
      items {
        id
        completed
      }
    }
  }
`;

const DELETE_TODO = gql`
  mutation DeleteTodo($id: uuid!, $item_list_id: uuid!) {
    delete_item_by_pk(id: $id) {
      id
    }
    update_item_list_by_pk(pk_columns: { id: $item_list_id }, _set: { updated_at: "2021-01-01" }) {
      id
      updated_at
      items {
        id
        completed
      }
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
    update_item_list_by_pk(pk_columns: { id: $item_list_id }, _set: { updated_at: "2021-01-01" }) {
      id
      updated_at
      items {
        id
        completed
      }
    }
  }
`;

const getAll = async (token, listId) => {
  const response = await axios.post(
    `${Hasura.url}`,
    {
      query: print(ALL_TODOS),
      variables: {
        item_list_id: listId,
      },
    },
    { headers: Hasura.getHeadersWithToken(token) }
  );
  return response.data.data.item;
};

const update = async (token, id, newTodo, listId) => {
  const response = await axios.post(
    `${Hasura.url}`,
    {
      query: print(UPDATE_TODO),
      variables: {
        id: id,
        title: newTodo.title,
        note: newTodo.note,
        color: newTodo.color,
        completed: newTodo.completed,
        is_active: newTodo.is_active,
        position: newTodo.position,
        item_list_id: listId,
      },
    },
    { headers: Hasura.getHeadersWithToken(token) }
  );
  response.data.errors && console.warn(response.data.errors[0]);
  return { item: response.data.data.update_item_by_pk, itemList: response.data.data.update_item_list_by_pk };
};

const _delete = async (token, id, listId) => {
  const response = await axios.post(
    `${Hasura.url}`,
    {
      query: print(DELETE_TODO),
      variables: { id: id, item_list_id: listId },
    },
    { headers: Hasura.getHeadersWithToken(token) }
  );
  return { item: response.data.data.delete_item_by_pk, itemList: response.data.data.update_item_list_by_pk };
};

const deleteCompleted = async (token, listId) => {
  const response = await axios.post(
    `${Hasura.url}`,
    {
      query: print(DELETE_COMPLETED_TODOS),
      variables: { item_list_id: listId },
    },
    { headers: Hasura.getHeadersWithToken(token) }
  );
  return { items: response.data.data.delete_item.returning, itemList: response.data.data.update_item_list_by_pk };
};

const add = async (token, newTodo) => {
  const response = await axios.post(
    `${Hasura.url}`,
    {
      query: print(CREATE_TODO),
      variables: {
        id: newTodo.id,
        title: newTodo.title,
        completed: false,
        is_active: true,
        position: newTodo.position,
        item_list_id: newTodo.item_list_id,
      },
    },
    { headers: Hasura.getHeadersWithToken(token) }
  );
  return { item: response.data.data.insert_item_one, itemList: response.data.data.update_item_list_by_pk };
};

const api = { getAll, update, delete: _delete, deleteCompleted, add };
export default api;
