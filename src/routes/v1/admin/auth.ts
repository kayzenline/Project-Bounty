import { Router } from 'express';
import { adminAuthRegister, adminAuthLogin, adminAuthLogout } from '../../../auth';
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
router.post('/login', (req, res) => {
  const { email, password } = req.body || {};

  const result = adminAuthLogin(email, password);

  if ('error' in result) {
    const status = httpToErrorCategories[result.errorCategory as keyof typeof httpToErrorCategories] || 400;
    return res.status(status).json({ error: result.error });
  }

  return res.status(200).json({ controlUserSessionId: result.controlUserSessionId });
});
router.post('/logout', (req, res) => {
  // Header names are case-insensitive; Express normalizes internally
  const controlUserSessionId = req.header('controlUserSessionId') as string | undefined;

  const result = adminAuthLogout(controlUserSessionId as string);

  if ('error' in result) {
    const status = httpToErrorCategories[result.errorCategory as keyof typeof httpToErrorCategories] || 401;
    return res.status(status).json({ error: result.error });
  }

  return res.status(200).json({});
});

export default router;
