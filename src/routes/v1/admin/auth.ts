import { Router, Request, Response, NextFunction } from 'express';
import { adminAuthRegister, adminAuthLogin, adminAuthLogout } from '../../../auth';

const router = Router();

router.post('/register', (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, nameFirst, nameLast } = req.body || {};

    const result = adminAuthRegister(email, password, nameFirst, nameLast);
    return res.status(200).json({ controlUserSessionId: result.controlUserSessionId });
  } catch (e) {
    next(e);
  }
});
router.post('/login', (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body || {};

    const result = adminAuthLogin(email, password);
    return res.status(200).json({ controlUserSessionId: result.controlUserSessionId });
  } catch (e) {
    next(e);
  }
});
router.post('/logout', (req: Request, res: Response, next: NextFunction) => {
  try {
    // Header names are case-insensitive; Express normalizes internally
    const controlUserSessionId = req.header('controlUserSessionId');

    const result = adminAuthLogout(controlUserSessionId as string);
    return res.status(200).json(result);
  } catch (e) {
    next(e);
  }
});

export default router;
