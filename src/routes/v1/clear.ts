import { Router, Request, Response, NextFunction } from 'express';
import { clear } from '../../other';

const router = Router();

router.delete('/', (_req: Request, res: Response, next: NextFunction) => {
  try {
    return res.status(200).json(clear());
  } catch (err) {
    return next(err);
  }
});

export default router;
