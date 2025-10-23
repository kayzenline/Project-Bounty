import { Router, Request, Response } from 'express';
import { adminAstronautCreate, adminAstronautInfo, adminAstronautDelete, adminAstronautEdit } from '../../../astronaut';
import { findSessionFromSessionId } from '../../../helper';
import { httpToErrorCategories } from '../../../testSamples';
import { errorCategories as EC } from '../../../testSamples';
import { loadData } from '../../../dataStore';

const router = Router();

// POST /v1/admin/astronaut - Create new astronaut
router.post('/', (req: Request, res: Response) => {
  loadData();
  const controlUserSessionId = req.header('controlUserSessionId');

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

  if ('error' in result) {
    const statusCode = result.errorCategory === EC.BAD_INPUT ? 400 : 401;
    return res.status(statusCode).json({ error: result.error });
  }

  return res.status(200).json(result);
});

// GET /v1/admin/astronaut/:astronautid - Get astronaut info
router.get('/:astronautid', (req: Request, res: Response) => {
  loadData();
  const controlUserSessionId = req.header('controlUserSessionId');

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
    return res.status(400).json({ error: 'astronautid is invalid' });
  }

  const result = adminAstronautInfo(astronautId);

  if ('error' in result) {
    const statusCode = result.errorCategory === EC.BAD_INPUT ? 400 : 401;
    return res.status(statusCode).json({ error: result.error });
  }

  return res.status(200).json(result);
});

router.get('/pool', (req: Request, res: Response) => {
  res.status(501).json({ error: 'Not implemented' });
});

router.put('/:astronautid', (req, res) => {
  const controlUserSessionId = req.header('controlUserSessionId');
  const astronautId = Number(req.params.astronautid);
  const { nameFirst, nameLast, rank, age, weight, height } = req.body || {};

  const result = adminAstronautEdit(
    controlUserSessionId,
    astronautId,
    nameFirst,
    nameLast,
    rank,
    age,
    weight,
    height
  );
  if ('error' in result) {
    const status = httpToErrorCategories[result.errorCategory as keyof typeof httpToErrorCategories];
    return res.status(status).json({ error: result.error });
  }
  return res.status(200).json({});
});

router.delete('/:astronautid', (req, res) => {
  const controlUserSessionId = req.header('controlUserSessionId');
  const astronautId = Number(req.params.astronautid);

  const result = adminAstronautDelete(controlUserSessionId, astronautId);
  if ('error' in result) {
    const status = httpToErrorCategories[result.errorCategory as keyof typeof httpToErrorCategories];
    return res.status(status).json({ error: result.error });
  }
  return res.status(200).json({});
});

export default router;
