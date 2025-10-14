import { Router } from 'express';
import { notImplementedHandler } from '../../utils';
import { adminAuthRegister } from '../../../auth';
import { httpToErrorCategories } from '../../../testSamples';

const router = Router();

router.post('/register', (req, res) => {
  const { email, password, nameFirst, nameLast } = req.body || {};

  const result = adminAuthRegister(email, password, nameFirst, nameLast);

  if ('error' in result) {
    const status = httpToErrorCategories[result.errorCategory as keyof typeof httpToErrorCategories] || 400;
    return res.status(status).json({ error: result.error });
  }

  return res.status(200).json({ controlUserSessionId: result.controlUserSessionId });
});
router.post('/login', notImplementedHandler);
router.post('/logout', notImplementedHandler);

export default router;