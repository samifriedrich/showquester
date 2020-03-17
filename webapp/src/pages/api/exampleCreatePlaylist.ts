import { NextApiRequest, NextApiResponse } from 'next'

export default (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    res.statusCode = 200;
    res.end('exampleCreatePlaylist running');
  }
  if (req.method === 'POST') {
    // throw Error;
    const { venueName } = req.body;
    setTimeout(() => {
      res.statusCode = 200
      res.setHeader('Content-Type', 'application/json');
      res.status(200).send(JSON.stringify({ playlist_name: `ShowQuester ${venueName}` }))
    }, 2000)
  } else {
    res.statusCode = 405;
    res.end('Only GET, POST requests allowed.');
  }
}
