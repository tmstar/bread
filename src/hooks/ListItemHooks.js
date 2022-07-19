import { useAuth0 } from '@auth0/auth0-react';
import gql from 'graphql-tag';
import { useEffect, useState } from 'react';
import { useApolloClient, useMutation, useQuery } from 'react-apollo';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { v4 as uuid_v4 } from 'uuid';
import { listItemsInListState, selectedListState } from '../atoms';
import { updateCachedList } from './ListHooks';

const ALL_ITEMS = gql`
  query AllItems($item_list_id: uuid!) {
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

const CREATE_ITEM = gql`
  mutation CreateItem($item: item_insert_input!, $item_list_id: uuid!) {
    insert_item_one(object: $item) {
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
      name
    }
  }
`;

const UPDATE_ITEM = gql`
  mutation UpdateItem($id: uuid!, $title: String!, $note: String, $color: String, $item_list_id: uuid!) {
    update_item_by_pk(pk_columns: { id: $id }, _set: { title: $title, note: $note, color: $color }) {
      id
      title
      note
      color
    }
    update_item_list_by_pk(pk_columns: { id: $item_list_id }, _set: { updated_at: "2021-01-01" }) {
      id
      updated_at
      name
    }
  }
`;

const REPOSITION_ITEM = gql`
  mutation RepositionItem($id: uuid!, $position: numeric!, $item_list_id: uuid!) {
    update_item_by_pk(pk_columns: { id: $id }, _set: { position: $position }) {
      id
      position
    }
    update_item_list_by_pk(pk_columns: { id: $item_list_id }, _set: { updated_at: "2021-01-01" }) {
      id
      updated_at
      name
    }
  }
`;

const TOGGLE_ITEM = gql`
  mutation ToggleItem($id: uuid!, $completed: Boolean!, $item_list_id: uuid!) {
    update_item_by_pk(pk_columns: { id: $id }, _set: { completed: $completed }) {
      id
      completed
    }
    update_item_list_by_pk(pk_columns: { id: $item_list_id }, _set: { updated_at: "2021-01-01" }) {
      id
      updated_at
      name
    }
  }
`;

const DELETE_ITEM = gql`
  mutation DeleteItem($id: uuid!, $item_list_id: uuid!) {
    delete_item_by_pk(id: $id) {
      id
    }
    update_item_list_by_pk(pk_columns: { id: $item_list_id }, _set: { updated_at: "2021-01-01" }) {
      id
      updated_at
      name
    }
  }
