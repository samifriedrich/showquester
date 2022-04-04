from app import application
from flask import redirect, request
import pandas as pd
import spotipy
import spotipy.util as util
from spotipy.oauth2 import SpotifyClientCredentials
import os
import json
import requests
import datetime
from fuzzywuzzy import fuzz, process
from math import ceil as round_up
import logging
from logging.handlers import RotatingFileHandler

logger = logging.getLogger(__name__)
formatter = logging.Formatter('%(asctime)s %(levelname)s [%(filename)s:%(funcName)s:%(lineno)d] %(message)s')
logger.setLevel(logging.os.getenv('LOG_LEVEL')) # changed from hard-coded
handler = RotatingFileHandler(os.getenv('FLASK_LOG_FILE_PATH'), maxBytes=1000000,backupCount=5)
handler.setFormatter(formatter)
application.logger.addHandler(handler)

with open('/var/app/current/storage/secrets.json', 'r', encoding='utf-8') as j:
    content = (j.read())
    SECRETS = json.loads(content)

## API credentials from environmental variables
SONGKICK_API_KEY = SECRETS.get('SONGKICK_API_KEY')
CLIENT_ID = SECRETS.get('SPOTIFY_CLIENT_ID')
CLIENT_SECRET = SECRETS.get('SPOTIFY_CLIENT_SECRET')
SCOPE = 'playlist-modify-public'
REDIRECT_URI = "https://flaskapp-dev.us-east-1.elasticbeanstalk.com/callback"
API_BASE = 'https://accounts.spotify.com'
SHOW_DIALOG = True

## Routes

@application.route('/index')
@application.route('/')
def index():
    return "Welcome to ShowQuester."

@application.route("/venue", methods=['GET'])
def venue():
    logger.info('PROCESS: Searching for venue')
    venue_name = request.args.get('name')
    venue_city = request.args.get('city')
    venue_info = get_venue_info(venue_name, venue_city)
    if venue_info:
        logger.info(f'SUCCESS: venue_info \n {venue_info}')
        return {
            'success': True,
            'data': {
                'venue_id': venue_info.get('venue_id'),
                'venue_name': venue_info.get('name'),
                'venue_city': venue_info.get('city'),
            }
        }
    else:
        return {
            'success': False,
            'error': {
                'type': 404,
                'message': 'No venue found.'
            }
        }

@application.route("/playlist/create", methods=['GET'])
def create():
    venue_id = request.args.get('venue_id')
    logger.info(f'PROCESS: Create playlist endpoint initiated for venue id: {venue_id}')
    if venue_id:
        client_credentials_manager = SpotifyClientCredentials(CLIENT_ID, CLIENT_SECRET)
        sp_cc = spotipy.Spotify(client_credentials_manager=client_credentials_manager) 
        playlist_tracks = venue_tracklist(sp_cc, venue_id)
        playlist_tracks = playlist_tracks[0:5]
        logger.debug(f'playlist_tracks {playlist_tracks}')
        display_tracks = playlist_tracks[0:5]
        return {
            'success': True,
            'data': {
                'display_tracks': display_tracks,
                'playlist_tracks': playlist_tracks,
            }
        }
    return {
        'success': False,
    }

@application.route('/playlist/save', methods=['POST'])
def save_playlist():
    data = request.get_json()
    venue_id = data['venue_id']
    auth_url = f'{API_BASE}/authorize?client_id={CLIENT_ID}&response_type=code&redirect_uri={REDIRECT_URI}&scope={SCOPE}&show_dialog={SHOW_DIALOG}&state={venue_id}'
    return redirect(auth_url)

@application.route('/callback')
def callback():
    logger.debug(request)
    code = request.args.get('code')
    venue_id = request.args.get('state')
    auth_token_url = f"{API_BASE}/api/token"
    response = requests.post(auth_token_url, data={
                "grant_type":"authorization_code",
                "code":code,
                "redirect_uri":REDIRECT_URI,
                "client_id":CLIENT_ID,
                "client_secret":CLIENT_SECRET
                })
    response_body = response.json()
    logger.debug(response_body)
    access_token = response_body.get("access_token")
    sp = spotipy.Spotify(auth=access_token)
    playlist_uri = save_playlist_to_account(sp, venue_id)
    # showquester.com/success?playlist_uri=playlist_uri
    return f'Playlist created: {playlist_uri}.'
        
