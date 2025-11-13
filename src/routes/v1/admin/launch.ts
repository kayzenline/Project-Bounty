import { Router, Request, Response } from 'express';
import HTTPError from 'http-errors';
import { adminLaunchList } from '../../../logic/launch';

const router = Router();

router.get('/list', (req: Request, res: Response) => {
  try {
    const controlUserSessionId = req.header('controlUserSessionId');
    if (!controlUserSessionId) {
      throw HTTPError(401, 'ControlUserSessionId is empty or invalid');
    }

    const result = adminLaunchList(controlUserSessionId);
    return res.status(200).json(result);
  } catch (e) {
    const err = e as { status?: number; message: string };
    return res.status(err.status ?? 500).json({ error: err.message });
  }
});

export default router;
