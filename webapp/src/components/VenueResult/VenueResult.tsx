/** @jsx jsx */
import { jsx, Button, Flex, Spinner } from 'theme-ui'

interface ResultProps {
  venueName: string;
  venueLocation: string;
  playlistName: string | null;
  playlistLoading: boolean;
  playlistError: boolean;
  handleCreatePlaylist: (venueName: string) => Promise<void>;
}

const Result = (props: ResultProps) => {

  return (
    <Flex
      sx={{
        my: '5',
        px: '4',
        py: '3',
        variant: 'borders.muted',
      }}
    >
      <Flex
        sx={{
          alignItems: 'center',
        }}
      >
        {!props.playlistError && !props.playlistLoading && !props.playlistName && 
          <p
            sx={{
              m: '0',
              mr: '4',
            }}
          >
            {props.venueName} &bull; {props.venueLocation}
          </p>
        }
        {props.playlistLoading &&
          <p
            sx={{
              m: '0',
              mr: '4',
            }}
          >
            Creating playlist&nbsp;&nbsp;&nbsp;&nbsp;
          </p>
        }
        {!props.playlistError && !props.playlistLoading && props.playlistName && 
          <p
            sx={{
              m: '0',
              mr: '4',
            }}
          >
            Playlist created: <strong>{props.playlistName}</strong>
          </p>
        }
        {props.playlistError && 
          <p
            sx={{
              m: '0',
              mr: '4',
            }}
          >
            Couldn't create playlist for {props.venueName}.
          </p>
        }
      </Flex>

      {!props.playlistLoading &&
        <Button
          sx={{
            variant: 'buttons.primary.outline',
            minWidth: '150px',
          }}
          onClick={() => props.handleCreatePlaylist(props.venueName)}
        >
          Create Playlist
        </Button>
      }
      {props.playlistLoading &&
        <Spinner size={36} />
      }
    </Flex>
  )
};

export default Result;
