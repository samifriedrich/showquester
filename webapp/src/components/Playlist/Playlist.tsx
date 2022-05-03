/** @jsx jsx */
import {
  jsx,
  // Button,
  Flex,
  Spinner,
  Grid,
  Box,
  Text,
} from 'theme-ui'
import { useState } from 'react';
import { keyframes } from '@emotion/react'

const wave = keyframes({
  from: {
    backgroundPosition: '-468px 0'
  },
  to: {
    backgroundPosition: '468px 0'
  }
});

import * as styles from './Playlist.styles'

interface PlaylistProps {
  venueId: string;
  displayTracks: string[];
  saveLoading: boolean;
  saveError: boolean;
  handleSavePlaylist: (venueId: string) => Promise<void>;
}

const Playlist = (props: PlaylistProps) => {
  const [iframesLoaded, setIframesLoaded] = useState(false);
  const {
    // venueId,
    displayTracks,
    saveLoading,
    saveError,
    // handleSavePlaylist,
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

        {/* {!saveLoading &&
          <Button
            sx={styles.savePlaylistBtn}
            onClick={() => handleSavePlaylist(venueId)}
          >
            {saveError 
              ? 'Try Again'
              : 'Save Playlist to Account'
            }
          </Button>
        } */}

        {saveLoading &&
          <Spinner size={36} />
        }
      </Flex>

      {!saveError && !saveLoading &&
        <>
          <p sx={styles.resultText}>
            Here are a few of the first tracks:
          </p>

          <Grid gap={3} columns={[1, 1, 2, 3, 4]}>
            {displayTracks.map((track) => (
              <Box
                key={track}
                css={{
                  position: 'relative',
                }}
              >
                <iframe
                  sx={{
                    ...styles.track,
                    animation: `${wave} 6s infinite ease-out`,
                    boxShadow: iframesLoaded ? '4px 4px 30px -1px rgba(92,106,196,0.75)' : '0 0 0 0',
                  }}
                  src={`https://open.spotify.com/embed/track/${track.split(':')[2]}`}
                  width="300"
                  height="380"
                  frameBorder="0"
                  allow="encrypted-media"
                  onLoad={() => setIframesLoaded(true)}
                />
                {iframesLoaded &&
                  <Text
                    sx={styles.date} 
                    css={{
                      position: 'absolute',
                    }}
                  >
                    August 22
                  </Text>
                }
              </Box>
            ))}
          </Grid>

          
        </>
      }
    </>
  )
};

export default Playlist;
