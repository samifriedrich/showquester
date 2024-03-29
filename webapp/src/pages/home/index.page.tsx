/** @jsx jsx */
import { jsx, Box, Flex, Spinner } from 'theme-ui'
import { useState } from 'react'
import useSWR from 'swr'

import * as styles from './home.styles';
import Layout from '../../components/Layout/Layout'
import Search, { Venue } from '../../components/Search/Search'
import VenueResult from '../../components/VenueResult/VenueResult'
import useFetch, { HTTPVerbs } from '../../utils/useFetch';
import Playlist from '../../components/Playlist/Playlist';

const VENUE_SEARCH_URL: string = '/api/searchVenue';
const CREATE_PLAYLIST_URL: string = '/api/createPlaylist';
const SAVE_PLAYLIST_URL: string = '/api/savePlaylist';

interface PlaylistData {
  data: {
    playlist_tracks: string[];
    display_tracks: string[];
  }
}

const Home: React.FC = () => {
  const [venue, setVenue]: any = useState(null);
  const [displayTracks, setDisplayTracks] = useState([] as string[]);
  const [playlistTracks, setPlaylistTracks] = useState([] as string[]);

  const {
    request: searchVenue,
  } = useFetch();

  const { data: venueData, error: venueError }: any = useSWR(
    venue
    ? `${VENUE_SEARCH_URL}?name=${venue.name}&city=${venue.city}`
    : null,
    searchVenue,
    {
      errorRetryCount: 0,
      shouldRetryOnError: false,
      revalidateOnFocus: false,
    }
  );

  const handleVenueSearch = async (venue: Venue): Promise<void> => {
    setVenue(venue);
    setDisplayTracks([])
    setPlaylistTracks([])
  }

  const {
    request: createPlaylist,
    loading: playlistLoading,
    error: playlistError,
  } = useFetch();

  const handleCreatePlaylist = async (venueId: string): Promise<void> => {
    const { data } = await createPlaylist(
      CREATE_PLAYLIST_URL,
      HTTPVerbs.POST,
      { venueId }
    ) as unknown as PlaylistData;

    setDisplayTracks(data.display_tracks);
    setPlaylistTracks(data.playlist_tracks);
  };

  const {
    request: savePlaylist,
    loading: saveLoading,
    error: saveError,
  } = useFetch();

  const handleSavePlaylist = async (venueId: string): Promise<void> => {
    await savePlaylist(SAVE_PLAYLIST_URL, HTTPVerbs.POST, { venueId, tracks: playlistTracks });
  };

  return (
    <Layout>
      <div sx={styles.homeContainer}>
        <Flex sx={styles.flexContainer}>
          <Box>
            <h1 sx={styles.logoHeader}>
              ShowQuester
            </h1>
          </Box>

          <Search
            handleVenueSearch={
              handleVenueSearch
            }
          />

          {venueError && 
            <Flex sx={styles.errorContainer}>
              Couldn't find venue, please try a different name or location.
            </Flex>
          }

          {!venueError && venue && !venueData &&
            <Flex sx={styles.resultContainer}>
              Searching for&nbsp;
              <strong>{venue.name}</strong>
              &nbsp;&nbsp;&nbsp;&nbsp;
              <Spinner size={36} />
            </Flex>
          }

          {!venueError && venueData?.data && displayTracks.length === 0 &&
            <VenueResult
              venueId={venueData.data.venue_id}
              venueName={venueData.data.venue_name}
              venueLocation={venueData.data.venue_city}
              playlistLoading={playlistLoading}
              playlistError={!!playlistError}
              handleCreatePlaylist={handleCreatePlaylist}
            />
          }

          {displayTracks.length > 0 &&
            <Playlist
              venueId={venueData.data.venue_id}
              displayTracks={displayTracks}
              saveLoading={saveLoading}
              saveError={!!saveError}
              handleSavePlaylist={handleSavePlaylist}
            />
          }
        </Flex>
      </div>
    </Layout>
  );
};

export default Home;
