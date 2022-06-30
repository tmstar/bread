import { useAuth0 } from '@auth0/auth0-react';
import gql from 'graphql-tag';
import { useEffect } from 'react';
import { useQuery } from 'react-apollo';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { listsInTagState, selectedTagState } from '../atoms';

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

export const useAllLists = () => {
  const { user } = useAuth0();
  const selectedTag = useRecoilValue(selectedTagState);
  const setLists = useSetRecoilState(listsInTagState);

  const { loading, error, data } = useQuery(selectedTag ? TAG_LISTS : ALL_LISTS, {
    variables: {
      user_id: user.sub,
      user_email: user.email,
      ...(selectedTag && { tag_id: selectedTag.id }),
    },
    pollInterval: 10000, // 10 sec
  });

  useEffect(() => {
    if (!data) {
      return;
    }
    const newLists = data.item_list.map((list) => {
      return { ...list, _item_count: list.items_aggregate.aggregate.count };
    });
    setLists(newLists);
  }, [data, setLists]);

  error && console.warn(error);
  return { loading, data };
};
