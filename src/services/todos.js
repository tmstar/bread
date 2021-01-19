import axios from "axios";
import { print } from "graphql";
import gql from "graphql-tag";

const gqlUrl = process.env.REACT_APP_API_SERVER_URL;

const ALL_TODOS = gql`
  query AllTodos {
    wish_list {
      id
      title
      note
      completed
      is_active
    }
  }
`;

const CREATE_TODO = gql`
  mutation CreateTodo($id: uuid!, $title: String!, $completed: Boolean!, $is_active: Boolean!) {
    insert_wish_list_one(object: { id: $id, title: $title, completed: $completed, is_active: $is_active }) {
      id
      title
      note
      completed
      is_active
    }
  }
`;

const UPDATE_TODO = gql`
  mutation UpdateTodo($id: uuid!, $note: String, $title: String!, $completed: Boolean!, $is_active: Boolean!) {
    update_wish_list_by_pk(
      pk_columns: { id: $id }
      _set: { note: $note, title: $title, completed: $completed, is_active: $is_active }
    ) {
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
    delete_wish_list_by_pk(id: $id) {
      id
    }
  }
`;

const getAll = async () => {
  const response = await axios.post(`${gqlUrl}`, { query: print(ALL_TODOS) });
  return response.data.data.wish_list;
};

const update = async (id, newTodo) => {
  const response = await axios.post(`${gqlUrl}`, {
    query: print(UPDATE_TODO),
    variables: {
      id: id,
      title: newTodo.title,
      note: newTodo.note,
      completed: newTodo.completed,
      is_active: newTodo.is_active,
    },
  });
  return response.data.data.update_wish_list_by_pk;
};

const _delete = async (id) => {
  await axios.post(`${gqlUrl}`, {
    query: print(DELETE_TODO),
    variables: { id: id },
  });
  return id;
};

const add = async (newTodo) => {
  const response = await axios.post(`${gqlUrl}`, {
    query: print(CREATE_TODO),
    variables: {
      id: newTodo.id,
      title: newTodo.title,
      completed: false,
      is_active: true,
    },
  });
  return response.data.data.insert_wish_list_one;
};

const api = { getAll, update, delete: _delete, add };
export default api;
