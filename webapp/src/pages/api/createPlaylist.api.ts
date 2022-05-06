import { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'isomorphic-unfetch';

const FLASK_APP_URL: string = process.env.FLASK_APP_URL as string;

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const { venueId } = req.body;
    const response = await fetch(`${FLASK_APP_URL}/playlist/create?venue_id=${venueId}`);
    const playlistData = await response.json();
    return res.status(200).send(playlistData);
  } else {
    res.statusCode = 405;
    return res.end('Only POST requests allowed.');
  }
}
