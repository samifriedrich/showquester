/** @jsx jsx */
import { jsx, Flex, NavLink } from 'theme-ui'
import Link from 'next/link'

const Footer = () => (
  <Flex
    sx={{
      width: '100%',
      height: '4',
      alignItems: 'center',
      justifyContent: 'flex-end',
      mb: '3',
    }}
  >
    <Link href="/">
      <NavLink
        sx={{
          pr: '4',
          '&:hover': {
            cursor: 'pointer',
          }
        }}
      >
        Search
      </NavLink>
      </Link>
    <Link href="/about">
      <NavLink
        sx={{
          pr: '6',
          '&:hover': {
            cursor: 'pointer',
          }
        }}
      >
        About
      </NavLink>
    </Link>
  </Flex>
);

export default Footer;