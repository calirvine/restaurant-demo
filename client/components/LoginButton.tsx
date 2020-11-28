import styled from '@emotion/styled'

import { mq } from '../styles/breakpoints'

interface ILoginButton {
  isLoggedIn: boolean
  userName?: string
  onClick: () => any
}

export const LoginButton: React.FC<ILoginButton> = ({
  isLoggedIn,
  userName,
  onClick,
}) => {
  return <a onClick={onClick}>{isLoggedIn ? userName || 'Profile' : 'Login'}</a>
}
