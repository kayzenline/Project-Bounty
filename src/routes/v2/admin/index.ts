import { Router } from 'express';
import missionRouter from './mission';

const router = Router();

router.use('/mission', missionRouter);

export default router;
