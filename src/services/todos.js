import axios from "axios";
import { print } from "graphql";
import gql from "graphql-tag";

const gqlUrl = process.env.REACT_APP_API_SERVER_URL;

const ALL_TODOS = gql`
  query AllTodos {
    wish_list {
      id
      isactive
      note
      title
      completed
    }
  }
`;

const CREATE_TODO = gql`
  mutation CreateTodo($id: uuid!, $title: String!, $completed: Boolean!, $isactive: Boolean!) {
    insert_wish_list_one(object: { id: $id, title: $title, completed: $completed, isactive: $isactive }) {
      id
      isactive
      note
      title
      completed
    }
  }
`;

const UPDATE_TODO = gql`
  mutation UpdateTodo($id: uuid!, $note: String, $title: String!) {
    update_wish_list_by_pk(pk_columns: { id: $id }, _set: { note: $note, title: $title }) {
      id
      note
      title
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
      isactive: true,
    },
  });
  return response.data.data.insert_wish_list_one;
};

const api = { getAll, update, delete: _delete, add };
export default api;
