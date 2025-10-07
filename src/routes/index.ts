import { Router } from 'express';
import v1Router from './v1';
import { notImplementedHandler } from './utils';

const router = Router();

router.use('/v1', v1Router);
router.delete('/clear', notImplementedHandler);

export default router;
