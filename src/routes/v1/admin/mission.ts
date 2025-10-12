import { Router, Request, Response, NextFunction } from 'express';
import { notImplementedHandler } from '../../utils';
import { getData } from '../../../dataStore';
import { adminMissionCreate } from '../../../mission';
import { httpToErrorCategories } from '../../../testSamples';

const router = Router();

router.get('/list', notImplementedHandler);


router.post('/', (req: Request, res: Response, next: NextFunction) => {
  const controlUserSessionId = (req.header('controlUserSessionId') || '').trim();
  const { name, description, target } = req.body || {};

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
      const status = httpToErrorCategories[result.errorCategory as keyof typeof httpToErrorCategories] ?? 500;
      return res.status(status).json({ error: result.error });
    }

    res.status(200).json(result);

  } catch (error) {
    next(error);
  }
});

router.get('/:missionid', notImplementedHandler);
router.delete('/:missionid', notImplementedHandler);
router.put('/:missionid/name', notImplementedHandler);
router.put('/:missionid/description', notImplementedHandler);
router.put('/:missionid/target', notImplementedHandler);
router.post('/:missionid/transfer', notImplementedHandler);
router.post('/:missionid/assign/:astronautid', notImplementedHandler);
router.delete('/:missionid/assign/:astronautid', notImplementedHandler);

export default router;
