import { Router, Request, Response } from 'express';
import {
  adminLaunchList
} from '../../../logic/launch';
import { getData } from '../../../dataStore';
import HTTPError from 'http-errors';
const router = Router();

router.delete('/:launchvehicleid', (req: Request, res: Response) => {
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
    const result = adminLaunchList(controlUserSessionId);
    return res.status(200).json(result);
  } catch (e) {
    return res.status(e.status).json({ error: e.message });
  }
});
