import { Router } from 'express';
import { notImplementedHandler } from '../../utils';

const router = Router();

router.get('/details', notImplementedHandler);
router.put('/details', notImplementedHandler);
router.put('/password', notImplementedHandler);

export default router;
