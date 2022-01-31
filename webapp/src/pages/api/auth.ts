import { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'isomorphic-unfetch';

const FLASK_APP_URL: string = 'http://127.0.0.1:5000/auth';
const REDIRECT_STATUS = 303;

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const result = await fetch(FLASK_APP_URL);
    const url = result.url;
    return res.status(REDIRECT_STATUS).json({ url });
  }
  if (req.method === 'POST') {
    throw Error;
    const { venueId, token } = req.body;
    const playlistData = await fetch(`${FLASK_APP_URL}/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        venue_id: venueId,
        access_token: token,
      })
    });
    const playlist = await playlistData.json();
    return res.status(200).send(playlist);
  } else {
    res.statusCode = 405;
    return res.end('Only GET, POST requests allowed.');
  }
}
