import { NextApiRequest, NextApiResponse } from 'next'
import fetch from 'isomorphic-unfetch';

const FLASK_APP_URL: string = process.env.FLASK_APP_URL as string;

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const { name, location } = req.query;
    const venueData = await fetch(`${FLASK_APP_URL}/venue?location=${location}&name=${name}`);
    const venue = await venueData.json();
    return res.status(200).send(venue);
  } else {
    res.statusCode = 405;
    return res.end('Only GET request allowed.');
  }
}
