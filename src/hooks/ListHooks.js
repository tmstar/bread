import { useAuth0 } from '@auth0/auth0-react';
import gql from 'graphql-tag';
import { useEffect } from 'react';
import { useMutation, useQuery } from 'react-apollo';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { v4 as uuid_v4 } from 'uuid';
import { listsInTagState, selectedListState, selectedTagState, tagsInListState, uniqueTagsState } from '../atoms';

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
  mutation CreateList($list: item_list_insert_input!) {
    insert_item_list_one(object: $list) {
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
      items_aggregate {
        aggregate {
          count
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
      items_aggregate {
        aggregate {
          count
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

const DELETE_TAGS = gql`
  mutation DeleteTags($tag_ids: [uuid!]) {
    delete_tag(where: { id: { _in: $tag_ids } }) {
      returning {
        id
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

export const useUpdateList = () => {
  const [update, { loading, error, data }] = useMutation(UPDATE_LIST);
  const selectedList = useRecoilValue(selectedListState);
  const { user } = useAuth0();

  const updateList = (id, name) => {
    if (!name || name === selectedList.name) {
      // ignore empty name
      return Promise.resolve();
    }
    return update({
      variables: {
        id: id,
        name: name,
      },
      update(cache, { data: { update_item_list_by_pk } }) {
        cache.modify({
          fields: {
            item_list(existing = []) {
              const { item_list } = cache.readQuery({
                query: ALL_LISTS,
                variables: {
                  user_id: user.sub,
                  user_email: user.email,
                },
              });

              if (!item_list) {
                return existing;
              }

              const newLists = item_list
                .map((list) =>
                  list.id !== id ? list : { ...list, updated_at: update_item_list_by_pk.updated_at, name: update_item_list_by_pk.name }
                )
                .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));

              const newRef = cache.writeQuery({
                query: ALL_LISTS,
                variables: {
                  user_id: user.sub,
                  user_email: user.email,
                },
                data: { item_list: newLists },
              });
              return newRef;
            },
          },
        });
      },
    });
  };

  error && console.warn(error);
  return { loading, data, updateList };
};

export const useDeleteList = () => {
  const [uniqueTags, setUniqueTags] = useRecoilState(uniqueTagsState);
  const [deleteItemList, { loading, error, data }] = useMutation(DELETE_LIST);
  const [deleteTag, { errorTag }] = useMutation(DELETE_TAGS);

  const onCompleted = (data) => {
    const unUsedTagIds = data.delete_item_list_tag.returning
      .filter((t) => !t.tag.item_list_tags_aggregate.aggregate.count)
      .map((t) => t.tag_id);
    deleteTag({ variables: { tag_ids: unUsedTagIds } }).then((res) => {
      const deletedTags = res.data.delete_tag.returning;
      const newTags = uniqueTags.filter((tag) => !deletedTags.some((t) => t.id === tag.id));
      setUniqueTags(newTags);
    });
  };

  const deleteList = (id) => {
    return deleteItemList({
      variables: { id: id },
      update(cache, { data }) {
        cache.modify({
          fields: {
            item_list(existing, { readField }) {
              const deletedId = data.delete_item_list_by_pk.id;
              return existing.filter((list) => readField('id', list) !== deletedId);
            },
          },
        });
      },
    }).then((res) => onCompleted(res.data));
  };

  error && console.warn(error);
  errorTag && console.warn(errorTag);
  return { loading, data, deleteList };
};

export const useAddList = () => {
  const lists = useRecoilValue(listsInTagState);
  const selectedTag = useRecoilValue(selectedTagState);
  const setSelectedList = useSetRecoilState(selectedListState);
  const setTagsInList = useSetRecoilState(tagsInListState);
  const { user } = useAuth0();
  const [create, { loading, error, data }] = useMutation(CREATE_LIST);

  const onCompleted = (data) => {
    setSelectedList(data.insert_item_list_one);

    if (selectedTag) {
      setTagsInList([selectedTag]);
    }
  };

  const addList = (listName) => {
    const newList = {
      id: uuid_v4(),
      user_id: user.sub,
      name: listName,
      item_list_tags: {
        data: {
          tag_id: selectedTag?.id,
        },
        on_conflict: { constraint: 'item_list_tag_pkey', update_columns: 'tag_id' },
      },
    };

    return create({
      variables: {
        list: newList,
      },
      update(cache, { data }) {
        cache.modify({
          fields: {
            item_list() {
              const newLists = [data.insert_item_list_one].concat(lists);

              const newRef = cache.writeQuery({
                query: ALL_LISTS,
                variables: {
                  user_id: user.sub,
                  user_email: user.email,
                },
                data: { item_list: newLists },
              });
              return newRef;
            },
          },
        });
      },
    }).then((res) => onCompleted(res.data));
  };

  error && console.warn(error);
  return { loading, data, addList };
};
