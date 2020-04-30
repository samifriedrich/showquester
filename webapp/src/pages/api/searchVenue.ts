import { NextApiRequest, NextApiResponse } from 'next'
import fetch from 'isomorphic-unfetch';

const FLASK_APP_URL: string = process.env.FLASK_APP_URL as string;

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const { name, location } = req.query;
    // return res.status(200).send({
    //   success: true,
    //   data: {
    //     venue_id: 11583,
    //     venue_name: 'Holocene',
    //     venue_city: 'Portland'
    //   }
    // });  // Comment in to test
    const venueData = await fetch(`${FLASK_APP_URL}/venue?location=${location}&name=${name}`);
    console.log(venueData);
    const venue = await venueData.json();
    return res.status(200).send(venue);
  } else {
    res.statusCode = 405;
    return res.end('Only GET request allowed.');
  }
}
