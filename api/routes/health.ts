import { Router } from 'express';

import { authentication } from '../lib/tmdb';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const response = await authentication();
    console.log(response.data);
    return res.status(200).json({ success: true, message: new Date().toISOString() });
  } catch (err) {
    console.error(err);
    return next(err);
  }
});

export default router;