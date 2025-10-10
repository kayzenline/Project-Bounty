import { Router } from 'express';
import { notImplementedHandler } from '../../utils';

const router = Router();

router.get('/pool', notImplementedHandler);
router.post('/', notImplementedHandler);
router.get('/:astronautid', notImplementedHandler);
router.put('/:astronautid', notImplementedHandler);
router.delete('/:astronautid', notImplementedHandler);

export default router;
