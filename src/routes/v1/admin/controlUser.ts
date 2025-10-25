import { Router } from 'express';
import { adminControlUserDetails, adminControlUserDetailsUpdate, adminControlUserPasswordUpdate } from '../../../auth';
import { errorCategories as EC } from '../../../testSamples';
import { findSessionFromSessionId } from '../../../helper';
import { httpToErrorCategories } from '../../../testSamples';
const router = Router();

router.get('/details', (req, res) => {
  const controlUserSessionId = req.header('ControlUserSessionId');
  if (!controlUserSessionId) {
    return res.status(401).json({ error: 'ControlUserSessionId is invalid', errorCategory: EC.INVALID_CREDENTIALS });
  }

  const session = findSessionFromSessionId(controlUserSessionId);
  if (!session) {
    return res.status(401).json({ error: 'User not found', errorCategory: EC.INVALID_CREDENTIALS });
  }
  const controlUserId = session.controlUserId;

  const result = adminControlUserDetails(controlUserId);
  if ('error' in result) {
    const status = httpToErrorCategories[result.errorCategory as keyof typeof httpToErrorCategories];
    return res.status(status).json({ error: result.error });
  }

  return res.status(200).json({ user: result.user });
});

router.put('/details', (req, res) => {
  const controlUserSessionId = req.header('ControlUserSessionId');
  const { email, nameFirst, nameLast } = req.body;
  const session = findSessionFromSessionId(controlUserSessionId);
  if (!session) {
    return res.status(401).json({ error: 'ControlUserSessionId is empty or invalid' });
  }

  const controlUserId = session.controlUserId;
  const result = adminControlUserDetailsUpdate(controlUserId, email, nameFirst, nameLast);
  if ('error' in result) {
    const status = httpToErrorCategories[result.errorCategory as keyof typeof httpToErrorCategories];
    return res.status(status).json({ error: result.error });
  }

  return res.status(200).json({});
});

router.put('/password', (req, res) => {
  const controlUserSessionId = req.header('ControlUserSessionId');
  const { oldPassword, newPassword } = req.body;
  const session = findSessionFromSessionId(controlUserSessionId);
  if (!session) {
    return res.status(401).json({ error: 'ControlUserSessionId is empty or invalid'});
  }
  const controlUserId = session.controlUserId;
  const result = adminControlUserPasswordUpdate(controlUserId, oldPassword, newPassword);
  if ('error' in result) {
    const status = httpToErrorCategories[result.errorCategory as keyof typeof httpToErrorCategories];
    return res.status(status).json({ error: result.error });
  }

  return res.status(200).json({});
});

export default router;
