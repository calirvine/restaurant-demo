import {
  useContext,
  useState,
  useEffect,
  createContext,
  useCallback,
  useMemo,
} from 'react'
import { useQuery, gql } from '@apollo/client'
import { currentUser, currentUser_me } from './__generated__/currentUser'

export const USER_FRAGMENT = gql`
  fragment UserFragment on User {
    id
    email
    profile {
      role
      name
    }
  }
`

const CURRENT_USER_QUERY = gql`
  query currentUser {
    me {
      ...UserFragment
    }
  }
  ${USER_FRAGMENT}
`

const userContext = createContext<{
  user: currentUser_me
  setUserCallback: (token: string) => void
} | null>(null)

export const UserProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<currentUser_me | null>(null)

  const setUserCallback = useCallback((token: string | null) => {
    localStorage.setItem('auth_token', token)
    refetch()
  }, [])

  const { loading, error, data, refetch } = useQuery<currentUser>(
    CURRENT_USER_QUERY,
  )

  useEffect(() => {
    if (!loading && !error) {
      if (data.me) setUser(data.me)
    }
  }, [loading, error, data])

  const value = useMemo(() => ({ user, setUserCallback }), [
    user,
    setUserCallback,
  ])

  return <userContext.Provider value={value}>{children}</userContext.Provider>
}

export const useUser = () => {
  const context = useContext(userContext)
  return context
}
