/** @jsx jsx */
import { jsx, Button } from 'theme-ui'
import Link from 'next/link'
import { useRouter } from 'next/router'

import * as styles from './Success.styles'
import Layout from '../../components/Layout/Layout'
import HeaderLogo from '../../components/HeaderLogo/HeaderLogo';
import InfoPage from '../../components/InfoPage/InfoPage';

const Success = () => {
  const router = useRouter()
  const { playlist_id: playlistId } = router.query

  return (
    <Layout>
      <InfoPage>
        <HeaderLogo />

        <p>
          Success! Your playlist has been saved to your account.
        </p>

        <Link href={`https://open.spotify.com/playlist/${playlistId}`}>
          <a target="_blank">
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
          src={`https://open.spotify.com/embed/playlist/${playlistId}`}
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
