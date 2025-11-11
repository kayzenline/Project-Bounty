import { Router, Request, Response } from 'express';
import { adminPayloadDeployedList } from '../../../logic/payload';

const router = Router();

router.get('/deployedList', (req: Request, res: Response) => {
  try {
    const controlUserSessionId = req.header('controlUserSessionId');
    const result = adminPayloadDeployedList(controlUserSessionId);
    return res.status(200).json(result);
  } catch (e) {
    const status = e.status ?? 500;
    return res.status(status).json({ error: e.message });
  }
});

export default router;
