/** @jsx jsx */
import { jsx, Button } from 'theme-ui'
import Link from 'next/link'

import * as styles from './Success.styles'
import Layout from '../../components/Layout/Layout'
import HeaderLogo from '../../components/HeaderLogo/HeaderLogo';
import InfoPage from '../../components/InfoPage/InfoPage';

const Success = () => {
  return (
    <Layout>
      <InfoPage>
        <HeaderLogo />

        <p>
          Success! Your playlist has been saved to your account.
        </p>

        {/* Replace with actual link to Playlist */}
        <Link href="/">
          <a>
            <Button
              sx={styles.searchBtn}
            >
              View in Spotify
            </Button>
          </a>
        </Link>

        <p>
          Or, listen to it directly here:
        </p>

        <iframe
          sx={styles.playlist}
          // update to playlist ID when available
          src="https://open.spotify.com/embed/album/1DFixLWuPkv3KT3TnV35m3"
          width="300"
          height="380"
          frameBorder="0"
          allow="encrypted-media"
        />

      </InfoPage>
    </Layout>
  );
};

export default Success;
