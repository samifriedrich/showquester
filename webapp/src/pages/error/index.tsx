/** @jsx jsx */
import { jsx, Button } from 'theme-ui'
import Link from 'next/link'

import * as styles from './Error.styles'
import Layout from '../../components/Layout/Layout'
import HeaderLogo from '../../components/HeaderLogo/HeaderLogo'
import InfoPage from '../../components/InfoPage/InfoPage'

const Error = () => (
  <Layout>
    <InfoPage>
      <HeaderLogo />

      <p>
        Sorry, there was a problem saving the playlist to your account.
      </p>

      <p>
        Try saving the playlist again from the search screen.
      </p>

      <Link href="/" passHref>
        <a>
          <Button
            sx={styles.searchBtn}
          >
            Back to Search
          </Button>
        </a>
      </Link>

      <p>
        If the problem persists, let us know at&nbsp;
        <a href="mailto:contact@showquester.com">contact@showquester.com</a>
        .
      </p>

    </InfoPage>
  </Layout>
);

export default Error;
