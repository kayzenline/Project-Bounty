import { Router } from 'express';
import authRouter from './auth';
import controlUserRouter from './controlUser';
import missionRouter from './mission';
import astronautRouter from './astronaut';
import launchVehicleRouter from './launchVehicle';
import payloadRouter from './payload';

const router = Router();

router.use('/auth', authRouter);
router.use('/controluser', controlUserRouter);
router.use('/mission', missionRouter);
router.use('/astronaut', astronautRouter);
router.use('/launchvehicle', launchVehicleRouter);
router.use('/payload', payloadRouter);

export default router;
