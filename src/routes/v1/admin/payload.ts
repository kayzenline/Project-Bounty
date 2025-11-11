import { Router, Request, Response, NextFunction } from 'express';
import router from '.';

router.get('./deployedList', (req: Request, res: Response, next: NextFunction) => {
  try {
    const controlUserSessionId = req.header('controlUserSessionId');
    
  } catch (e) {
    return res.status(e.status).json({ error: e.message });
  }

}) 

