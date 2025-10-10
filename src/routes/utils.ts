import { Request, Response } from 'express';

export const notImplementedHandler = (req: Request, res: Response) => {
  res.status(501).json({ error: `Route not implemented: ${req.method} ${req.originalUrl}` });
};
