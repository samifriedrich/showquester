import { NextApiRequest, NextApiResponse } from 'next'
import fetch from 'isomorphic-unfetch';

const FLASK_APP_URL: string = process.env.FLASK_APP_URL as string;

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const { name, city } = req.query;
    // return res.status(200).send({
    //   success: true,
    //   data: {
    //     venue_id: '1234',
    //     venue_name: 'Mississippi Studios',
    //     venue_city: 'Portland',
    //   }
    // });
    const venueData = await fetch(`${FLASK_APP_URL}/venue?city=${city}&name=${name}`);
    const venue = await venueData.json();
    return res.status(200).send(venue);
  } else {
    res.statusCode = 405;
    return res.end('Only GET request allowed.');
  }
}
