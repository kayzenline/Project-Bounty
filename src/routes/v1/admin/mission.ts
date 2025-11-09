import { Router, Request, Response, NextFunction } from 'express';
import { getData } from '../../../dataStore';
import { adminMissionAstronautAssign, adminMissionAstronautUnassign } from '../../../logic/astronaut';
import {
  adminMissionNameUpdate,
  adminMissionTargetUpdate,
  adminMissionDescriptionUpdate,
  adminMissionRemove,
  adminMissionCreate,
  adminMissionList,
  adminMissionInfo
} from '../../../logic/mission';
import { adminMissionTransfer } from '../../../logic/missionTransferExample';
import { findSessionFromSessionId } from '../../../logic/helper';
import HTTPError from 'http-errors';
import { adminMissionLaunchDetails, adminMissionLaunchStatusUpdate } from '../../../../src/logic/launch';
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
    const result = adminMissionList(session.controlUserId);
    return res.status(200).json(result);
  } catch (e) {
    return res.status(e.status).json({ error: e.message });
  }
});

router.post('/', (req: Request, res: Response, next: NextFunction) => {
  try {
    const controlUserSessionId = (req.header('controlUserSessionId'));
    const { name, description, target } = req.body;
    if (!controlUserSessionId) {
      throw HTTPError(401, 'ControlUserSessionId is empty or invalid');
    }

    const session = findSessionFromSessionId(controlUserSessionId);
    if (!session) {
      throw HTTPError(401, 'ControlUserSessionId is empty or invalid');
    }

    const result = adminMissionCreate(session.controlUserId, name, description, target);
    res.status(200).json(result);
  } catch (e) {
    return res.status(e.status).json({ error: e.message });
  }
});

router.get('/:missionid', (req: Request, res: Response, next: NextFunction) => {
  try {
    const controlUserSessionId = req.header('controlUserSessionId');
    const missionId = Number(req.params.missionid);
    if (!controlUserSessionId) {
      throw HTTPError(401, 'ControlUserSessionId is empty or invalid');
    }
    const session = findSessionFromSessionId(controlUserSessionId);
    if (!session) {
      throw HTTPError(401, 'ControlUserSessionId is empty or invalid');
    }
    const result = adminMissionInfo(session.controlUserId, missionId);
    res.status(200).json(result);
  } catch (e) {
    return res.status(e.status).json({ error: e.message });
  }
});

router.delete('/:missionid', (req: Request, res: Response, next: NextFunction) => {
  try {
    const controlUserSessionId = req.header('controlUserSessionId');
    const missionId = Number(req.params.missionid);
    if (!controlUserSessionId) {
      throw HTTPError(401, 'ControlUserSessionId is empty or invalid');
    }
    const session = findSessionFromSessionId(controlUserSessionId);
    if (!session) {
      throw HTTPError(401, 'ControlUserSessionId is empty or invalid');
    }
    const result = adminMissionRemove(session.controlUserId, missionId);
    res.status(200).json(result);
  } catch (e) {
    return res.status(e.status).json({ error: e.message });
  }
});

router.put('/:missionId/name', (req: Request, res: Response, next: NextFunction) => {
  try {
    const controlUserSessionId = req.header('controlUserSessionId');
    const missionId = Number(req.params.missionId);
    const name = req.body || {};

    const session = findSessionFromSessionId(controlUserSessionId);
    if (!session) {
      throw HTTPError(401, 'ControlUserSessionId is empty or invalid');
    }

    const controlUserId = session.controlUserId;
    const result = adminMissionNameUpdate(controlUserId, missionId, name.name);
    return res.status(200).json(result);
  } catch (e) {
    return res.status(e.status).json({ error: e.message });
  }
});

router.put('/:missionId/description', (req: Request, res: Response, next: NextFunction) => {
  try {
    const controlUserSessionId = req.header('controlUserSessionId');
    const missionId = Number(req.params.missionId);
    const description = req.body || {};

    const session = findSessionFromSessionId(controlUserSessionId);
    if (!session) {
      throw HTTPError(401, 'ControlUserSessionId is empty or invalid');
    }

    const controlUserId = session.controlUserId;
    const result = adminMissionDescriptionUpdate(controlUserId, missionId, description.description);
    return res.status(200).json(result);
  } catch (e) {
    return res.status(e.status).json({ error: e.message });
  }
});

