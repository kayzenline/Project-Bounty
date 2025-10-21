import { Router, Request, Response } from 'express';
import { adminAstronautCreate, adminAstronautInfo } from '../../../astronaut';
import { findSessionFromSessionId } from '../../../helper';
import { errorCategories as EC } from '../../../testSamples';

const router = Router();

// POST /v1/admin/astronaut - Create new astronaut
router.post('/', (req: Request, res: Response) => {
  const { controlUserSessionId } = req.headers;

  // Check session
  if (!controlUserSessionId || typeof controlUserSessionId !== 'string') {
    return res.status(401).json({ error: 'ControlUserSessionId is empty or invalid' });
  }

  const session = findSessionFromSessionId(controlUserSessionId);
  if (!session) {
    return res.status(401).json({ error: 'ControlUserSessionId is empty or invalid' });
  }

  const { nameFirst, nameLast, rank, age, weight, height } = req.body;
  const result = adminAstronautCreate(nameFirst, nameLast, rank, age, weight, height);

  if (result.error) {
    const statusCode = result.errorCategory === EC.BAD_INPUT ? 400 : 401;
    return res.status(statusCode).json({ error: result.error });
  }

  return res.status(200).json(result);
});

// GET /v1/admin/astronaut/:astronautid - Get astronaut info
router.get('/:astronautid', (req: Request, res: Response) => {
  const { controlUserSessionId } = req.headers;

  // Check session
  if (!controlUserSessionId || typeof controlUserSessionId !== 'string') {
    return res.status(401).json({ error: 'ControlUserSessionId is empty or invalid' });
  }

  const session = findSessionFromSessionId(controlUserSessionId);
  if (!session) {
    return res.status(401).json({ error: 'ControlUserSessionId is empty or invalid' });
  }

  const astronautId = parseInt(req.params.astronautid);
  if (isNaN(astronautId)) {
    return res.status(400).json({ error: 'Invalid astronaut ID' });
  }

  const result = adminAstronautInfo(astronautId);

  if (result.error) {
    const statusCode = result.errorCategory === EC.BAD_INPUT ? 400 : 401;
    return res.status(statusCode).json({ error: result.error });
  }

  return res.status(200).json(result);
});

// Keep other routes as not implemented for now
router.get('/pool', (req: Request, res: Response) => {
  res.status(501).json({ error: 'Not implemented' });
});

router.put('/:astronautid', (req: Request, res: Response) => {
  res.status(501).json({ error: 'Not implemented' });
});

router.delete('/:astronautid', (req: Request, res: Response) => {
  res.status(501).json({ error: 'Not implemented' });
});

export default router;
