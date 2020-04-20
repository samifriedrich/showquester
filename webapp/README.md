## ShowQuester Web App

## Development

First, ensure that you have a `.env.development.local` (or similar) file with the following credentials:

```
VENUE_SEARCH_URL="/api/exampleVenueSearch"
CREATE_PLAYLIST_URL="/api/exampleCreatePlaylist"
SPOTIFY_CLIENT_ID="<your_client_id>"
REDIRECT_URL="http://localhost:3000"
```

Next, `cd` into the `webapp` directory and run the development server:

```bash
$ cd webapp
$ npm install
$ npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deployment

Push or merge a change to `master`. That's it!
