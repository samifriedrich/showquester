import { NextApiRequest, NextApiResponse } from 'next'

export default (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    // throw Error;
    const { name, location } = req.query;
    setTimeout(() => {
      res.status(200).json({ name, location });
    }, 2000);
  } else {
    res.statusCode = 405;
    res.end('Only GET request allowed.');
  }
}
