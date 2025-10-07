import { Router } from 'express';
import { notImplementedHandler } from '../../utils';

const router = Router();

router.get('/list', notImplementedHandler);
router.post('/', notImplementedHandler);
router.get('/:missionid', notImplementedHandler);
router.delete('/:missionid', notImplementedHandler);
router.put('/:missionid/name', notImplementedHandler);
router.put('/:missionid/description', notImplementedHandler);
router.put('/:missionid/target', notImplementedHandler);
router.post('/:missionid/transfer', notImplementedHandler);
router.post('/:missionid/assign/:astronautid', notImplementedHandler);
router.delete('/:missionid/assign/:astronautid', notImplementedHandler);

export default router;
