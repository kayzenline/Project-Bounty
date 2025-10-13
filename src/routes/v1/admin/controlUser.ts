import { Router } from 'express';
import { adminControlUserDetails, adminControlUserDetailsUpdate, adminControlUserPasswordUpdate } from '../../../auth';
import { errorCategories as EC } from '../../../testSamples';
import { getData } from '../../../../src/dataStore';
const router = Router();

router.get('/details', (req, res) => {
  const Id = req.header('ControlUserSessionId');
  if (!Id) {
    return res.status(401).json({ error: 'ControlUserSessionId is invalid', errorCategory: EC.INVALID_CREDENTIALS });
  }
  if (!/^\d+$/.test(Id)) {
    return res.status(401).json({
      error: 'ControlUserSessionId is not a number',
      errorCategory: EC.INVALID_CREDENTIALS
    });
  }
  const data = getData();
  const session = data.sessions.find(s => String(s.controlUserSessionId) === String(Id));
  if (!session) {
    return res.status(401).json({ error: 'User not found', errorCategory: EC.INVALID_CREDENTIALS });
  }
  const controlUserId = session.controlUserId;

  const result = adminControlUserDetails(controlUserId);
  if ('error' in result) {
    if (result.errorCategory === 'BAD_INPUT') {
      return res.status(400).json({ error: result.error, errorCategory: result.errorCategory });
    }
    return res.status(401).json({ error: result.error, errorCategory: result.errorCategory });
    
  }
  return res.status(200).json({ user: result.user });
});// if head is invalid(sessionid->NaN)
router.put('/details', (req, res) => {
  const Id = req.header('ControlUserSessionId');
  if (!Id) {
    return res.status(401).json({ error: 'ControlUserSessionId is invalid', errorCategory: EC.INVALID_CREDENTIALS });
  }
  if (!/^\d+$/.test(Id)) {
    return res.status(401).json({
      error: 'ControlUserSessionId is not a number',
      errorCategory: EC.INVALID_CREDENTIALS,
    });
  }
  const data = getData();
  const session = data.sessions.find(s => String(s.controlUserSessionId) === String(Id));
  if (!session) {
    return res.status(401).json({ error: 'controlUserId not found', errorCategory: EC.INVALID_CREDENTIALS });
  }
  const controlUserId = session.controlUserId;
  const { email, nameFirst, nameLast } = req.body;
  const result = adminControlUserDetailsUpdate(controlUserId, email, nameFirst, nameLast);
  if ('error' in result) {
    if (result.errorCategory === 'BAD_INPUT') {
      return res.status(400).json({
        error: result.error,
        errorCategory: result.errorCategory,
      });
    } else {
      return res.status(401).json({
        error: result.error,
        errorCategory: result.errorCategory,
      });
    }
  }  
  return res.status(200).json({});
});
router.put('/password', (req, res) => {
  const Id = req.header('ControlUserSessionId');
  if (!Id) {
    return res.status(401).json({ error: 'ControlUserSessionId is invalid', errorCategory: EC.INVALID_CREDENTIALS });
  }
  if(!/^\d+$/.test(Id)) {
    return res.status(401).json({
      error: 'ControlUserSessionId is not a number',
      errorCategory: EC.INVALID_CREDENTIALS,
    });
  }
  const data = getData();
  const session = data.sessions.find(s => String(s.controlUserSessionId) === String(Id));
  if (!session) {
    return res.status(401).json({ error: 'invalid user', errorCategory: EC.INVALID_CREDENTIALS });
  }
  const controlUserId = session.controlUserId;
  const { oldPassword, newPassword } = req.body;
  const result = adminControlUserPasswordUpdate(controlUserId, oldPassword, newPassword);
  if ('error' in result) {
      if (result.errorCategory === 'BAD_INPUT') {
        return res.status(400).json(result);
      } else {
        return res.status(401).json(result);
      }
  }
  return res.status(200).json({});
});

export default router;
