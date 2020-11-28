import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink,
} from '@apollo/client'

const httpLink = new HttpLink({
  uri: 'http://localhost:4000/graphql',
})

const authLink = new ApolloLink((operation, forward) => {
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null

  operation.setContext({
    headers: {
      authorization: token ? `Authorization: Bearer ${token}` : '',
    },
  })

  return forward(operation)
})

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
  ssrMode: typeof window === 'undefined',
})
