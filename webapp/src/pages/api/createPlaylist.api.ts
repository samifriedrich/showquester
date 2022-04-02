import { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'isomorphic-unfetch';
import { Logger } from 'aws-amplify';

const logger = new Logger('createPlaylist');

const FLASK_APP_URL: string = process.env.FLASK_APP_URL as string;

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    logger.info('Creating playlist');
    const { venueId } = req.body;
    const response = await fetch(`${FLASK_APP_URL}/playlist/create?venue_id=${venueId}`);
    const playlistData = await response.json();
    logger.info('Playlist data:');
    logger.info(JSON.stringify(playlistData));
    return res.status(200).send(playlistData);
  } else {
    res.statusCode = 405;
    return res.end('Only POST requests allowed.');
  }
}
