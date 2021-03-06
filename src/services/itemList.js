import axios from 'axios';
import { print } from 'graphql';
import gql from 'graphql-tag';
import Hasura from './hasura';

const ALL_LISTS = gql`
  query AllLists($user_id: String!, $user_email: String!) {
    item_list(
      order_by: { updated_at: desc }
      where: { _or: [{ user_id: { _eq: $user_id } }, { item_list_tags: { tag: { name: { _eq: $user_email } } } }] }
    ) {
      id
      created_at
      updated_at
      name
      item_list_tags(where: { tag: { user_id: { _eq: $user_id } } }) {
        tag {
          id
          name
        }
      }
      items_aggregate(where: { completed: { _eq: false } }) {
        aggregate {
          count
        }
      }
    }
  }
`;

const TAG_LISTS = gql`
  query AllLists($user_id: String!, $user_email: String!, $tag_id: uuid!) {
    item_list(
      order_by: { updated_at: desc }
      where: {
        _and: [
          { _or: [{ user_id: { _eq: $user_id } }, { item_list_tags: { tag: { name: { _eq: $user_email } } } }] }
          { item_list_tags: { tag: { id: { _eq: $tag_id } } } }
        ]
      }
    ) {
      id
      created_at
      updated_at
      name
      item_list_tags(where: { tag: { user_id: { _eq: $user_id } } }) {
        tag {
          id
          name
        }
      }
      items_aggregate(where: { completed: { _eq: false } }) {
        aggregate {
          count
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
      created_at
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
      created_at
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
    delete_item_list_tag(where: { item_list_id: { _eq: $id } }) {
      returning {
        tag_id
        tag {
          item_list_tags_aggregate {
            aggregate {
              count
            }
          }
        }
      }
    }
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

const getAll = async (token, tagId) => {
  const response = await axios.post(
    `${Hasura.url}`,
    {
      query: print(tagId ? TAG_LISTS : ALL_LISTS),
      variables: {
        user_id: Hasura.currentUid,
        user_email: Hasura.currentEmail,
        ...(tagId && { tag_id: tagId }),
      },
    },
    { headers: Hasura.getHeadersWithToken(token) }
  );
  response.data.errors && console.warn(response.data.errors[0]);
  return response.data.data.item_list;
};

const add = async (token, newList) => {
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
    { headers: Hasura.getHeadersWithToken(token) }
  );
  response.data.errors && console.warn(response.data.errors[0]);
  return response.data.data.insert_item_list_one;
};

const update = async (token, id, newList) => {
  const response = await axios.post(
    `${Hasura.url}`,
    {
      query: print(UPDATE_LIST),
      variables: {
        id: id,
        name: newList.name,
      },
    },
    { headers: Hasura.getHeadersWithToken(token) }
  );
  response.data.errors && console.warn(response.data.errors[0]);
  return response.data.data.update_item_list_by_pk;
};

const _delete = async (token, id) => {
  const response = await axios.post(
    `${Hasura.url}`,
    {
      query: print(DELETE_LIST),
      variables: { id: id },
    },
    { headers: Hasura.getHeadersWithToken(token) }
  );
  const data = response.data.data;
  response.data.errors && console.warn(response.data.errors[0]);
  return { itemListId: data.delete_item_list_by_pk.id, tags: data.delete_item_list_tag.returning };
};

const api = { getAll, add, update, delete: _delete };
export default api;
