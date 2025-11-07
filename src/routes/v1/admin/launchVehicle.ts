import { Router, Request, Response, NextFunction } from 'express';
import HTTPError from 'http-errors';
import { getData } from '../../../dataStore';
import { adminLaunchVehicleDetails } from '../../../logic/launchVehicle';

const router = Router();

router.get('/list', (req: Request, res: Response, next: NextFunction) => {
  const controlUserSessionId = req.header('controlUserSessionId');
  try {
    if (!controlUserSessionId) {
      throw HTTPError(401, 'ControlUserSessionId is empty or invalid');
    }
    const data = getData();
    const session = data.sessions.find(s => s.controlUserSessionId === controlUserSessionId);
    if (!session) {
      throw HTTPError(401, 'ControlUserSessionId is empty or invalid');
    }
    const result = adminLaunchVehicleDetails(controlUserSessionId);
    return res.status(200).json(result);
  } catch (e) {
    next();
  }
});

export default router;