`;

const DELETE_COMPLETED_ITEMS = gql`
  mutation DeleteCompletedItems($item_list_id: uuid!) {
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

export const useAllItems = () => {
  const selectedList = useRecoilValue(selectedListState);
  const setListItems = useSetRecoilState(listItemsInListState);

  const { loading, error, data } = useQuery(ALL_ITEMS, {
    variables: { item_list_id: selectedList?.id },
    pollInterval: 10000, // 10 sec
  });

  const jsonItem = JSON.stringify(data?.item);
  useEffect(() => {
    data && setListItems(data.item);
  }, [data, jsonItem, setListItems]);

  error && console.warn(error);
  return { loading, data };
};

export const useToggleItem = () => {
  const selectedList = useRecoilValue(selectedListState);
  const { user } = useAuth0();
  const client = useApolloClient();
  const [update, { loading, error, data }] = useMutation(TOGGLE_ITEM);

  const toggleItem = (id, completed) => {
    const item = client.readFragment({
      id: `item:${id}`,
      fragment: gql`
        fragment OldToggleItem on item {
          id
          completed
        }
      `,
    });
    const newItem = { ...item, completed: !completed };

    return update({
      variables: {
        id: newItem.id,
        completed: newItem.completed,
        item_list_id: selectedList.id,
      },
      optimisticResponse: {
        update_item_by_pk: {
          id: newItem.id,
          __typename: 'item',
          completed: newItem.completed,
        },
        update_item_list_by_pk: {
          id: selectedList.id,
          __typename: 'item_list',
          updated_at: selectedList.updated_at,
          name: selectedList.name,
        },
      },
      update(cache, { data: { update_item_by_pk, update_item_list_by_pk } }) {
        cache.modify({
          id: cache.identify(newItem),
          fields: {
            item(existingItems = []) {
              const newItemRef = cache.writeFragment({
                data: update_item_by_pk,
                fragment: gql`
                  fragment NewToggleItem on item {
                    id
                    completed
                  }
                `,
              });
              return [...existingItems, newItemRef];
            },
          },
        });
        cache.modify({
          fields: {
            item_list(existing = []) {
              return updateCachedList(cache, user, existing, update_item_list_by_pk);
            },
          },
        });
      },
    });
  };

  error && console.warn(error);
  return { loading, data, toggleItem };
};

export const useReorderItem = () => {
  const setListItems = useSetRecoilState(listItemsInListState);
  const selectedList = useRecoilValue(selectedListState);
  const { user } = useAuth0();
  const [update, { loading, error, data }] = useMutation(REPOSITION_ITEM);

  const reorderItem = (id, position, sortedItems) => {
    setListItems(sortedItems);
    const newItem = { id: id, position: position };

    return update({
      variables: {
        id: newItem.id,
        position: newItem.position,
        item_list_id: selectedList.id,
      },
      optimisticResponse: {
        update_item_by_pk: {
          id: newItem.id,
          __typename: 'item',
          position: newItem.position,
        },
        update_item_list_by_pk: {
          id: selectedList.id,
          __typename: 'item_list',
          updated_at: selectedList.updated_at,
          name: selectedList.name,
        },
      },
      update(cache, { data: { update_item_by_pk, update_item_list_by_pk } }) {
        cache.modify({
          fields: {
            item(existingItems = [], { readField }) {
              const newItemRef = cache.writeFragment({
                data: update_item_by_pk,
                fragment: gql`
                  fragment NewRepositionItem on item {
                    id
                    position
                  }
                `,
              });
              const fltExistingItems = existingItems.filter((item) => readField('id', item) !== update_item_by_pk.id);
              return [...fltExistingItems, newItemRef].sort((a, b) => readField('position', b) - readField('position', a));
            },
            item_list(existing = []) {
              return updateCachedList(cache, user, existing, update_item_list_by_pk);
            },
          },
        });
      },
    });
  };

  error && console.warn(error);
  return { loading, data, reorderItem };
};

export const useUpdateItem = () => {
  const selectedList = useRecoilValue(selectedListState);
  const { user } = useAuth0();
  const client = useApolloClient();
  const [update, { loading, error, data }] = useMutation(UPDATE_ITEM);

  const updateItem = (id, title, note, color) => {
    if (!title) {
      // ignore empty title
      return Promise.resolve();
    }
    const item = client.readFragment({
      id: `item:${id}`,
      fragment: gql`
        fragment OldUpdateItem on item {
          id
          title
          note
          color
        }
      `,
    });
    const newItem = { ...item, title: title, note: note, color: color };

    return update({
      variables: {
        id: newItem.id,
        title: newItem.title,
        note: newItem.note,
        color: newItem.color,
        item_list_id: selectedList.id,
      },
      optimisticResponse: {
        update_item_by_pk: {
          id: newItem.id,
          __typename: 'item',
          title: newItem.title,
          note: newItem.note,
          color: newItem.color,
          item_list_id: selectedList.id,
        },
        update_item_list_by_pk: {
          id: selectedList.id,
          __typename: 'item_list',
          updated_at: selectedList.updated_at,
          name: selectedList.name,
        },
      },
      update(cache, { data: { update_item_by_pk, update_item_list_by_pk } }) {
        cache.modify({
          id: cache.identify(newItem),
          fields: {
            item(existingItems = []) {
              const newItemRef = cache.writeFragment({
                data: update_item_by_pk,
                fragment: gql`
                  fragment NewUpdateItem on item {
                    id
                    title
                    note
                    color
                  }
                `,
              });
              return [...existingItems, newItemRef];
            },
          },
        });
        cache.modify({
          fields: {
            item_list(existing = []) {
              return updateCachedList(cache, user, existing, update_item_list_by_pk);
            },
          },
        });
      },
    });
  };

  error && console.warn(error);
  return { loading, data, updateItem };
};

export const useDeleteItem = () => {
  const selectedList = useRecoilValue(selectedListState);
  const { user } = useAuth0();
  const [_delete, { loading, error, data }] = useMutation(DELETE_ITEM);

  const deleteItem = (id) => {
    return _delete({
      variables: { id: id, item_list_id: selectedList.id },
      optimisticResponse: {
        delete_item_by_pk: {
          id: id,
          __typename: 'item',
        },
        update_item_list_by_pk: {
          id: selectedList.id,
          __typename: 'item_list',
          updated_at: selectedList.updated_at,
          name: selectedList.name,
        },
      },
      update(cache, { data: { delete_item_by_pk, update_item_list_by_pk } }) {
        cache.modify({
          fields: {
            item(existingItems = [], { readField }) {
              return existingItems.filter((item) => readField('id', item) !== delete_item_by_pk.id);
            },
            item_list(existing = []) {
              return updateCachedList(cache, user, existing, update_item_list_by_pk);
            },
          },
        });
      },
    });
  };

  error && console.warn(error);
  return { loading, data, deleteItem };
};

export const useDeleteCompletedItems = () => {
  const [listItems, setListItems] = useRecoilState(listItemsInListState);
  const selectedList = useRecoilValue(selectedListState);
  const { user } = useAuth0();
  const [_delete, { loading, error, data }] = useMutation(DELETE_COMPLETED_ITEMS);
  const [backupItems, setBackupItems] = useState([]);

  const deleteItemsFromState = () => {
    setBackupItems([...listItems]);
    const newItems = listItems.filter((item) => !item.completed);
    setListItems(newItems);
  };

  const restoreItemsToState = () => {
    setListItems(backupItems);
  };

  const deleteCompletedItems = () => {
    return _delete({
      variables: { item_list_id: selectedList.id },
      update(cache, { data: { delete_item, update_item_list_by_pk } }) {
        cache.modify({
          fields: {
            item(existingItems = [], { readField }) {
              const deletedIds = delete_item.returning;
              return existingItems.filter((item) => !deletedIds.some((d) => d.id === readField('id', item)));
            },
            item_list(existing = []) {
              return updateCachedList(cache, user, existing, update_item_list_by_pk);
            },
          },
        });
      },
    });
  };

  error && console.warn(error);
  return { loading, data, deleteCompletedItems, deleteItemsFromState, restoreItemsToState };
};

export const useAddItem = () => {
  const listItems = useRecoilValue(listItemsInListState);
  const selectedList = useRecoilValue(selectedListState);
  const { user } = useAuth0();
  const [create, { loading, error, data }] = useMutation(CREATE_ITEM);

  const addItem = (title) => {
    if (!title) {
      // ignore empty title
      return Promise.resolve();
    }
    const newPosition = listItems.length ? Math.max(...listItems.map((item) => item.position)) + 1 : 1;
    const newItem = {
      id: uuid_v4(),
      title: title,
      completed: false,
      is_active: true,
      position: newPosition,
      item_list_id: selectedList.id,
    };

    return create({
      variables: {
        item: newItem,
        item_list_id: selectedList.id,
      },
      optimisticResponse: {
        insert_item_one: {
          ...newItem,
          __typename: 'item',
          note: null,
          color: 'default',
        },
        update_item_list_by_pk: {
          id: selectedList.id,
          __typename: 'item_list',
          updated_at: selectedList.updated_at,
          name: selectedList.name,
        },
      },
      update(cache, { data: { insert_item_one, update_item_list_by_pk } }) {
        const { item } = cache.readQuery({
          query: ALL_ITEMS,
          variables: { item_list_id: selectedList.id },
        });
        cache.writeQuery({
          query: ALL_ITEMS,
          variables: { item_list_id: selectedList.id },
          data: { item: [insert_item_one, ...item] },
        });

        cache.modify({
          fields: {
            item_list(existing = []) {
              return updateCachedList(cache, user, existing, update_item_list_by_pk);
            },
          },
        });
      },
    });
  };

  error && console.warn(error);
  return { loading, data, addItem };
};
