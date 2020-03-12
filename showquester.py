#!/usr/bin/env python
# coding: utf-8

## Load libraries
import os
import spotipy
import spotipy.util as util
import requests
import pandas as pd
import datetime
from dotenv import load_dotenv
from fuzzywuzzy import fuzz
from fuzzywuzzy import process
from math import ceil as round_up


## Functions

def get_venue_id(venue_name, venue_city): 
    """Search for venue and retrieve id on Songkick.
    
    To handle duplicate venue names, this function will check that venue's city matches that entered in venues.csv"""
    req = f'https://api.songkick.com/api/3.0/search/venues.json?query={venue_name}&apikey={sk_api_key}'
    response = requests.get(req)
    num_results = response.json()['resultsPage']['totalEntries']

    if num_results > 0:
        results = response.json()['resultsPage']['results']['venue']
        for hit in results:
            result_city = hit['city']['displayName']
            if result_city == venue_city:
                venue_id = hit['id']
                displayName = hit['displayName']
                print(f'Found {venue_name} in {venue_city}, {venue_state} on Songkick')
                return venue_id
                break
            else:
                continue
    else:
        print(f'No venue found for {venue_name} in {venue_city}.')

def get_venue_events(venue_id):
    """Returns a list of upcoming event objects from Songkick for a given venue."""
    req = f'https://api.songkick.com/api/3.0/venues/{venue_id}/calendar.json?apikey={sk_api_key}'
    response = requests.get(req)
    num_results_per_page = response.json()['resultsPage']['perPage']
    total_num_results = response.json()['resultsPage']['totalEntries']
    if total_num_results > num_results_per_page:
        num_results_pages = round_up(total_num_results/num_results_per_page)
        venue_events = response.json()['resultsPage']['results']['event']
        for page_num in range(2, num_results_pages+1):
        # get subsequent pages of results
            req = f'https://api.songkick.com/api/3.0/venues/{venue_id}/calendar.json?apikey={sk_api_key}&page={page_num}'
            response = requests.get(req)
            page_events = response.json()['resultsPage']['results']['event']
            venue_events.extend(page_events)
    else:
        venue_events = response.json()['resultsPage']['results']['event']

    return venue_events


def events_df(event_list):
    """Creates a dataframe out of Songkick events results"""
    dates = []
    artists = []
    ids = []
    for event in event_list:
        performance = event['performance']
        num_performers = len(performance)
        for artist in performance:
            artists.append(artist['displayName'])
            ids.append(artist['id'])
        event_date = event['start']['date']
        dates.extend([event_date] * num_performers)
        
    return pd.DataFrame(data={'artist':artists, 'date':dates, 'artist_id':ids})

def get_my_public_playlists(username):
    """Returns a dictionary of public playlist names (keys) and their uri's (values) for the given username."""
    my_playlists = {}
    results = sp.user_playlists(username)

    while results:
        for playlist in results['items']:
            if playlist['public']:
                my_playlists[playlist['name']] = playlist['uri']
        if results['next']:
            results = sp.next(results)
        else:
            results = None
    return my_playlists


def create_sq_playlist(venue_name, venue_city, venue_state): 
    """Create an empty Showquester playlist on Spotify for a given venue"""
    playlist_name = f"ShowQuester: {venue_name} ({venue_city}, {venue_state})"
    results = sp.user_playlist_create(username, playlist_name, public=True)
    playlist_uri = results['uri']
    print(f'Created playlist "{playlist_name}"')
    return [playlist_name, playlist_uri]


def get_artist(search_str):
    """Search for an artist on Spotify and return artist object if found.
    
    Uses fuzzywuzzy's process.extractOne convenience function to parse search results for best match."""
    results = sp.search(search_str,type='artist')

    if results['artists']['total'] > 0:
        items = results['artists']['items']
        hits = {}
        for artist in items:
            hits[artist['uri']] = artist['name']

        best_hit = process.extractOne(search_str, hits)
        best_hit_uri = best_hit[2]
        artist_obj = sp.artist(best_hit_uri)
        return artist_obj
    else:
        print(f'\t\"{search_str}\" was not found on Spotify.')
        return None

        
def get_top_track(artist_uri):
    """Return top track uri for a given artist on Spotify."""
    results = sp.artist_top_tracks(artist_uri)
    top_tracks = results['tracks']
    top_track = []
    if top_tracks:
        for track in top_tracks:
            # find first top track on an album primarily credited to artist
            album_artist = track['album']['artists'][0]['uri']
            if album_artist == artist_uri:
                top_track = track['uri']
                return top_track
                break
            else:
                continue
        if not top_track:
            top_track_uri = top_tracks[0]['uri']
            print(f"\tCheck {artist_uri}'s top track: {top_track_uri}")
            return top_track_uri
    else:
        artist_name = sp.artist(artist_uri)['name']
        print(f'\tNOT FOUND: No tracks found for {artist_name}')

def chunks(lst, n):
    """Yield successive n-sized chunks from lst."""
    for i in range(0, len(lst), n):
        yield lst[i:i + n]

