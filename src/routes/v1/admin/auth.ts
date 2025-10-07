import { Router } from 'express';
import { notImplementedHandler } from '../../utils';

const router = Router();

router.post('/register', notImplementedHandler);
router.post('/login', notImplementedHandler);
router.post('/logout', notImplementedHandler);

export default router;
