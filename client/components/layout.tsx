import styled from '@emotion/styled'
import { mq } from '../styles/breakpoints'
import { INavLink, NavBar } from './navBar'

const Wrapper = styled.div(() =>
  mq({
    minWidth: '100vw',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  }),
)

const Main = styled.div`
  ${mq({
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    maxWidth: ['100%', '', '800px'],
    width: '100%',
  })}
`

interface ILayout {
  navLinks: INavLink[]
}

export const Layout: React.FC<ILayout> = ({ navLinks, children }) => {
  return (
    <Wrapper>
      <NavBar navLinks={navLinks} />
      <Main>{children}</Main>
    </Wrapper>
  )
}