def build_playlist_description(venue_name, venue_url, venue_city, venue_state):
    """Create description for ShowQuester playlist."""
    todays_date = datetime.date.today()
    github_url = "https://github.com/samifriedrich/showquester"
    descr = f"A programmatically-generated playlist featuring artists coming soon to {venue_name} in {venue_city}, {venue_state}. Updated {todays_date}. Ordered by date, with this week up top and events farther in the future at the bottom. Go to https://www.songkick.com/ for tickets and {venue_url} for more info. Check out my GitHub for details on how this playlist is generated: https://github.com/samifriedrich/showquester/"
    return descr

def update_playlist_details(playlist_id, playlist_name, playlist_descr): 
    """Updates playlist details.
    
    NOTE: There are several reports of issues when updating playlist descriptions in the Spotify community.
    Currently, it seems the only solution is to wait for the server to update, which could take a day."""
    results = sp.user_playlist_change_details(
            username, playlist_id=playlist_id, name=playlist_name, description=playlist_descr)
    #print(f'Updated playlist "{playlist_name}"')
    return results
   

# Read in csv file containing venue info
venue_info = pd.read_csv('venues.csv')
venue_info = venue_info[:3]


## Set API authorization keys
# access .bash_profile from inside virtualenv
load_dotenv()
# Songkick API
sk_api_key = os.environ.get('SONGKICK_API_KEY')

# set Spotify API authorization vars and scope
client_id = os.environ.get('SPOTIFY_CLIENT_ID')
client_secret = os.environ.get('SPOTIFY_CLIENT_SECRET')
username = os.environ.get('SPOTIFY_USERNAME')
scope = 'playlist-modify-public'

# retrieve Spotify authentication token
token = util.prompt_for_user_token(
        username=username,
        scope=scope,
        client_id=client_id,
        client_secret=client_secret,
        redirect_uri='http://localhost/')

sp = spotipy.Spotify(auth=token)


## Main loop to build playlists
for idx, row in venue_info.iterrows():
    venue_name = row.venue_name
    venue_url = row.url
    venue_city, venue_state = row.location.split(', ')
    print(f"*****************{venue_name}*******************")
    venue_id = get_venue_id(venue_name, venue_city)
    
    if venue_id:
        event_list = get_venue_events(venue_id)
        shows = events_df(event_list)
        artist_list = list(shows.artist)
        # remove exact duplicates from list of artists
        artist_list = list(process.dedupe(artist_list, threshold=99, scorer=fuzz.token_sort_ratio))
        
        my_playlists = get_my_public_playlists(username)
        # search playlists for a SoundQuester venue playlist
        venue_playlist = [(name, uri) for name, uri in my_playlists.items() if venue_name in name]

        if venue_playlist:
            playlist_name, playlist_uri = venue_playlist[0]
            print(f'Found ShowQuester playlist for {venue_name} named "{playlist_name}"')
        else:
        # if venue playlist missing, create new SoundQuester playlist
            print(f'No playlist found for "{venue_name}"')
            playlist_name, playlist_uri = create_sq_playlist(venue_name, venue_city, venue_state)
        
        # derive playlist_id from playlist_uri
        playlist_id = playlist_uri.split(':')[2]
        
        # retrieve all artist objects for performing artists
        artist_obj = []
        print("...SEARCHING Spotify for ARTISTS...")
        for artist in artist_list:
            artist_obj.append(get_artist(artist))
        
        # pull one top track per artist to be added to playlist
        tracks_to_add = []
        print("...SEARCHING Spotify for TOP TRACKS...")
        for artist in artist_obj:
            if artist is not None:
                artist_uri = artist['uri']
                track = get_top_track(artist_uri)
                tracks_to_add.append(track)
                
        # filter out empty strings where no track was found
        tracks_to_add = list(filter(None, tracks_to_add))
        # batch tracks into 100's to respect Spotify Web API limits
        track_batches = list(chunks(tracks_to_add, 100))
        
        print('...UPDATING SHOWQUESTER PLAYLIST TRACKS...')
        for i in range(0,len(track_batches)):  
            track_uris = track_batches[i]
            if i == 0:
            # if first batch, replace playlist with first batch of tracks
                if token:
                    sp = spotipy.Spotify(auth=token)
                    sp.trace = False
                    result = sp.user_playlist_replace_tracks(username, playlist_id, track_uris)
            else:
            # if not first batch, add to playlist instead of replacing
                if token:
                    sp = spotipy.Spotify(auth=token)
                    sp.trace = False
                    results = sp.user_playlist_add_tracks(username, playlist_id, track_uris)
        
        print('...UPDATING SHOWQUESTER PLAYLIST DESCRIPTION...')
        playlist_descr = build_playlist_description(venue_name, venue_url, venue_city, venue_state)
        results = update_playlist_details(playlist_id, playlist_name, playlist_descr)
        
        print(f"COMPLETED: {venue_name}\n\n")
