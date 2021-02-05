import axios from "axios";
import { print } from "graphql";
import gql from "graphql-tag";
import Hasura from "./hasura";

const ALL_TAGS = gql`
  query AllTags($user_id: String!) {
    tag(order_by: { name: asc }, where: { user_id: { _eq: $user_id } }) {
      id
      name
      user_id
    }
  }
`;

const CREATE_TAG = gql`
  mutation CreateTag($id: uuid!, $user_id: String!, $name: String!, $item_list_id: uuid!) {
    insert_tag_one(
      object: {
        id: $id
        user_id: $user_id
        name: $name
        item_list_tags: { data: { item_list_id: $item_list_id }, on_conflict: { constraint: item_list_tag_pkey, update_columns: tag_id } }
      }
      on_conflict: { constraint: tag_name_user_id_key, update_columns: name }
    ) {
      id
      user_id
      name
      item_list_tags {
        item_list_id
        tag_id
      }
    }
  }
`;

const REMOVE_TAG = gql`
  mutation RemoveTag($item_list_id: uuid!, $tag_id: uuid!) {
    delete_item_list_tag_by_pk(item_list_id: $item_list_id, tag_id: $tag_id) {
      item_list_id
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
`;

const DELETE_TAG = gql`
  mutation DeleteTag($tag_id: uuid!) {
    delete_tag_by_pk(id: $tag_id) {
      id
    }
  }
`;

const getAll = async () => {
  const response = await axios.post(
    `${Hasura.url}`,
    {
      query: print(ALL_TAGS),
      variables: {
        user_id: Hasura.currentUid,
      },
    },
    { headers: Hasura.headers }
  );
  return response.data.data.tag;
};

const add = async (listId, newTag) => {
  const response = await axios.post(
    `${Hasura.url}`,
    {
      query: print(CREATE_TAG),
      variables: {
        id: newTag.id,
        user_id: Hasura.currentUid,
        name: newTag.name,
        item_list_id: listId,
      },
    },
    { headers: Hasura.headers }
  );
  return response.data.data.insert_tag_one;
};

const remove = async (listId, tagId) => {
  const response = await axios.post(
    `${Hasura.url}`,
    {
      query: print(REMOVE_TAG),
      variables: { item_list_id: listId, tag_id: tagId },
    },
    { headers: Hasura.headers }
  );
  const removed = response.data.data.delete_item_list_tag_by_pk;
  const hasLists = removed.tag.item_list_tags_aggregate.aggregate.count;
  if (!hasLists) {
    await axios.post(
      `${Hasura.url}`,
      {
        query: print(DELETE_TAG),
        variables: { tag_id: tagId },
      },
      { headers: Hasura.headers }
    );
  }
  return removed;
};

const api = { getAll, add, remove };
export default api;
