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
  const resultText = {
    m: '0',
    mr: '5',
  };

  return (
    <Flex
      sx={{
        mt: ['5', '6'],
        px: '5',
        py: '4',
        maxWidth: '90vw',
        variant: 'borders.muted',
        flexDirection: ['column', 'column', 'row'],
      }}
    >
      <Flex
        sx={{
          alignItems: 'center',
          mb: ['4', '4', '0']
        }}
      >
        {!props.playlistError && !props.playlistLoading && !props.playlistName && 
          <p sx={resultText}>
            {props.venueName} &bull; {props.venueLocation}
          </p>
        }
        {props.playlistLoading &&
          <p sx={resultText}>
            Creating playlist&nbsp;&nbsp;&nbsp;&nbsp;
          </p>
        }
        {!props.playlistError && !props.playlistLoading && props.playlistName && 
          <p sx={resultText}>
            Playlist created:&nbsp;&nbsp;
            <strong
              sx={{
                color: 'highlight',
              }}
            >
              {props.playlistName}
            </strong>
          </p>
        }
        {props.playlistError && 
          <p sx={resultText}>
            Couldn't create playlist for <strong>{props.venueName}</strong>.
          </p>
        }
      </Flex>

      {!props.playlistLoading &&
        <Button
          sx={{
            variant: 'buttons.primary.outline',
            '&:hover': {
              variant: 'buttons.primary.outline.hover',
            },
            minWidth: '150px',
          }}
          onClick={() => props.handleCreatePlaylist(props.venueName)}
        >
          {props.playlistName ? 'Recreate Playlist' : 'Create Playlist'}
        </Button>
      }
      {props.playlistLoading &&
        <Spinner size={36} />
      }
    </Flex>
  )
};

export default Result;
