/** @jsx jsx */
import { jsx, Box, Flex, Spinner } from 'theme-ui'
import { useState } from 'react';
import useSWR from 'swr'

import fetcher, { POST } from '../lib/fetcher'
import Layout from '../components/Layout/Layout'
import Search from '../components/Search/Search'
import VenueResult from '../components/VenueResult/VenueResult'

const VENUE_SEARCH_URL: string = 'http://localhost:3000/api/exampleVenueSearch';
const CREATE_PLAYLIST_URL: string = 'http://localhost:3000/api/exampleCreatePlaylist';

const Home = () => {

  const [venueSearchParams, setVenueSearchParams]: any = useState(null);
  const [playlistName, setPlaylistName]: any = useState('');
  const [playlistLoading, setPlaylistLoading]: any = useState(false);
  const [playlistError, setPlaylistError]: any = useState(false);

  const { data: venueData, error: venueError }: any = useSWR(
    venueSearchParams ? `${VENUE_SEARCH_URL}?name=${venueSearchParams.name}&location=${venueSearchParams.location}` : null,
    fetcher
  );

  const handleCreatePlaylist = async (venueName: string) => {
    setPlaylistLoading(true);
    setPlaylistError(false);
    try {
      const playlistData = await POST(CREATE_PLAYLIST_URL, {body: {venueName}});
      setPlaylistName(playlistData.playlist_name);
    } catch (error) {
      setPlaylistError(true);
    } finally {
      setPlaylistLoading(false);
    }
  }

  return (
    <Layout>
      <div
        sx={{
          mt: ['5vh', '25vh'],
          mx: 'auto',
        }}
      >
        <Flex
          sx={{
            'flexDirection': ['column'],
            'alignItems': ['center'],
          }}
        >
          <Box>
            <h1
              sx={{
                fontSize: [6, 7],
                color: 'primary',
              }}
            >
              ShowQuester
            </h1>
          </Box>

          <Search handleVenueSearch={setVenueSearchParams} />

          {venueError && 
            <Flex
              sx={{
                my: '6',
                px: '5',
                py: '4',
                variant: 'borders.muted',
              }}
            >
              Couldn't find venue, please try a different name or location.
            </Flex>
          }
          {!venueError && venueSearchParams && !venueData &&
            <Flex
              sx={{
                my: '6',
                px: '5',
                py: '4',
                variant: 'borders.muted',
                'alignItems': ['center'],
              }}
            >
              Searching for&nbsp;
              <strong>{venueSearchParams.name}</strong>
              &nbsp;&nbsp;&nbsp;&nbsp;
              <Spinner size={36} />
            </Flex>
          }
          {!venueError && venueData &&
            <VenueResult
              venueName={venueData.name}
              venueLocation={venueData.location}
              playlistName={playlistName}
              playlistLoading={playlistLoading}
              playlistError={playlistError}
              handleCreatePlaylist={handleCreatePlaylist}
            />
          }
        </Flex>
      </div>
    </Layout>
  );
};

export default Home;
