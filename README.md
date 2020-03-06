# ShowQuester
Generates Spotify playlists showcasing artists with upcoming shows at my favorite live music venues.

# How to access the playlists
All ShowQuester playlists can be found [here on my Spotify user page](https://open.spotify.com/user/1237403078?si=5U16WCC1QliVyfa67_aMEA). 

# Why I made this 
I love live shows. It's my favorite way to discover new bands and celebrate bands I already love. My old method of finding shows was to check the listings in my local paper, Google the bands, find a track or video, then decide if I wanted to buy a ticket. I developed SoundQuester as a way to spend less time searching and more time listening, to discover new artists with upcoming shows in my area within an app (Spotify) I already use daily.

Unlike other show tracker apps, ShowQuester playlists showcase all artists with tour dates instead of only artists that I've added or liked. I specifically designed it to showcase every listing in the spirit of novelty and inclusivity. ShowQuester also takes the legwork out of finding audio or video to preview. Instead of tapping or clicking through the show tracker apps to listen to tracks (that often open in Spotify anyway,) I can simply hit 'play' and sit back to listen.

Honestly, I got tired of waiting for Spotify to add this feature, so I coded it myself.

# How it works
## 1. Generate a list of upcoming shows for a venue
I use the SongKick API and the python `requests` library to retrieve upcoming events.
## 2. Find each artist on Spotify
I use the python library `spotipy` to interact pythonically with the Spotify Web API
## 3. Get each artist's top track on Spotify
From the list of top tracks returned by `spotipy`'s `get_top_tracks`, I select the highest ranking track that is from an album credited to the artist.
## 4. Create/update the venue's ShowQuester playlist
I replace the old playlist tracks with the new list of tracks, and edit the playlist description to reflect the date the playlist was updated.

# Venues
- Designing first with Mississippi Studios
- Venues to add later:
  - Polaris Hall
  - Doug Fir
  - Wonder Ballroom
 
# Ideas for organizing into playlists
- By date (coming next week/month/all)
- By venue
- By genre
- By location/city quadrant
- By age restriction
- By cost
- By personal taste (acoustic features, genres, filtering by artists in my library, filtering against recommended stuff, etc)

# Other tasks
- Schedule the scraper
- Build a SQL database of venue music data

# Open Questions & Challenges
### Which songs to pull?
- Top song + top (or second-top if already top) song from most recent album
- Number of plays
- Acoustic features
### Bands with the same name
- Use genre data
  - API artist endpoint has 'genre' as a list of associated genres
  - <section class="topline-info"> often contains genre words
  - Use NLP to identify genre words in topline-info string
  - if needed, can navigate to href in topline-info and extract entire bio then perfrom NLP on that
- Use place data
  - <section class="topline-info"> often contains place or country
  - can get country from Spotify API artist endoint, but that's it
### Dirty strings
  - 'SOLD OUT'
  - '/'
  - 'a night with'
  - 'featuring'
- how to deal with typos?
  
### Bands that are not on Spotify
- future plans to make this Spotify-independent and instead create playlists linked to YouTube or SoundCloud tracks (requires more interaction from user, but will capture more artists)

## To-Do
- extract topline-info and add to df
