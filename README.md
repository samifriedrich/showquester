# ShowQuester
A live music discovery tool that generates Spotify playlists showcasing artists with upcoming shows at live music venues.

### Access pre-existing ShowQuester playlists
All ShowQuester playlists can be found [here on my Spotify user page](https://open.spotify.com/user/1237403078?si=5U16WCC1QliVyfa67_aMEA). All venues with ShowQuester playlists are listed in `venues.csv`.

## Why I created ShowQuester 
I developed SoundQuester **to discover new artists with upcoming shows at local venues** within an app (Spotify) I already use daily.

I love experiencing live music. It's my favorite way to discover new bands as well as celebrate bands I already love. My old strategy for finding shows in my city was to check the listings in my local paper, Google the bands, and click through to a track or video before deciding whether to buy a ticket. This strategy was enjoyable but time consuming, and I got tired of waiting for Spotify to add a live music discovery feature*, so **I built my own live music discovery tool.**

*Note: Spotify did release their Concerts module as I was developing ShowQuester, but that module still didn't provide me what I wanted - a playlist of upcoming artists.

**I specifically designed ShowQuester to showcase *every* performing artist (including openers) in the spirit of novelty and inclusivity.** Unlike other show trackers, ShowQuester playlists feature all artists booked at a venue instead of only those artists that I've added to my library or liked/followed. 

**ShowQuester also takes the legwork out of finding audio or video to preview**. Instead of tapping or clicking through links in show tracker apps to listen to individual songs (that often open in Spotify anyway,) I can simply hit 'play' and sit back to listen.

## How showquester.py works, in a nutshell
**1. Generate a list of upcoming shows posted to Songkick for the venue**
- Uses the SongKick API and the python `requests` library to retrieve upcoming events.

**2. Find each performing artist on Spotify**
- Uses the python library `spotipy` to interact with the Spotify Web API

**3. Get each artist's top track on Spotify**
- From the list of top tracks returned by `spotipy`'s `get_top_tracks`, selects the highest ranking track that is from an album credited to the artist.

**4. Create/update the venue's ShowQuester playlist on Spotify**
- Replaces the old playlist tracks with the new list of tracks
- Edits the playlist description to reflect the date the playlist was updated.

### Automation
- Uses `cron` utility to schedule my code to run weekly every Sunday.
### API credentials
- API credentials are stored securely in my .bash_profile, and the `dotenv` python module allows me to import them from within a virtualenv.

## Requirements
### API access
1. [Spotify Web API](https://developer.spotify.com/documentation/web-api/) (requires that you have Spotify premium)
2. [Songkick API ](https://www.songkick.com/developer)

### Python requirements
The showquester.py uses the following modules:
- os
- spotipy
- requests
- pandas
- datetime
- dotenv
- fuzzywuzzy
- math

## FAQ
**Q: I don't have Spotify Premium or a Songkick API key. Will you create a ShowQuester playlist for my favorite venue?**

A: Yes, I would be happy to. If you would like a venue added and don't want to go through the trouble of requesting API access to both Songkick and Spotify, please post an Issue to this repository and provide the following three items:
1. The venue name
2. The venue city, state, and country
3. The venue website url

I'll resolve the issue when the playlist has been created, and anyone can access it from my [public playlists](https://open.spotify.com/user/1237403078?si=5U16WCC1QliVyfa67_aMEA).

**Q: Which venues already have playlists?**

A: Take a look at `venues.csv` to see which venues I've already created ShowQuester playlists for.

## Author
Sami Friedrich, PhD candidate at Oregon Health and Science University
- [LinkedIn](https://www.linkedin.com/in/sami-friedrich/)
 
## License
This project is licensed under the MIT License - see the [LICENSE.md](https://github.com/samifriedrich/showquester/blob/master/LICENSE) file for details.

