# ShowQuester
A live music discovery tool that generates Spotify playlists showcasing artists (headliners & openers) with upcoming shows at live music venues.

## How to access pre-existing ShowQuester playlists
All ShowQuester playlists can be found [here on my Spotify user page](https://open.spotify.com/user/1237403078?si=5U16WCC1QliVyfa67_aMEA). 

## Why I created ShowQuester 
I love live shows. It's my favorite way to discover new bands and celebrate bands I already love. My old method of finding shows was to check the listings in my local paper, Google the bands, find a track or video, then decide if I wanted to buy a ticket. I developed SoundQuester as a way to spend less time searching and more time listening, to discover new artists with upcoming shows in my area within an app (Spotify) I already use daily.

Unlike other show tracker apps, ShowQuester playlists showcase **all** artists with tour dates instead of only artists that I've added to my library or liked. I specifically designed it to showcase every performing artist in the spirit of novelty and inclusivity. ShowQuester also takes the legwork out of finding audio or video to preview. Instead of tapping or clicking through links in show tracker apps to listen to individual tracks (that often open in Spotify anyway,) I can simply hit 'play' and sit back to listen.

Honestly, I got tired of waiting for Spotify to add this feature, so I coded it myself.

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
### Authentication keys
- Uses `dotenv` python module to import my secret API keys from .bash_profile

## Requirements
### Access to 2 APIS
1. [Spotify Web API](https://developer.spotify.com/documentation/web-api/) (requires that you have Spotify premium)
2. [Songkick API ](https://www.songkick.com/developer)
Once you are granted access, store your API access keys in your .bash_profile or equivalent.

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

**A: Yes, I would be happy to.** If you would like a venue added and don't want to go through the trouble of requesting API access to both Songkick and Spotify, please post an Issue to this repository and provide the following three items:
1. The venue name
2. The venue city, state, and country
3. The venue website url

**Q: Which venues already have playlists?**

**A: Take a look at `venues.csv` to see which venues I've already created ShowQuester playlists for.** I'll resolve the issue when the playlist has been created, and anyone can access it from my [public playlists](https://open.spotify.com/user/1237403078?si=5U16WCC1QliVyfa67_aMEA).

## Author
Sami Friedrich, PhD candidate at Oregon Health and Science University
- [LinkedIn](https://www.linkedin.com/in/sami-friedrich/)
 
## License
This project is licensed under the MIT License - see the [LICENSE.md](https://github.com/samifriedrich/showquester/blob/master/LICENSE) file for details.


