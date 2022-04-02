import { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'isomorphic-unfetch';
import { Logger } from 'aws-amplify';

const logger = new Logger('savePlaylist');

const FLASK_APP_URL: string = process.env.FLASK_APP_URL as string;
const REDIRECT_STATUS = 303;

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    logger.info('Saving playlist');
    const { venueId, tracks } = req.body;
    const response = await fetch(`${FLASK_APP_URL}/playlist/save`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        venue_id: venueId,
        playlist_tracks: tracks,
      })
    });
    const url = response.url;
    logger.info('Playlist URL: ', url);
    return res.status(REDIRECT_STATUS).json({ url });
  } else {
    res.statusCode = 405;
    return res.end('Only POST requests allowed.');
  }
}
