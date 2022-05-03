import { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'isomorphic-unfetch';

const FLASK_APP_URL: string = process.env.FLASK_APP_URL as string;

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const { venueId } = req.body;
    return res.status(200).send({
      data: {
        display_tracks: [
          'spotify:track:1sD8x8JEXlt2uCjbFSaB3U', 'spotify:track:6NitnfUkmFWyCvvi9zUZmu', 'spotify:track:53iFMaNUXn6Oj8hUIKSO5a', 'spotify:track:57HwKH3pHLeelTkckr94qf', 'spotify:track:7DPKumvNXs9YFK9u5HvH0u', 'spotify:track:3ArnNhm8z0ScjDKfGHSBRk', 'spotify:track:4KBTzuGRmIjGS6rqsCE3vq', 'spotify:track:1p2ckWM6PbmacXeXkJ99uu', 'spotify:track:6fFMXz0mLLaql9UyyBQB9a', 'spotify:track:6jw11ZgllGx4xQn3J7AaDL', 'spotify:track:09UIv3ovpGmsYLEIqh7orm', 'spotify:track:3TH46ofR8DzkLYJUlVtrd9',
          // 'spotify:track:7k6MdU3CPrnFAnkYJRM1gY', 'spotify:track:5gl1hXRbfxVHP3xSnJJGAl', 'spotify:track:1Y4N7rL8XF0vMpFGHmjiJO', 'spotify:track:4kUTA4ftbqY5uZHJzm0wCL', 'spotify:track:5XOzpTZGe4onY74BFK0ziS', 'spotify:track:4xIXOaVnsvsAhbUsOQQGBK', 'spotify:track:7vLWnCf4KEbde9pG4mHqd8', 'spotify:track:3EP3C8j3iNmC2RqLhqVnIP', 'spotify:track:309iQkCKxZMYsaHajSuah9', 'spotify:track:2Y6hhzUW6lQUeB2RabMBCn', 'spotify:track:5yzF3sJcV32Yo07MQ3UBng', 'spotify:track:6ibuhHn35b4LSMI7eiNtMU', 'spotify:track:62bvM6Glmk6Ek6Gf34GWwn', 'spotify:track:6lOIhBVYw4qWmE7YLtHUAu', 'spotify:track:11iIikXxC6NP0Ma8vMD27x', 'spotify:track:2huLhyFouxkc3WVgpbFFeW', 'spotify:track:2y7JUEuN8zBU8J0BSFEhAL', 'spotify:track:6pc0MSwfQ5etN4YOVjMh62', 'spotify:track:3Dtg7OR2EYGI5zZuuRpFKT', 'spotify:track:4iw5jzsl4j1g82b2VcSVeM', 'spotify:track:5ppPV0hCtwt5TMTKF1xY57', 'spotify:track:1fMFk4IbbyZ2h24nSryqa6', 'spotify:track:4Um9xdnzKimKzlJWZ7zcSU', 'spotify:track:51JoJiSarM4kl7i4c19fkF', 'spotify:track:6SZ1bNDsPyDeEaIq9cosxw', 'spotify:track:07jfdeUnO5u4Fs4vucBb6x', 'spotify:track:6iWvETAILWAYOdm2DioSEF', 'spotify:track:0elCmyfISzkP5tAYTVuYjS', 'spotify:track:4TQJGu7KoqOFvjvopA8fx2', 'spotify:track:0kdGy8el1uzacDxMZTJGc2', 'spotify:track:1YfdZkKYJKGSyzJ5LMtEcW', 'spotify:track:0qfPhfL4sbO1LMo1FpYg0Q', 'spotify:track:5uZOpH2gviWVmECmsiovqK', 'spotify:track:2c7fJVL8EoiKMLuWy8WfAg', 'spotify:track:3F4QJjFJ2JZuSh5Lp738kG', 'spotify:track:3Iju4sprTb8as0be1A41q6', 'spotify:track:7FMedJPiag48GjON0tp2PO', 'spotify:track:34PIoWUkKuAUbGTozZsxvB', 'spotify:track:0DR9JdNfcwIhneQMFQaSCy', 'spotify:track:1wx7jAIrUgzQLeqBtbgEvZ', 'spotify:track:5BeLLbwf4RUDccIVdzjuIh', 'spotify:track:1DymVvLLRkioWkdXvqZEMF', 'spotify:track:6fEtxRskOuPleXkm8ETYHE', 'spotify:track:35UpVtlZ5nbxH2nw0of9ST', 'spotify:track:3u4YA1Z89W4Piqrf3PrwOD', 'spotify:track:6MWFjOHLZx0XBHcexQLNLV', 'spotify:track:6mxTH1ebYmEQyWAbSY1LeG', 'spotify:track:57rAvblBMBmdPBugRF1T77'
          ],
        playlist_tracks: [],
      }
    });
    const response = await fetch(`${FLASK_APP_URL}/playlist/create?venue_id=${venueId}`);
    const playlistData = await response.json();
    return res.status(200).send(playlistData);
  } else {
    res.statusCode = 405;
    return res.end('Only POST requests allowed.');
  }
}
