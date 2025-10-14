import { Router, Request, Response, NextFunction } from 'express';
import { notImplementedHandler } from '../../utils';
import { getData } from '../../../dataStore';
import { adminMissionNameUpdate, adminMissionTargetUpdate, adminMissionDescriptionUpdate, adminMissionRemove, adminMissionCreate } from '../../../mission';
import { httpToErrorCategories } from '../../../testSamples';

const router = Router();

router.get('/list', notImplementedHandler);

router.post('/', (req: Request, res: Response, next: NextFunction) => {
  const controlUserSessionId = (req.header('controlUserSessionId'));
  const { name, description, target } = req.body;

  try {
    if (!controlUserSessionId) {
      return res.status(401).json({ error: 'ControlUserSessionId is empty or invalid' });
    }

    const session = getData().sessions.find(s => s.controlUserSessionId === controlUserSessionId);
    if (!session) {
      return res.status(401).json({ error: 'ControlUserSessionId is empty or invalid' });
    }

    const result = adminMissionCreate(session.controlUserId, name, description, target);
    if ('error' in result) {
      let status: number;

      if (result.errorCategory in httpToErrorCategories) {
        status = httpToErrorCategories[
          result.errorCategory as keyof typeof httpToErrorCategories
        ];
      } else {
        status = 500;
      }
      return res.status(status).json({ error: result.error });
    }

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

router.get('/:missionid', notImplementedHandler);

router.delete('/:missionid', (req: Request, res: Response, next: NextFunction) => {
  const controlUserSessionId = req.header('controlUserSessionId');
  const missionId = Number(req.params.missionid);

  try {
    if (!controlUserSessionId) {
      return res.status(401).json({ error: 'ControlUserSessionId is empty or invalid' });
    }

    const session = getData().sessions.find(s => s.controlUserSessionId === controlUserSessionId);
    if (!session) {
      return res.status(401).json({ error: 'ControlUserSessionId is empty or invalid' });
    }

    const result = adminMissionRemove(session.controlUserId, missionId);
    if ('error' in result) {
      const status = httpToErrorCategories[
        (result as { error: string; errorCategory: keyof typeof httpToErrorCategories }).errorCategory
      ];
      return res.status(status).json({ error: result.error });
    }

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});
router.put('/:missionid/name', (req, res) => {
  const { controlUserSessionId, missionId, name } = req.body || {};

  const result = adminMissionNameUpdate(controlUserSessionId, missionId, name);

  if ('error' in result) {
    const status = httpToErrorCategories[result.errorCategory as keyof typeof httpToErrorCategories] || 400;
    return res.status(status).json({ error: result.error });
  }

  return res.status(200).json({});
});

router.put('/:missionid/description', (req, res) => {
  const { controlUserSessionId, missionId, description } = req.body || {};

  const result = adminMissionDescriptionUpdate(controlUserSessionId, missionId, description);

  if ('error' in result) {
    const status = httpToErrorCategories[result.errorCategory as keyof typeof httpToErrorCategories] || 400;
    return res.status(status).json({ error: result.error });
  }

  return res.status(200).json({});
});

router.put('/:missionid/description', (req, res) => {
  const { controlUserSessionId, missionId, description } = req.body || {};

  const result = adminMissionDescriptionUpdate(controlUserSessionId, missionId, description);

  if ('error' in result) {
    const status = httpToErrorCategories[result.errorCategory as keyof typeof httpToErrorCategories] || 400;
    return res.status(status).json({ error: result.error });
  }

  return res.status(200).json({});
});

router.put('/:missionid/target', (req, res) => {
  const { controlUserSessionId, missionId, target } = req.body || {};

  const result = adminMissionTargetUpdate(controlUserSessionId, missionId, target);

  if ('error' in result) {
    const status = httpToErrorCategories[result.errorCategory as keyof typeof httpToErrorCategories] || 400;
    return res.status(status).json({ error: result.error });
  }

  return res.status(200).json({});
});

router.post('/:missionid/transfer', notImplementedHandler);

router.post('/:missionid/assign/:astronautid', notImplementedHandler);

router.delete('/:missionid/assign/:astronautid', notImplementedHandler);

export default router;
