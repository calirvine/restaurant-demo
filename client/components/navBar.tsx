import Link from 'next/link'
import styled from '@emotion/styled'

import { mq } from '../styles/breakpoints'
import { LoginButton } from './LoginButton'
import { useUser } from '../context/UserProvider'

export interface INavLink {
  label: string
  url: string
  roleRestricted?: string
}
interface INavBar {
  navLinks: INavLink[]
}

const NavBarSection = styled.div`
  ${mq({
    width: '100%',
    boxShadow: '0 4px 2px -2px gray;',
    display: 'flex',
    flexDirection: ['column', 'row', 'row'],
    justifyContent: 'center',
    marginBottom: '50px',
  })}
`

const NavBarWrapper = styled.div`
  ${mq({
    display: 'flex',
    flexDirection: ['column', 'row', 'row'],
    justifyContent: 'space-between',
    maxWidth: ['100%', '', '800px'],
    flex: 1,
  })}
`

const NavLinksSection = styled.ul`
  display: flex;
  flex-direction: row;
  list-style-type: none;
  margin: 0;
`

const NavLinks = styled.li`
  ${mq({
    padding: '20px 30px',
    a: {
      textDecoration: 'none',
      color: 'black',
      margin: 'auto 0',
    },
    ':hover': {
      background: '#f6f6f6',
      cursor: 'pointer',
    },
  })}
`

const NavLogoSection = styled.div`
  ${mq({
    margin: 'auto 0',
    a: {
      textDecoration: 'none',
      color: 'black',
      margin: 'auto 0',
    },
  })}
`

export const NavBar: React.FC<INavBar> = ({ navLinks }) => {
  const { user } = useUser()
  return (
    <NavBarSection>
      <NavBarWrapper>
        <NavLogoSection>
          <h4>
            <Link href="/">Restaurantify</Link>
          </h4>
        </NavLogoSection>
        <NavLinksSection>
          {navLinks.map(link => {
            if (
              link.roleRestricted &&
              user?.profile.role !== link.roleRestricted
            )
              return null
            return (
              <NavLinks key={link.url}>
                <Link href={link.url}>{link.label}</Link>
              </NavLinks>
            )
          })}
          <NavLinks>
            <LoginButton
              isLoggedIn={false}
              onClick={() => console.log('clicked')}
            />
          </NavLinks>
        </NavLinksSection>
      </NavBarWrapper>
    </NavBarSection>
  )
}
