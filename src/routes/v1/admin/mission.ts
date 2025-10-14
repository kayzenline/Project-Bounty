import { Router } from 'express';
import { notImplementedHandler } from '../../utils';
import { adminMissionNameUpdate, adminMissionTargetUpdate, adminMissionDescriptionUpdate } from '../../../mission';
import { httpToErrorCategories } from '../../../testSamples';

const router = Router();

router.get('/list', notImplementedHandler);
router.post('/', notImplementedHandler);
router.get('/:missionid', notImplementedHandler);
router.delete('/:missionid', notImplementedHandler);
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