## Functions

def get_venue_info(venue_name=None, venue_city=None, venue_id=None):
    """Search for venue and retrieve info from Songkick.
    To handle duplicate venue names, this function will check that venue's city matches that entered in venues.csv""" 
    if venue_id is not None:
        req = f'https://api.songkick.com/api/3.0/venues/{venue_id}.json?apikey={SONGKICK_API_KEY}'
        response = requests.get(req)
        venue_obj = response.json()['resultsPage']['results']['venue']
        return venue_dict(venue_obj)
    elif venue_name is not None:
        req = f'https://api.songkick.com/api/3.0/search/venues.json?query={venue_name}&apikey={SONGKICK_API_KEY}'
        response = requests.get(req)
        num_results = response.json()['resultsPage']['totalEntries']
        if num_results > 0:
            results = response.json()['resultsPage']['results']['venue']
            for venue_obj in results:
                result_city = venue_obj['city']['displayName']
                if result_city == venue_city:
                    return venue_dict(venue_obj)
                else:
                    continue
    else:
        logger.info(f'No venue found for {venue_name} in {venue_city}.')
        
def venue_dict(venue_obj):
    """Extract relevant fields from Songkick venue object"""
    venue_info = {'venue_id': venue_obj.get('id'),
              'name': venue_obj.get('displayName'),
              'city': venue_obj.get('city', {}).get('displayName'),
              'state': venue_obj.get('city', {}).get('state', {}).get('displayName'),
              'country': venue_obj.get('city', {}).get('country', {}).get('displayName'),
              'website': venue_obj.get('website')
             }
    return venue_info

def get_venue_events(venue_id):
    """Returns a list of upcoming event objects from Songkick for a given venue."""
    logger.info('PROCESS: Running get_venue_events')
    req = f'https://api.songkick.com/api/3.0/venues/{venue_id}/calendar.json?apikey={SONGKICK_API_KEY}'
    response = requests.get(req)
    num_results_per_page = response.json()['resultsPage']['perPage']
    total_num_results = response.json()['resultsPage']['totalEntries']
    if total_num_results > num_results_per_page:
        num_results_pages = round_up(total_num_results/num_results_per_page)
        venue_events = response.json()['resultsPage']['results']['event']
        for page_num in range(2, num_results_pages+1):
            req = f'https://api.songkick.com/api/3.0/venues/{venue_id}/calendar.json?apikey={SONGKICK_API_KEY}&page={page_num}'
            response = requests.get(req)
            page_events = response.json()['resultsPage']['results']['event']
            venue_events.extend(page_events)
    else:
        venue_events = response.json()['resultsPage']['results'].get('event')
    if venue_events is not None:
        logger.info('SUCCESS: Venue events found')    
        return venue_events
    else:
        logger.info("ERROR: No events found for this venue.")

def events_df(event_list, limit=None):
    """Creates a dataframe out of Songkick events results.
    Excludes events flagged on Songkick as 'cancelled'."""
    dates = []
    artists = []
    ids = []
    for event in event_list:
        status = event['status']
        cancelled = status == "cancelled"
        if not cancelled:
            performance = event['performance']
            num_performers = len(performance)
            for artist in performance:
                artists.append(artist['displayName'])
                ids.append(artist['id'])
            event_date = event['start']['date']
            dates.extend([event_date] * num_performers)
    if isinstance(limit, int): 
        dates = dates[0:limit]
        artists = artists[0:limit]
        ids = ids[0:limit]
    return pd.DataFrame(data={'artist':artists, 'date':dates, 'artist_id':ids})

def get_artist(sp, search_str):
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

def get_top_track(sp, artist_uri):
    """Return top track uri for a given artist on Spotify."""
    results = sp.artist_top_tracks(artist_uri)
    top_tracks = results['tracks']
    top_track = []
    if top_tracks:
        for track in top_tracks:
            album_artist = track['album']['artists'][0]['uri']
            if album_artist == artist_uri:
                top_track = track['uri']
                return top_track
            else:
                continue
        if not top_track:
            top_track_uri = top_tracks[0]['uri']
            logger.info(f"SPOTIFY-CHECK: Check {artist_uri}'s top track: {top_track_uri}")
            return top_track_uri
    else:
        artist_name = sp.artist(artist_uri)['name']
        logger.info(f'SPOTIFY-CHECK: No tracks found for {artist_name}')
        
