import { Router, Request, Response, NextFunction } from 'express';
import { setData } from '../../dataStore';

const router = Router();

router.delete('/', (_req: Request, res: Response, next: NextFunction) => {
  try {
    setData({
      controlUsers: [],
      spaceMissions: [],
      sessions: [],
      nextControlUserId: 1,
      nextMissionId: 1,
    });
    return res.status(200).json({});
  } catch (err) {
    return next(err);
  }
});

export default router;