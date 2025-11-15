import { Router, Request, Response } from 'express';
import { adminMissionAstronautUnassign } from '../../../logic/astronaut';
import HTTPError from 'http-errors';
const router = Router();

router.delete('/:missionid/assign/:astronautid', (req: Request, res: Response) => {
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

export default router;
