import axios from "axios";
import { print } from "graphql";
import gql from "graphql-tag";
import Hasura from "./hasura";

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

const add = async (listId, newTag) => {
  const response = await axios.post(
    `${Hasura.url}`,
    {
      query: print(CREATE_TAG),
      variables: {
        id: newTag.id,
        user_id: Hasura.currentUid(),
        name: newTag.name,
        item_list_id: listId,
      },
    },
    { headers: Hasura.headers }
  );
  return response.data.data.insert_tag_one;
};

const api = { add };
export default api;
