import { selectedListState, listItemsInListState, listsInTagState } from '../../atoms';
import { useRecoilValue, useRecoilState, useSetRecoilState } from 'recoil';
import { useQuery, useMutation } from 'react-apollo';
import gql from 'graphql-tag';

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

  const { loading, error, data } = useQuery(ALL_TODOS, {
    variables: { item_list_id: selectedList.id },
    onCompleted: (data) => {
      setListItems(data.item);
    },
  });

  error && console.warn(error);
  return { loading, data };
};

export const useToggleItem = () => {
  const [listItems, setListItems] = useRecoilState(listItemsInListState);
  const [lists, setLists] = useRecoilState(listsInTagState);
  const selectedList = useRecoilValue(selectedListState);
  const [updateItem, { loading, error, data }] = useMutation(UPDATE_TODO);

  const toggleItem = (id, completed) => {
    const item = listItems.find((item) => item.id === id);
    const newItem = { ...item, completed: !completed, position: item.position || 0 };

    // quick update displayed list
    const toggledItems = listItems.map((item) => (item.id !== newItem.id ? item : newItem));
    setListItems(toggledItems);

    updateItem({
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
      onCompleted: (data) => {
        const modLists = modifyUpdatedAt(lists, data.update_item_list_by_pk);
        setLists(modLists);
      },
    });
  };

  error && console.warn(error);
  return { loading, data, toggleItem };
};

export const useReorderItem = () => {
  const listItems = useRecoilValue(listItemsInListState);
  const [lists, setLists] = useRecoilState(listsInTagState);
  const selectedList = useRecoilValue(selectedListState);
  const [updateItem, { loading, error, data }] = useMutation(UPDATE_TODO);

  const reorderItem = (id, position) => {
    const item = listItems.find((item) => item.id === id);
    const newItem = { ...item, position: position };

    updateItem({
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
      onCompleted: (data) => {
        const modLists = modifyUpdatedAt(lists, data.update_item_list_by_pk);
        setLists(modLists);
      },
    });
  };

  error && console.warn(error);
  return { loading, data, reorderItem };
};

export const useDeleteItem = () => {
  const [listItems, setListItems] = useRecoilState(listItemsInListState);
  const [lists, setLists] = useRecoilState(listsInTagState);
  const selectedList = useRecoilValue(selectedListState);
  const [deleteFromDB, { loading, error, data }] = useMutation(DELETE_TODO);

  const onCompleted = (data) => {
    const newItems = listItems.filter((item) => item.id !== data.delete_item_by_pk.id);
    setListItems(newItems);

    const modLists = modifyUpdatedAt(lists, data.update_item_list_by_pk);
    setLists(modLists);
  };

  const deleteItem = (id) => {
    deleteFromDB({
      variables: { id: id, item_list_id: selectedList.id },
    }).then((res) => onCompleted(res.data));
  };

  error && console.warn(error);
  return { loading, data, deleteItem };
};
