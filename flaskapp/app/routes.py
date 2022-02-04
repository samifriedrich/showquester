from app import app
from flask import redirect, request, make_response, session, redirect, abort
import pandas as pd
import spotipy
import spotipy.util as util
from spotipy.oauth2 import SpotifyClientCredentials
import os
import requests
import datetime
import time
import base64
from fuzzywuzzy import fuzz, process
from math import ceil as round_up

## Globals
## Set API authorization keys
# Songkick API
sk_api_key = os.environ.get('SONGKICK_API_KEY')
# set Spotify API authorization vars and scope
CLIENT_ID = os.environ.get('SPOTIFY_CLIENT_ID')
CLIENT_SECRET = os.environ.get('SPOTIFY_CLIENT_SECRET')
CLIENT_USERNAME = os.environ.get('SPOTIFY_USERNAME')
SQ_USERNAME = "31t6b6anet3tfqfl2vaq2wvtjwzi"
SCOPE = 'playlist-modify-public'
# REDIRECT_URL must be listed on ShowQuester dashboard on Spotify for Developers
REDIRECT_URI = "http://127.0.0.1:5000/callback"
API_BASE = 'https://accounts.spotify.com'
SHOW_DIALOG = True

# This will become first
# setting a single venue for testing
venue_name = "Mississippi Studios"
venue_url = "https://mississippistudios.com/"
venue_city = "Portland"
# will need to make state conditional, see jupyter notebook
venue_id = '5776'


## Routes

# "Landing page" endpoint for flask app
@app.route('/index')
@app.route('/')
def index():
    return "Welcome to ShowQuester. Go to http://127.0.0.1:5000/auth?playlist_id=123456 endpoint to begin."

@app.route("/venue", methods=['GET'])
def venue():
    venue_name = request.args.get('name')
    #venue_name = "Mississipp Studios"  # uncomment for testing
    venue_city = request.args.get('location')
    #venue_city = "Portland"   # uncomment for testing 
    venue_info = get_venue_id(venue_name, venue_city)
    if venue_info:
        # session['venue_info'] = venue_info
        # print(session['venue_info']['venue_name'])
        return {
            'success': True,
            'data': {
                'venue_id': venue_id,
                'venue_name': venue_name,
                'venue_city': venue_city,
            }
        }
    else:
        # abort(404)
        return {
            'success': False,
            'error': {
                'type': 404,
                'message': 'No venue found.'
            }
        }

# Create tracklist for venue       
@app.route("/playlist/create", methods=['GET'])
def create():
    venue_id = request.args.get('venue_id')
    print(venue_id)
    # print('********')
    # print(session)
    # venue_id = session['venue_info']['venue_id']
    # venue_id = '5776'  # Mississippi Studios
    # Client Credentials flow via spotipy (no user login required)
    client_credentials_manager = SpotifyClientCredentials()
    sp_cc = spotipy.Spotify(client_credentials_manager=client_credentials_manager)
    if venue_id:
        print('*** creating playlist ***')
        event_list = get_venue_events(venue_id)
        shows = events_df(event_list)
        artist_list = list(shows.artist)
        artist_list = list(process.dedupe(artist_list, threshold=99, scorer=fuzz.token_sort_ratio))
        artist_obj = []
        for artist in artist_list:
            artist_obj.append(get_artist(artist, sp=sp_cc))
        pl_tracks = []
        for artist in artist_obj:
            if artist is not None:
                artist_uri = artist['uri']
                track = get_top_track(artist_uri, sp=sp_cc)
                pl_tracks.append(track)
        pl_tracks = list(filter(None, pl_tracks))  # filter out empty strings where no track was found
        display_tracks = pl_tracks[0:100] # trim to 100
        # session["display_tracks"] = display_tracks
        # session["playlist_tracks"] = pl_tracks
        return {
            'success': True,
            'data': {
                'display_tracks': display_tracks,
                'playlist_tracks': pl_tracks,
            }
        }
    return {
        'success': False,
    }

# Authorization-code-flow Step 1.
# ShowQuester requests permission from user.
# User is taken to Spotify login page via auth_url
# User logs into Spotify to authorize access
@app.route('/playlist/save', methods=['POST'])
def save_playlist():
    # get data from POST request
    data = request.get_json()
    venue_id = data['venue_id']
    # auth with spotify
    auth_url = f'{API_BASE}/authorize?client_id={CLIENT_ID}&response_type=code&redirect_uri={REDIRECT_URI}&scope={SCOPE}&show_dialog={SHOW_DIALOG}&state={venue_id}'
    return redirect(auth_url)

