import { Router, Request, Response, NextFunction } from 'express';
import { clear } from '../../other'; 

const router = Router();

router.delete('/', (_req: Request, res: Response, next: NextFunction) => {
  try {
    const result = clear();
    return res.status(200).json(result); 
  } catch (err) {
    return next(err);
  }
});

export default router;
