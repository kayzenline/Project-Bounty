import { Router } from 'express';
import v1Router from './v1';
import { clear } from '../other';
const router = Router();

router.use('/v1', v1Router);
// Align clear route with README/spec: provide DELETE /clear and /clear/v1
router.delete('/clear', (_req, res) => {
  clear();
  return res.status(200).json({});
});

export default router;
