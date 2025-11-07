import { Router } from 'express';
import { notImplementedHandler } from '../../utils';

const router = Router();

router.delete('/:missionid/assign/:astronautid', notImplementedHandler);

export default router;
