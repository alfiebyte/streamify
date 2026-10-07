import { Router } from 'express';

const router = Router();

import { movieListNowPlaying } from '../lib/tmdb';

router.get("/", (req, res, next) => {
  movieListNowPlaying({})
    .then((response) => {
      res.json(response.data);
    })
    .catch(next);
});

export default router;