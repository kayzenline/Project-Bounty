import { Router, Request, Response, NextFunction } from 'express';
import {
  adminControlUserDetails,
  adminControlUserDetailsUpdate,
  adminControlUserPasswordUpdate
} from '../../../logic/auth';
import { findSessionFromSessionId } from '../../../logic/helper';
import HTTPError from 'http-errors';
const router = Router();

router.get('/details', (req: Request, res: Response) => {
  try {
    const controlUserSessionId = req.header('ControlUserSessionId');
    if (!controlUserSessionId) {
      throw HTTPError(401, 'ControlUserSessionId is empty or invalid');
    }
    const session = findSessionFromSessionId(controlUserSessionId);
    if (!session) {
      throw HTTPError(401, 'ControlUserSessionId is empty or invalid');
    }
    const controlUserId = session.controlUserId;
    const result = adminControlUserDetails(controlUserId);

    return res.status(200).json({ user: result.user });
  } catch (e) {
    return res.status(e.status).json({ error: e.message });
  }
});

router.put('/details', (req: Request, res: Response) => {
  try {
    const controlUserSessionId = req.header('ControlUserSessionId');
    const { email, nameFirst, nameLast } = req.body;
    const session = findSessionFromSessionId(controlUserSessionId);
    if (!session) {
      throw HTTPError(401, 'ControlUserSessionId is empty or invalid');
    }

    const controlUserId = session.controlUserId;
    const result = adminControlUserDetailsUpdate(controlUserId, email, nameFirst, nameLast);
    return res.status(200).json(result);
  } catch (e) {
    return res.status(e.status).json({ error: e.message });
  }
});

router.put('/password', (req: Request, res: Response) => {
  try {
    const controlUserSessionId = req.header('ControlUserSessionId');
    const { oldPassword, newPassword } = req.body;
    const session = findSessionFromSessionId(controlUserSessionId);
    if (!session) {
      throw HTTPError(401, 'ControlUserSessionId is empty or invalid');
    }
    const controlUserId = session.controlUserId;
    const result = adminControlUserPasswordUpdate(controlUserId, oldPassword, newPassword);
    return res.status(200).json(result);
  } catch (e) {
    return res.status(e.status).json({ error: e.message });
  }
});

export default router;
