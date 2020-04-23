/** @jsx jsx */
import { jsx, Box, Flex, Spinner } from 'theme-ui'
import { useState, useEffect, Dispatch, SetStateAction } from 'react'
import useSWR from 'swr'

import { Venue } from '../../components/Search/Search'
import fetcher, { POST } from '../../utils/fetcher'
import Layout from '../../components/Layout/Layout'
import Search from '../../components/Search/Search'
import VenueResult from '../../components/VenueResult/VenueResult'
import * as styles from './home.styles'

const VENUE_SEARCH_URL: string = process.env.VENUE_SEARCH_URL as string;
const CREATE_PLAYLIST_URL: string = process.env.CREATE_PLAYLIST_URL as string;

const SPOTIFY_AUTH_URL: string = 'https://accounts.spotify.com/authorize';
const REDIRECT_URL: string = process.env.REDIRECT_URL as string;
const SPOTIFY_CLIENT_ID: string = process.env.SPOTIFY_CLIENT_ID as string;
const SCOPES: string[] = [
  'user-read-email',
  'playlist-read-collaborative',
  'playlist-modify-public',
  'playlist-read-private',
  'playlist-modify-private'
];

const Home: React.FC = () => {

  const state: number = Math.floor(Math.random() * Math.floor(999999));
  const authUrl: string = `${SPOTIFY_AUTH_URL}?client_id=${SPOTIFY_CLIENT_ID}&response_type=code&redirect_uri=${REDIRECT_URL}&state=${state}&scope=${SCOPES.join(' ')}`;

  const [venueSearchParams, setVenueSearchParams]: any = useState(null);
  const [playlistName, setPlaylistName]: [string, Dispatch<SetStateAction<string>>] = useState('');
  const [playlistLoading, setPlaylistLoading]: [boolean, Dispatch<SetStateAction<boolean>>] = useState(false as boolean);
  const [playlistError, setPlaylistError]: [boolean, Dispatch<SetStateAction<boolean>>] = useState(false as boolean);
  const [authToken, setAuthToken]: [string, Dispatch<SetStateAction<string>>] = useState('');
  const [authError, setAuthError]: [boolean, Dispatch<SetStateAction<boolean>>] = useState(false as boolean);

  const { data: venueData, error: venueError }: any = useSWR(
    venueSearchParams
    ? `${VENUE_SEARCH_URL}?name=${venueSearchParams.name}&location=${venueSearchParams.location}`
    : null,
    fetcher
  );

  useEffect(() => {
    if (process.browser) {
      const name = sessionStorage.getItem('venueName');
      const location = sessionStorage.getItem('venueLocation');

      if (name && location && !venueSearchParams) {
        setVenueSearchParams({
          name,
          location,
        })
      } else if (venueSearchParams) {
        sessionStorage.setItem('venueName', venueSearchParams.name);
        sessionStorage.setItem('venueLocation', venueSearchParams.location);
      }
    }
  }, [venueSearchParams])

  useEffect(() => {
    if (process.browser) {
      let token = localStorage.getItem('spToken');

      if (!token) {
        const params = new URLSearchParams(window.location.search);
        if (params.get('error')) { setAuthError(true); return; }
        token = params.get('code');

        if (token) {
          setAuthToken(params.get('code') as string);
          localStorage.setItem('spToken', token);
        }
      } else {
        setAuthToken(token);
      }
    }
  }, [authToken])

  const handleVenueSearch = async (venue: Venue): Promise<void> => {
    setPlaylistName('');
    setVenueSearchParams(venue);
  }

  const handleCreatePlaylist = async (venueName: string, venueLocation: string): Promise<void> => {
    setPlaylistLoading(true);
    setPlaylistError(false);

    try {
      const playlistData = await POST(CREATE_PLAYLIST_URL, {body: {venueName, venueLocation, token: authToken}});
      if (!playlistData || playlistData.status >= 300 || playlistData.error) { throw playlistData.error || Error; }
      setPlaylistName(playlistData.playlist_name);
    } catch (error) {
      setPlaylistError(true);
    } finally {
      setPlaylistLoading(false);
      if (process.browser) {
        sessionStorage.clear();
      }
    }
  }

  return (
    <Layout>
      <div sx={styles.homeContainer}>
        <Flex sx={styles.flexContainer}>
          <Box>
            <h1 sx={styles.logoHeader}>
              ShowQuester
            </h1>
          </Box>

          <Search handleVenueSearch={handleVenueSearch} />

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

          {authError && !venueError && venueData &&
            <Flex sx={styles.errorContainer}>
              Sorry, we couldn't log in to Spotify.&nbsp;<a href="/">Start fresh.</a>
            </Flex>
          }

          {!authError && !venueError && venueData &&
            <VenueResult
              authToken={authToken}
              authUrl={authUrl}
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