# authorization-code-flow Step 2.
# Showquester requests refresh and access tokens;
# Spotify returns access and refresh tokens
@app.route('/callback')
def callback():
    print(request)
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
    print(response_body)
    access_token = response_body.get("access_token")
    sp = spotipy.Spotify(auth=access_token)
    results = create_sq_playlist(sp)
    playlist_uri = results['playlist_uri']
    # showquester.com/success?playlist_uri=playlist_uri
    return f'Playlist created.'

# Authorization-code-flow Step 3.
# Use the access token to access the Spotify Web API;
# Spotify returns requested data
# @app.route('/playlist/save')
# def save_playlist():
#     sp = spotipy.Spotify(auth=session['access_token'])
#     results = create_sq_playlist(sp) 
#     print(results)
#     return "Playlist saved to user's account."
        
## Functions
# Checks to see if token is valid and gets a new token if not
# CURRENTLY NOT UTILIZED BY AUTH FLOW
def get_token(session):
    token_valid = False
    token_info = session.get("token_info", {})

    # Checking if the session already has a token stored
    if not (session.get('token_info', False)):
        token_valid = False
        return token_info, token_valid

    # Checking if token has expired
    now = int(time.time())
    is_token_expired = session.get('token_info').get('expires_at') - now < 60

    # Refreshing token if it has expired
    if (is_token_expired):
        # Don't reuse a SpotifyOAuth object because they store token info and you could leak user tokens if you reuse a SpotifyOAuth object
        sp_oauth = spotipy.oauth2.SpotifyOAuth(client_id = CLIENT_ID, client_secret = CLIENT_SECRET, redirect_uri = REDIRECT_URI, scope = SCOPE)
        token_info = sp_oauth.refresh_access_token(session.get('token_info').get('refresh_token'))

    token_valid = True
    return token_info, token_valid

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
                sk_venue_name = hit['displayName']
                venue_url = hit['website']
                print(f'Found {sk_venue_name} in {result_city} on Songkick')
                venue_info = {'venue_id': venue_id,
                              'venue_name': sk_venue_name,
                              'venue_city': result_city,
                              'venue_url' : venue_url
                }
                return venue_info
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
    """Creates a dataframe out of Songkick events results
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
    dates = dates[0:5]
    artists = artists[0:5]
    ids = ids[0:5]

    return pd.DataFrame(data={'artist':artists, 'date':dates, 'artist_id':ids})

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

def get_artist(search_str, sp):
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

def get_top_track(artist_uri, sp):
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
        
def create_sq_playlist(sp):
    """Create an empty Showquester playlist on Spotify for a given venue"""
    username = sp.me()['id']
    venue_name = session['venue_name']
    venue_city = session['venue_city']
    playlist_name = f"ShowQuester: {venue_name} ({venue_city})"
    results = sp.user_playlist_create(username, playlist_name, public=True)
    playlist_uri = results['uri']
    playlist_id = playlist_uri.split(':')[2]
    results = add_tracks(sp, playlist_id)
    playlist_descr = build_playlist_description(venue_name, venue_city)
    results = update_playlist_details(playlist_id, playlist_name, playlist_descr, sp)
    print(f'Created playlist "{playlist_name}"')
    return [playlist_name, playlist_uri]
        
def add_tracks(sp, playlist_id):
        pl_tracks = session["playlist_tracks"]
        print(pl_tracks)
        track_batches = list(chunks(pl_tracks, 100))
        username = sp.me()['id']
        for batch_num, track_uris in enumerate(track_batches):
            if batch_num == 0:
                results = sp.user_playlist_replace_tracks(username, playlist_id, track_uris)
            else:
                results = sp.user_playlist_add_tracks(username, playlist_id, track_uris)
        return results

def build_playlist_description(venue_name, venue_city):
    """Create description for ShowQuester playlist."""
    todays_date = datetime.date.today()
    descr = f"A programmatically-generated playlist featuring artists coming soon to {venue_name} in {venue_city}. Updated {todays_date}. Ordered by date, with this week up top and events farther in the future at the bottom."
    return descr

def update_playlist_details(playlist_id, playlist_name, playlist_descr, sp):
    """Updates playlist details.
    NOTE: There are several reports of issues when updating playlist descriptions in the Spotify community.
    Currently, it seems the only solution is to wait for the server to update, which could take a day."""
    username = sp.me()['id']
    results = sp.user_playlist_change_details(
            username, playlist_id=playlist_id, name=playlist_name, description=playlist_descr)
    #print(f'Updated playlist "{playlist_name}"')
    return results

if __name__ == "__main__":
    app.run(debug=True)
