# SoundQuester
Generates Spotify playlists showcasing artists with upcoming shows at my favorite PDX venues

I love live shows. It's my favorite way to discover new bands and celebrate bands I already love. My old method of finding shows was to check the listings in my local paper, Google the bands, find a track or video, then decide if I wanted to buy a ticket. I developed `aroundtown` as a way to spend less time searching and more time listening, to discover new artists with upcoming shows in my area within an app (Spotify) I already use daily.

As a mixtape fiend, the age of streaming has turned me into a chronic playlister. I create playlists of music to set the tone of a roadtrip, help me focus at work, energize me at the gym, capture the feeling of a place or memory, etc. Unlike show trackers like Songkick and Bandsintown, `aroundtown` showcases all artists with tour dates instead of only artists that I've added or liked. I specifically designed it to showcase every listing in the spirit of novelty and inclusivity. `aroundtown` also takes the legwork out of finding the audio files to preview. Instead of tapping or clicking through the show tracker apps to listen one by one (that often open in spotify anyway,) I can simply hit 'play' and let my ears decide whether I want to attend a show.

# Ouline
## 1. Scrape the venue calendar webpage using BeautifulSoup4
## 2. Clean the data in python
## 3. Build/update playlist(s) using Spotify API

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
