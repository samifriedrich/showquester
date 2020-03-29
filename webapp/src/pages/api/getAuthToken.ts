import { NextApiRequest, NextApiResponse } from 'next'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    res.statusCode = 200;
    res.end('getAuthToken running');
  }
  if (req.method === 'POST') {
    // throw Error;
    const { spotifyUrl } = req.body;
    console.log(spotifyUrl);
    const tokenData = await fetch(spotifyUrl);
    console.log(tokenData);
    return tokenData;
  } else {
    res.statusCode = 405;
    res.end('Only GET, POST requests allowed.');
  }
}
