import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/link-context';
import { useAuth0 } from '@auth0/auth0-react';
import React, { useRef } from 'react';
import { ApolloProvider } from 'react-apollo';

function ApolloProviderWithAuth0({ children }) {
  const { getAccessTokenSilently } = useAuth0();
  const client = useRef();

  const httpLink = new HttpLink({ uri: process.env.REACT_APP_HASURA_SERVER_URL });

  const authLink = setContext(async (_, { headers }) => {
    const token = await getAccessTokenSilently();
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : '',
      },
    };
  });

  if (!client.current) {
    client.current = new ApolloClient({
      link: authLink.concat(httpLink),
      cache: new InMemoryCache({
        typePolicies: {
          item_list: {
            fields: {
              items: {
                merge(existing, incoming) {
                  return incoming;
                },
              },
            },
          },
        },
      }),
    });
  }

  return <ApolloProvider client={client.current}>{children}</ApolloProvider>;
}

export default ApolloProviderWithAuth0;
