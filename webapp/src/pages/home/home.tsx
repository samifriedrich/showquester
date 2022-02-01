/** @jsx jsx */
import { jsx, Box, Flex, Spinner } from 'theme-ui'
import { useState, useEffect, Dispatch, SetStateAction } from 'react'
import useSWR from 'swr'

import { Venue } from '../../components/Search/Search'
import fetcher from '../../utils/fetcher'
import Layout from '../../components/Layout/Layout'
import Search from '../../components/Search/Search'
import VenueResult from '../../components/VenueResult/VenueResult'
import useFetch, { HTTPVerbs } from '../../utils/useFetch';
import * as styles from './home.styles'

const VENUE_SEARCH_URL: string = '/api/searchVenue';
const CREATE_PLAYLIST_URL: string = '/api/createPlaylist';
const SAVE_PLAYLIST_URL: string = '/api/savePlaylist';

const Home: React.FC = () => {
  const [venueSearchParams, setVenueSearchParams]: any = useState(null);
  const [playlistName, setPlaylistName]: [string, Dispatch<SetStateAction<string>>] = useState('');
  const [playlistLoading, setPlaylistLoading]: [boolean, Dispatch<SetStateAction<boolean>>] = useState(false as boolean);
  const [playlistError, setPlaylistError]: [boolean, Dispatch<SetStateAction<boolean>>] = useState(false as boolean);

  const { data: venueData, error: venueError }: any = useSWR(
    venueSearchParams
    ? `${VENUE_SEARCH_URL}?name=${venueSearchParams.name}&location=${venueSearchParams.location}`
    : null,
    fetcher,
    {
      errorRetryCount: 0,
      shouldRetryOnError: false,
      revalidateOnFocus: false,
    }
  );

  useEffect(() => {
    if (process.browser) {
      const name = sessionStorage.getItem('venueName');
      const location = sessionStorage.getItem('venueLocation');

      if (name && location && !venueSearchParams) {
        setVenueSearchParams({
          name,
          location,
        });
      } else if (venueSearchParams) {
        sessionStorage.setItem('venueName', venueSearchParams.name);
        sessionStorage.setItem('venueLocation', venueSearchParams.location);
      }
    }
  }, [venueSearchParams])

  const handleVenueSearch = async (venue: Venue): Promise<void> => {
    setPlaylistName('');
    setVenueSearchParams(venue);
  }

  const {
    request: createPlaylist,
    // loading,
    // success,
  } = useFetch();

  const {
    request: savePlaylist,
    // loading,
    // success,
  } = useFetch();

  const handleCreatePlaylist = async (venueId: string): Promise<void> => {
    setPlaylistLoading(true);
    setPlaylistError(false);
    const trackData = await createPlaylist(CREATE_PLAYLIST_URL, HTTPVerbs.POST, { venueId });
    // @ts-ignore
    console.log(trackData.data.playlist_tracks);
    // @ts-ignore
    const tracks = trackData.data.playlist_tracks;
    await savePlaylist(SAVE_PLAYLIST_URL, HTTPVerbs.POST, { venueId, tracks });
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

          {!venueError && venueSearchParams && !venueData &&
            <Flex sx={styles.resultContainer}>
              Searching for&nbsp;
              <strong>{venueSearchParams.name}</strong>
              &nbsp;&nbsp;&nbsp;&nbsp;
              <Spinner size={36} />
            </Flex>
          }

          {!venueError && venueData?.data &&
            <VenueResult
              venueId={venueData.data.venue_id}
              venueName={venueData.data.venue_name}
              venueLocation={venueData.data.venue_city}
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
