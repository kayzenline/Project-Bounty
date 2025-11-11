import { Router, Request, Response } from 'express';
import HTTPError from 'http-errors';
import { getData } from '../../../dataStore';
import { adminLaunchVehicleCreate, adminLaunchVehicleDetails, adminLaunchVehicleEdit, adminLaunchVehicleInfo, adminLaunchVehicleRetire } from '../../../logic/launchVehicle';

const router = Router();

router.post('', (req: Request, res: Response) => {
  const controlUserSessionId = req.header('controlUserSessionId');
  const {
    name,
    description,
    maxCrewWeight,
    maxPayloadWeight,
    launchVehicleWeight,
    thrustCapacity,
    maneuveringFuel
  } = req.body;
  try {
    if (!controlUserSessionId) {
      throw HTTPError(401, 'ControlUserSessionId is empty or invalid');
    }
    const data = getData();
    const session = data.sessions.find(s => s.controlUserSessionId === controlUserSessionId);
    if (!session) {
      throw HTTPError(401, 'ControlUserSessionId is empty or invalid');
    }
    const result = adminLaunchVehicleCreate(
      controlUserSessionId,
      name,
      description,
      maxCrewWeight,
      maxPayloadWeight,
      launchVehicleWeight,
      thrustCapacity,
      maneuveringFuel
    );
    return res.status(200).json(result);
  } catch (e) {
    return res.status(e.status).json({ error: e.message });
  }
});

router.get('/list', (req: Request, res: Response) => {
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

router.get('/:launchvehicleid', (req: Request, res: Response) => {
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
    const result = adminLaunchVehicleRetire(controlUserSessionId, launchVehicleId);
    return res.status(200).json(result);
  } catch (e) {
    return res.status(e.status).json({ error: e.message });
  }
});

router.put('/:launchvehicleid', (req: Request, res: Response) => {
  const controlUserSessionId = req.header('controlUserSessionId');
  const launchVehicleId = Number(req.params.launchvehicleid);
  const {
    name,
    description,
    maxCrewWeight,
    maxPayloadWeight,
    launchVehicleWeight,
    thrustCapacity,
    maneuveringFuel
  } = req.body;
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
    const result = adminLaunchVehicleEdit(
      controlUserSessionId,
      launchVehicleId,
      name,
      description,
      maxCrewWeight,
      maxPayloadWeight,
      launchVehicleWeight,
      thrustCapacity,
      maneuveringFuel
    );
    return res.status(200).json(result);
  } catch (e) {
    return res.status(e.status).json({ error: e.message });
  }
});

export default router;
