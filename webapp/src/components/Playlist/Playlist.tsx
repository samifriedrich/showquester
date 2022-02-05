/** @jsx jsx */
import { jsx, Button, Flex, Spinner } from 'theme-ui'

import * as styles from './Playlist.styles'

interface PlaylistProps {
  venueId: string;
  displayTracks: string[];
  saveLoading: boolean;
  saveError: boolean;
  handleSavePlaylist: (venueId: string) => Promise<void>;
}

const Playlist = (props: PlaylistProps) => {
  const {
    venueId,
    displayTracks,
    saveLoading,
    saveError,
    handleSavePlaylist,
  } = props;

  return (
    <>
      <Flex sx={styles.resultContainer}>
        <Flex sx={styles.playlistInfo}>

          {!saveError && !saveLoading && 
            <p sx={styles.resultText}>
              Success! Playlist created.
            </p>
          }

          {saveLoading &&
            <p sx={styles.resultText}>
              Saving playlist&nbsp;&nbsp;&nbsp;&nbsp;
            </p>
          }

          {saveError && 
            <p sx={styles.resultText}>
              Couldn't save playlist.
            </p>
          }
        </Flex>

        {!saveLoading &&
          <Button
            sx={styles.savePlaylistBtn}
            onClick={() => handleSavePlaylist(venueId)}
          >
            {saveError 
              ? 'Try Again'
              : 'Save Playlist to Account'
            }
          </Button>
        }

        {saveLoading &&
          <Spinner size={36} />
        }
      </Flex>

      {!saveError && !saveLoading &&
        <>
          <p sx={styles.resultText}>
            Here are a few of the first tracks:
          </p>

          {displayTracks.map((track) => (
            <iframe
              key={track}
              sx={styles.track}
              src={`https://open.spotify.com/embed/track/${track.split(':')[2]}`}
              width="300"
              height="380"
              frameBorder="0"
              allow="encrypted-media"
            />
          ))}
        </>
      }
    </>
  )
};

export default Playlist;
