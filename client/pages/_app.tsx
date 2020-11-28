import { ApolloProvider } from '@apollo/client'

import { client } from '../services/apollo'

import '../styles/globals.css'
import { UserProvider } from '../context/UserProvider'
import { Layout } from '../components/layout'

const navLinks = [
  { label: 'Home', url: '/' },
  {
    label: 'My restaurants',
    url: '/restaurants',
    roleRestricted: 'owner',
  },
  {
    label: 'All users',
    url: '/users',
    roleRestricted: 'admin',
  },
]

function MyApp({ Component, pageProps }) {
  return (
    <ApolloProvider client={client}>
      <UserProvider>
        <Layout navLinks={navLinks}>
          <Component {...pageProps} />
        </Layout>
      </UserProvider>
    </ApolloProvider>
  )
}

export default MyApp
