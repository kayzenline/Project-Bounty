import { Router, Request, Response } from 'express';
import { adminAuthRegister, adminAuthLogin, adminAuthLogout } from '../../../logic/auth';

const router = Router();

router.post('/register', (req: Request, res: Response) => {
  try {
    const { email, password, nameFirst, nameLast } = req.body || {};

    const result = adminAuthRegister(email, password, nameFirst, nameLast);
    return res.status(200).json({ controlUserSessionId: result.controlUserSessionId });
  } catch (e) {
    return res.status(e.status).json({ error: e.message });
  }
});
router.post('/login', (req: Request, res: Response) => {
  try {
    const { email, password } = req.body || {};

    const result = adminAuthLogin(email, password);
    return res.status(200).json({ controlUserSessionId: result.controlUserSessionId });
  } catch (e) {
    return res.status(e.status).json({ error: e.message });
  }
});
router.post('/logout', (req: Request, res: Response) => {
  try {
    // Header names are case-insensitive; Express normalizes internally
    const controlUserSessionId = req.header('controlUserSessionId');

    const result = adminAuthLogout(controlUserSessionId as string);
    return res.status(200).json(result);
  } catch (e) {
    return res.status(e.status).json({ error: e.message });
  }
});

export default router;
