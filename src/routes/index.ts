import { Router } from 'express';
import v1Router from './v1';
import { notImplementedHandler } from './utils';
import { clearHandler } from '../other';
const router = Router();

router.use('/v1', v1Router);
router.delete('/clear', notImplementedHandler);
router.delete('/clear/v1', clearHandler);
/* export function clearHandler(_req: Request, res: Response) {
  clear();
  return res.status(200).json({});
} */
// not sure should it be here
export default router;
