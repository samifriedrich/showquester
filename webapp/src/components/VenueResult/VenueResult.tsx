/** @jsx jsx */
import { jsx, Button, Flex, Spinner } from 'theme-ui'

import * as styles from './VenueResult.styles'

interface ResultProps {
  venueId: string;
  venueName: string;
  venueLocation: string;
  playlistLoading: boolean;
  playlistError: boolean;
  handleCreatePlaylist: (venueId: string) => Promise<void>;
}

const Result = (props: ResultProps) => {
  const {
    venueId,
    venueName,
    venueLocation,
    playlistLoading,
    playlistError,
    handleCreatePlaylist,
  } = props;

  return (
    <Flex sx={styles.resultContainer}>
      <Flex sx={styles.venueInfo}>

        {!playlistError && !playlistLoading && 
          <p sx={styles.resultText}>
            {venueName} &bull; {venueLocation}
          </p>
        }

        {playlistLoading &&
          <p sx={styles.resultText}>
            Creating playlist&nbsp;&nbsp;&nbsp;&nbsp;
          </p>
        }

        {playlistError && 
          <p sx={styles.resultText}>
            Couldn't create playlist for <strong>{venueName}</strong>.
          </p>
        }
      </Flex>

      {!playlistLoading &&
        <Button
          sx={styles.createPlaylistBtn}
          onClick={() => handleCreatePlaylist(venueId)}
        >
          {playlistError 
            ? 'Try Again' 
            : 'Create Playlist'
          }
        </Button>
      }

      {playlistLoading &&
        <Spinner size={36} />
      }
    </Flex>
  )
};

export default Result;
