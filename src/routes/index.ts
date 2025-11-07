import { Router } from 'express';
import v1Router from './v1';
import v2Router from './v2';
import { clear } from '../logic/other';
const router = Router();

router.use('/v1', v1Router);
router.use('/v2', v2Router);
// Align clear route with README/spec: provide DELETE /clear and /clear/v1
router.delete('/clear', (_req, res) => {
  clear();
  return res.status(200).json({});
});

export default router;
