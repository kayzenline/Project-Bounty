import { Router, Request, Response, NextFunction } from 'express';
import HTTPError from 'http-errors';
import { getData } from '../../../dataStore';
import { adminLaunchVehicleDetails, adminLaunchVehicleInfo } from '../../../logic/launchVehicle';

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
    return res.status(e.status).json({ error: e.message });
  }
});

router.get('/:launchvehicleid', (req: Request, res: Response, next: NextFunction) => {
  const controlUserSessionId = req.header('controlUserSessionId');
  const launchVehicleId = Number(req.params.launchvehicleid);
  try {
    if (!controlUserSessionId) {
      throw HTTPError(401, 'ControlUserSessionId is empty or invalid');
    }
    if (Number.isNaN(launchVehicleId)) {
      throw HTTPError(400, 'launchvehicleid is invalid');
    }
    const data = getData();
    const session = data.sessions.find(s => s.controlUserSessionId === controlUserSessionId);
    if (!session) {
      throw HTTPError(401, 'ControlUserSessionId is empty or invalid');
    }
    const result = adminLaunchVehicleInfo(controlUserSessionId, launchVehicleId);
    return res.status(200).json(result);
  } catch (e) {
    return res.status(e.status).json({ error: e.message });
  }
});

export default router;