def show_list(venue_id):
    """Retrieves Songkick show data for a venue. Returns a pandas dataframe"""
    event_list = get_venue_events(venue_id)
    showlist = events_df(event_list)
    return showlist
        
def artist_list(sp, showlist):
    """Compiles list of Spotify artist objects based on showlist."""
    artist_list = list(showlist.artist)
    artist_list = list(process.dedupe(artist_list, threshold=99, scorer=fuzz.token_sort_ratio))
    artist_obj = []
    for artist in artist_list:
        artist_obj.append(get_artist(sp, artist))
    return artist_obj
        
def build_tracklist(sp, artist_obj): 
    """Pulls top track for each artist in list of Spotify artist objects"""
    playlist_tracks = []
    for artist in artist_obj:
        if artist is not None:
            artist_uri = artist['uri']
            track = get_top_track(sp, artist_uri)
            playlist_tracks.append(track)
    playlist_tracks = list(filter(None, playlist_tracks))
    return playlist_tracks

def venue_tracklist(sp, venue_id):
    """Generates list of Spotify tracks fron Songkick venue id"""
    showlist = show_list(venue_id)
    artists = artist_list(sp, showlist)
    playlist_tracks = build_tracklist(sp, artists)
    return(playlist_tracks)
    
def chunks(lst, n):
    """Yield successive n-sized chunks from lst."""
    for i in range(0, len(lst), n):
        yield lst[i:i + n]
        
def add_tracks(sp, playlist_id, playlist_tracks):
    """Batches the provided list of tracks and addes them to a user's playlist"""
    track_batches = list(chunks(playlist_tracks, 100))
    username = sp.me()['id']
    for batch_num, track_uris in enumerate(track_batches):
        if batch_num == 0:
            results = sp.user_playlist_replace_tracks(username, playlist_id, track_uris)
        else:
            results = sp.user_playlist_add_tracks(username, playlist_id, track_uris)
    return results

def build_playlist_description(venue_id):
    """Create description for ShowQuester playlist."""
    venue_info = get_venue_info(venue_id=venue_id)
    venue_name = venue_info.get('name')
    venue_city = venue_info.get('city')
    venue_website = venue_info.get('website')
    todays_date = datetime.date.today()
    description = f"A ShowQuester playlist featuring artists coming soon to {venue_name} in {venue_city}. Updated {todays_date}. Ordered by date, with this week up top and events farther in the future at the bottom. Go to {venue_website} for more info."
    return description

def update_playlist_details(sp, playlist_id, playlist_name, playlist_description):
    """Updates playlist details.
    NOTE: There are several reports of issues when updating playlist descriptions in the Spotify community.
    Currently, it seems the only solution is to wait for the server to update, which could take a day."""
    username = sp.me()['id']
    results = sp.user_playlist_change_details(
            username, playlist_id=playlist_id, name=playlist_name, description=playlist_description)
    return results

# CURRENTLY NOT USED, will implement for cases where user wants to update a preexisting playlist on their account
def get_my_public_playlists(sp):
    """Returns a dictionary of public playlist names (keys) and their uri's (values) for the given username."""
    my_playlists = {}
    username = sp.me()['id']
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

def name_playlist(venue_id):
    """Constructs ShowQuester playlist name text"""
    venue_info = get_venue_info(venue_id=venue_id)
    venue_name = venue_info.get('name')
    venue_city = venue_info.get('city')
    playlist_name = f"ShowQuester: {venue_name} in {venue_city}"  # Note: duplicate names do not seem to be an issue for Spotify
    logger.debug(playlist_name)
    return playlist_name

def save_playlist_to_account(sp, venue_id):
    """Create an empty Showquester playlist on Spotify for a given venue"""
    playlist_tracks = venue_tracklist(sp, venue_id)
    playlist_name = name_playlist(venue_id)
    username = sp.me()['id']
    results = sp.user_playlist_create(username, playlist_name, public=True)
    playlist_uri = results['uri']
    playlist_id = playlist_uri.split(':')[2]
    results = add_tracks(sp, playlist_id, playlist_tracks)
    playlist_description = build_playlist_description(venue_id)
    results = update_playlist_details(sp, playlist_id, playlist_name, playlist_description)
    logger.info(f'Created playlist "{playlist_name}"')
    return playlist_uri

if __name__ == "__main__":
    application.run(debug=True)
