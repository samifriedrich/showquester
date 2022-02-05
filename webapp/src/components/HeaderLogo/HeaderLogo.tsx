/** @jsx jsx */
import { jsx } from 'theme-ui'
import Link from 'next/link'

import * as styles from './HeaderLogo.styles'


const HeaderLogo = () => (
  <Link href="/" passHref>
    <h1
      sx={styles.logo}
    >
      ShowQuester
    </h1>
  </Link>
);

export default HeaderLogo;
