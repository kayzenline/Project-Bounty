import { Router } from 'express';
import v1Router from './v1';
import { clearHandler } from '../other';
const router = Router();

router.use('/v1', v1Router);
// Align clear route with README/spec: provide DELETE /clear and /clear/v1
router.delete('/clear', clearHandler);
/* export function clearHandler(_req: Request, res: Response) {
  clear();
  return res.status(200).json({});
} */
// not sure should it be here
export default router;