router.put('/:missionId/target', (req: Request, res: Response, next: NextFunction) => {
  const controlUserSessionId = req.header('controlUserSessionId');
  const missionId = Number(req.params.missionId);
  const target = req.body || {};

  const session = findSessionFromSessionId(controlUserSessionId);
  if (!session) {
    throw HTTPError(401, 'ControlUserSessionId is empty or invalid');
  }

  const controlUserId = session.controlUserId;
  const result = adminMissionTargetUpdate(controlUserId, missionId, target.target);
  return res.status(200).json(result);
});

router.post('/:missionId/transfer', (req: Request, res: Response, next: NextFunction) => {
  try {
    const controlUserSessionId = req.header('controlUserSessionId');
    const missionId = Number(req.params.missionId);
    const userEmail = req.body || {};

    if (!(controlUserSessionId && findSessionFromSessionId(controlUserSessionId))) {
      throw HTTPError(401, 'ControlUserSessionId is empty or invalid');
    }

    const session = findSessionFromSessionId(controlUserSessionId);
    const result = adminMissionTransfer(session.controlUserId, missionId, userEmail.email);
    return res.status(200).json(result);
  } catch (e) {
    return res.status(e.status).json({ error: e.message });
  }
});

router.post('/:missionid/assign/:astronautid', (req: Request, res: Response, next: NextFunction) => {
  try {
    const controlUserSessionId = req.headers.controlusersessionid as string;
    const missionId = Number(req.params.missionid);
    const astronautId = Number(req.params.astronautid);

    if (!controlUserSessionId) {
      throw HTTPError(401, 'ControlUserSessionId is empty or invalid');
    }
    const result = adminMissionAstronautAssign(controlUserSessionId, astronautId, missionId);
    return res.status(200).json(result);
  } catch (e) {
    return res.status(e.status).json({ error: e.message });
  }
});

router.delete('/:missionid/assign/:astronautid', (req: Request, res: Response, next: NextFunction) => {
  try {
    const controlUserSessionId = req.header('controlUserSessionId');
    const missionId = Number(req.params.missionid);
    const astronautId = Number(req.params.astronautid);

    if (!controlUserSessionId) {
      throw HTTPError(401, 'ControlUserSessionId is empty or invalid');
    }

    const result = adminMissionAstronautUnassign(controlUserSessionId, astronautId, missionId);
    return res.status(200).json(result);
  } catch (e) {
    return res.status(e.status).json({ error: e.message });
  }
});

router.get('/:missionid/launch/:launchid', (req: Request, res: Response, next: NextFunction) => {
  try {
    const controlUserSessionId = req.header('controlUserSessionId');
    const missionId = Number(req.params.missionid);
    const launchId = Number(req.params.launchid);

    if (!controlUserSessionId) {
      throw HTTPError(401, 'ControlUserSessionId is empty or invalid');
    }
    const result = adminMissionLaunchDetails(controlUserSessionId, missionId, launchId);
    return res.status(200).json(result);
  } catch (e) {
    return res.status(e.status).json({ error: e.message });
  }
});

router.put('/:missionid/launch/:launchid/status', (req: Request, res: Response, next: NextFunction) => {
  try {
    const controlUserSessionId = req.header('controlUserSessionId');
    const missionId = Number(req.params.missionid);
    const launchId = Number(req.params.launchid);
    const { action } = req.body;
    if (!controlUserSessionId) {
      throw HTTPError(401, 'ControlUserSessionId is empty or invalid');
    }
    if (!action) {
      throw HTTPError(400, 'Missing action in request body');
    }
    const result = adminMissionLaunchStatusUpdate(controlUserSessionId, missionId, launchId, action);
    return res.status(200).json(result);
  } catch (e) {
    return res.status(e.status).json({ error: e.message });
  }
});

export default router;
