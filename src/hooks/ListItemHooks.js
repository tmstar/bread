import { useAuth0 } from '@auth0/auth0-react';
import gql from 'graphql-tag';
import { useEffect, useState } from 'react';
import { useApolloClient, useMutation, useQuery } from 'react-apollo';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { v4 as uuid_v4 } from 'uuid';
import { listItemsInListState, listsInTagState, selectedListState } from '../atoms';
import { updateCachedList } from './ListHooks';

const ALL_ITEMS = gql`
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

const CREATE_ITEM = gql`
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
      name
      items {
        id
        completed
      }
      items_aggregate {
        aggregate {
          count
        }
      }
    }
  }
`;

const UPDATE_ITEM = gql`
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

const DELETE_COMPLETED_ITEMS = gql`
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

const modifyUpdatedAt = (lists, updatedList) => {
  const list = lists.find((list) => list.id === updatedList.id);
  const latestList = { ...list, updated_at: updatedList.updated_at };
  // Due to a bug, aggregation is done in js instead of GraphQL.
  latestList._item_count = updatedList.items.filter((e) => !e.completed).length;
  return lists
    .map((list) => (list.id !== latestList.id ? list : latestList))
    .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
};

export const useAllItems = () => {
  const selectedList = useRecoilValue(selectedListState);
  const setListItems = useSetRecoilState(listItemsInListState);

  const { loading, error, data } = useQuery(ALL_ITEMS, {
    variables: { item_list_id: selectedList?.id },
    pollInterval: 10000, // 10 sec
  });

  useEffect(() => {
    data && setListItems(data.item);
  }, [data, setListItems]);

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
        fragment OldItem on item {
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
              const newItem = cache.writeFragment({
                data: update_item_by_pk,
                fragment: gql`
                  fragment NewItem on item {
                    id
                    completed
                  }
                `,
              });
              return [...existingItems, newItem];
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
  const [listItems, setListItems] = useRecoilState(listItemsInListState);
  const [lists, setLists] = useRecoilState(listsInTagState);
  const selectedList = useRecoilValue(selectedListState);
  const [update, { loading, error, data }] = useMutation(UPDATE_ITEM);

  const onCompleted = (data) => {
    const modLists = modifyUpdatedAt(lists, data.update_item_list_by_pk);
    setLists(modLists);
  };

  const reorderItem = (id, position, sortedItems) => {
    setListItems(sortedItems);
    const item = listItems.find((item) => item.id === id);
    const newItem = { ...item, position: position };

    return update({
      variables: {
        id: newItem.id,
        title: newItem.title,
        note: newItem.note,
        color: newItem.color,
        completed: newItem.completed,
        is_active: newItem.is_active,
        position: newItem.position,
        item_list_id: selectedList.id,
      },
      update(cache) {
        cache.modify({
          fields: {
            item() {
              const newRef = cache.writeQuery({
                query: ALL_ITEMS,
                variables: { item_list_id: selectedList.id },
                data: { item: sortedItems },
              });
              return newRef;
            },
          },
        });
      },
    }).then((res) => onCompleted(res.data));
  };

  error && console.warn(error);
  return { loading, data, reorderItem };
};

export const useUpdateItem = () => {
  const [listItems, setListItems] = useRecoilState(listItemsInListState);
  const [lists, setLists] = useRecoilState(listsInTagState);
  const selectedList = useRecoilValue(selectedListState);
  const [update, { loading, error, data }] = useMutation(UPDATE_ITEM);

  const onCompleted = (data) => {
    const newItems = listItems.map((item) => (item.id !== data.update_item_by_pk.id ? item : data.update_item_by_pk));
    setListItems(newItems);

    const modLists = modifyUpdatedAt(lists, data.update_item_list_by_pk);
    setLists(modLists);
  };

  const updateItem = (id, title, note, color) => {
    if (!title) {
      // ignore empty title
      return Promise.resolve();
    }
    const item = listItems.find((item) => item.id === id);
    const newItem = { ...item, title: title, note: note, color: color, position: item.position || 0 };

    return update({
      variables: {
        id: newItem.id,
        title: newItem.title,
        note: newItem.note,
        color: newItem.color,
        completed: newItem.completed,
        is_active: newItem.is_active,
        position: newItem.position,
        item_list_id: selectedList.id,
      },
    }).then((res) => onCompleted(res.data));
  };

  error && console.warn(error);
  return { loading, data, updateItem };
};

export const useDeleteItem = () => {
  const [listItems, setListItems] = useRecoilState(listItemsInListState);
  const [lists, setLists] = useRecoilState(listsInTagState);
  const selectedList = useRecoilValue(selectedListState);
  const [_delete, { loading, error, data }] = useMutation(DELETE_ITEM);

  const onCompleted = (data) => {
    const modLists = modifyUpdatedAt(lists, data.update_item_list_by_pk);
    setLists(modLists);
  };

  const deleteItem = (id) => {
    return _delete({
      variables: { id: id, item_list_id: selectedList.id },
      update(cache, { data }) {
        cache.modify({
          fields: {
            item(existing, { readField }) {
              const deletedId = data.delete_item_by_pk.id;
              const newItems = listItems.filter((item) => item.id !== deletedId);
              setListItems(newItems);

              return existing.filter((item) => readField('id', item) !== deletedId);
            },
          },
        });
      },
    }).then((res) => onCompleted(res.data));
  };

  error && console.warn(error);
  return { loading, data, deleteItem };
};

export const useDeleteCompletedItems = () => {
  const [listItems, setListItems] = useRecoilState(listItemsInListState);
  const [lists, setLists] = useRecoilState(listsInTagState);
  const selectedList = useRecoilValue(selectedListState);
  const [_delete, { loading, error, data }] = useMutation(DELETE_COMPLETED_ITEMS);
  const [backupItems, setBackupItems] = useState([]);

  const onCompleted = (data) => {
    const modLists = modifyUpdatedAt(lists, data.update_item_list_by_pk);
    setLists(modLists);
  };

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
      update(cache, { data }) {
        cache.modify({
          fields: {
            item(existing, { readField }) {
              const deletedIds = data.delete_item.returning;
              const newItems = listItems.filter((item) => !deletedIds.some((d) => d.id === item.id));
              setListItems(newItems);

              return existing.filter((item) => !deletedIds.some((d) => d.id === readField('id', item)));
            },
          },
        });
      },
    }).then((res) => onCompleted(res.data));
  };

  error && console.warn(error);
  return { loading, data, deleteCompletedItems, deleteItemsFromState, restoreItemsToState };
};

export const useAddItem = () => {
  const [listItems, setListItems] = useRecoilState(listItemsInListState);
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
      title: title,
      completed: false,
      is_active: true,
      position: newPosition,
      id: uuid_v4(),
      item_list_id: selectedList.id,
    };

    return create({
      variables: {
        id: newItem.id,
        title: newItem.title,
        completed: false,
        is_active: true,
        position: newItem.position,
        item_list_id: newItem.item_list_id,
      },
      update(cache, { data: { insert_item_one, update_item_list_by_pk } }) {
        cache.modify({
          fields: {
            item() {
              const newItems = [insert_item_one].concat(listItems);
              setListItems(newItems);

              const newRef = cache.writeQuery({
                query: ALL_ITEMS,
                variables: { item_list_id: selectedList.id },
                data: { item: newItems },
              });
              return newRef;
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
  return { loading, data, addItem };
};
