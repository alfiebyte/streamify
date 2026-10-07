import { Router } from 'express';

import { authentication } from '../lib/tmdb';

const router = Router();

router.get('/', async (req, res, next) => {
  authentication().then((response) => {
        return res.status(200).json({ success: true, message: new Date().toISOString() });
  }).catch(next)
});

export default router;