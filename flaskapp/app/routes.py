from app import app
from flask import Flask, render_template, redirect, request, make_response, session, redirect, abort
import pandas as pd
import spotipy
import spotipy.util as util
import os
import requests
import datetime
import time
import urllib.parse
from fuzzywuzzy import fuzz, process
from math import ceil as round_up

## Globals
app.secret_key = os.urandom(12).hex()
## Set API authorization keys
# Songkick API
sk_api_key = os.environ.get('SONGKICK_API_KEY')
# set Spotify API authorization vars and scope
CLIENT_ID = os.environ.get('SPOTIFY_CLIENT_ID')
CLIENT_SECRET = os.environ.get('SPOTIFY_CLIENT_SECRET')
SCOPE = 'playlist-modify-public'
# REDIRECT_URL must be listed on ShowQuester dashboard on Spotify for Developers
REDIRECT_URI = "http://127.0.0.1:5000/callback"
API_BASE = 'https://accounts.spotify.com'
SHOW_DIALOG = True

# This will become first
# setting a single venue for testing
venue_name = "Emo's"
venue_url = "https://www.emosaustin.com/"
venue_city = "Austin"
# will need to make state conditional, see jupyter notebook
venue_state = "TX"


## Routes
@app.route('/playlist/create')
def index():
    return "Welcome to ShowQuester. Go to http://127.0.0.1:5000/auth?playlist_id=123456 endpoint to begin."

# Authorization-code-flow Step 1.
# ShowQuester requests permission from user.
# User is taken to Spotify login page via auth_url
# User logs into Spotify to authorize access
@app.route("/auth")
def verify():
    session["playlist_id"] = request.args.get("playlist_id")
    auth_url = f'{API_BASE}/authorize?client_id={CLIENT_ID}&response_type=code&redirect_uri={REDIRECT_URI}&scope={SCOPE}&show_dialog={SHOW_DIALOG}'
    return redirect(auth_url)

# "Landing page" endpoint for flask app
@app.route('/index')
@app.route('/')
def index():
    #return '<iframe src="https://open.spotify.com/embed/track/7BoVAJ0HuKcBBRmUGlzX6o" width="300" height="80" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>'
    return "Welcome to ShowQuester. Go to http://127.0.0.1:5000/auth?playlist_id=123456 endpoint to begin."

# authorization-code-flow Step 2.
# Showquester requests refresh and access tokens;
# Spotify returns access and refresh tokens
@app.route('/callback')
def callback():
    #return session["playlist_id"]
    code = request.args.get('code')
    auth_token_url = f"{API_BASE}/api/token"
    response = requests.post(auth_token_url, data={
                "grant_type":"authorization_code",
                "code":code,
                "redirect_uri":REDIRECT_URI,
                "client_id":CLIENT_ID,
                "client_secret":CLIENT_SECRET
                })
    response_body = response.json()
    #print(f'\nRESPONSE: {response.json()}\n')
    session['token_info'] = response_body
    session["access_token"] = response_body.get("access_token")
    return redirect('go')

@app.route('/go')
def go():
    return "Spotify user granted ShowQuester access"

@app.route("/venue", methods=['GET'])
def venue():
    venue_name = request.args.get('name')
    venue_city = request.args.get('location')
    venue_id = get_venue_id(venue_name, venue_city)
    if venue_id:
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


# Authorization-code-flow Step 3.
# Use the access token to access the Spotify Web API;
# Spotify returns requested data
@app.route("/playlist/save", methods=['POST'])
def create():
    venue_id = request.json.get('venue_id')
    access_token = request.json.get('access_token')
    global sp
    sp = spotipy.Spotify(auth=access_token)

    # get username from current user after auth
    username = sp.me()['id']
    print(f'\nSpotify User: {username}')
    global USERNAME
    USERNAME = username

    print("\n>>> ShowQuester started.")
    print(f"*****************{venue_name}*******************")
    #venue_id = get_venue_id(venue_name, venue_city)

    if venue_id:
        event_list = get_venue_events(venue_id)
        shows = events_df(event_list)
        artist_list = list(shows.artist)
        # remove exact duplicates from list of artists
        artist_list = list(process.dedupe(artist_list, threshold=99, scorer=fuzz.token_sort_ratio))

        my_playlists = get_my_public_playlists(USERNAME)
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
        
        # split into playlist creation and writing to account

        print('...UPDATING SHOWQUESTER PLAYLIST TRACKS...')
        for batch_num, track_uris in enumerate(track_batches):
            if batch_num == 0:
                result = sp.user_playlist_replace_tracks(USERNAME, playlist_id, track_uris)
            else:
                results = sp.user_playlist_add_tracks(USERNAME, playlist_id, track_uris)

        print('...UPDATING SHOWQUESTER PLAYLIST DESCRIPTION...')
        playlist_descr = build_playlist_description(venue_name, venue_url, venue_city, venue_state)
        results = update_playlist_details(playlist_id, playlist_name, playlist_descr)

        print(f"COMPLETED: {venue_name}\n\n")

    return "Done"


## Functions
# Checks to see if token is valid and gets a new token if not
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
    print(response.json())
    num_results = response.json()['resultsPage']['totalEntries']

    if num_results > 0:
        results = response.json()['resultsPage']['results']['venue']
        for hit in results:
            result_state = hit['city']['state']['displayName']
            result_city = hit['city']['displayName']
            if result_city == venue_city:
                venue_id = hit['id']
                sk_venue_name = hit['displayName']
                print(f'Found {sk_venue_name} in {result_city}, {result_state} on Songkick')
                return venue_id
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
    results = sp.user_playlist_create(USERNAME, playlist_name, public=True)
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
    descr = f"A programmatically-generated playlist featuring artists coming soon to {venue_name} in {venue_city}, {venue_state}. Updated {todays_date}. Ordered by date, with this week up top and events farther in the future at the bottom. Go to {venue_url} for more info."
    return descr

def update_playlist_details(playlist_id, playlist_name, playlist_descr):
    """Updates playlist details.
    NOTE: There are several reports of issues when updating playlist descriptions in the Spotify community.
    Currently, it seems the only solution is to wait for the server to update, which could take a day."""
    results = sp.user_playlist_change_details(
            USERNAME, playlist_id=playlist_id, name=playlist_name, description=playlist_descr)
    #print(f'Updated playlist "{playlist_name}"')
    return results

if __name__ == "__main__":
    app.run(debug=True)
