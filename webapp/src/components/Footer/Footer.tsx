/** @jsx jsx */
import { jsx, Flex, NavLink } from 'theme-ui'
import Link from 'next/link'

import * as styles from './Footer.styles'

const Footer: React.FC = () => (
  <Flex sx={styles.footerContainer}>
    <Link href="/">
      <NavLink
        sx={styles.link}
      >
        Search
      </NavLink>
      </Link>
    <Link href="/about">
      <NavLink
        sx={styles.rightLink}
      >
        About
      </NavLink>
    </Link>
  </Flex>
);

export default Footer;