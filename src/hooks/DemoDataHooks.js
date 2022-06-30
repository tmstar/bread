import { useAuth0 } from '@auth0/auth0-react';
import gql from 'graphql-tag';
import { useEffect, useState } from 'react';
import { useMutation } from 'react-apollo';
import { v4 as uuid_v4 } from 'uuid';
import getUuid from 'uuid-by-string';
import { demoText } from './DemoData';

const CREATE_DEMO_LISTS = gql`
  mutation CreateDemoLists($list: [item_list_insert_input!]!) {
    insert_item_list(objects: $list, on_conflict: { constraint: item_list_pkey, update_columns: id }) {
      affected_rows
    }
  }
`;

const demoData = (userId) => {
  const txt = demoText;
  return txt.lists.reverse().map((list) => {
    const listId = getUuid(`${userId}-demo-${list.name}`);
    return {
      id: listId,
      user_id: userId,
      name: list.name,
      item_list_tags: {
        data: list.tags.map((tag) => {
          const tagId = uuid_v4();
          return {
            tag: {
              data: {
                id: tagId,
                user_id: userId,
                name: tag.name,
              },
              on_conflict: { constraint: 'tag_name_user_id_key', update_columns: 'name' },
            },
          };
        }),
        on_conflict: { constraint: 'item_list_tag_pkey', update_columns: 'tag_id' },
      },
      items: {
        data: list.items.map((item, index) => {
          return {
            id: getUuid(`${listId}-${index}`),
            title: item.title,
            note: item.note,
            color: item.color ?? 'default',
            completed: item.completed ?? false,
            is_active: true,
            position: 100 - index,
          };
        }),
        on_conflict: { constraint: 'wish_list_pkey', update_columns: [] },
      },
    };
  });
};

export const useCreateDemoItems = () => {
  const [loadingDemo, setLoadingDemo] = useState(false);
  const { isAuthenticated, user } = useAuth0();
  const [createList, { error }] = useMutation(CREATE_DEMO_LISTS);

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }
    const userMetadata = user[process.env.REACT_APP_AUTH0_TOKEN_KEY + '/user_metadata'];
    if (!(userMetadata?.logins === 1 && userMetadata?.firstLogin)) {
      return;
    }

    setLoadingDemo(true);
    const lists = demoData(user.sub);

    // controlling the mutation order
    createList({ variables: { list: lists[0] } })
      .then(() => createList({ variables: { list: lists[1] } }))
      .then(() => createList({ variables: { list: lists[2] } }))
      .then(() => setLoadingDemo(false));
  }, [isAuthenticated, user, createList]);

  error && console.warn(error);
  return { loadingDemo };
};
