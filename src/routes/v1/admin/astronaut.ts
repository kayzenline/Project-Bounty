import { Router, Request, Response } from 'express';
import { adminAstronautCreate, adminAstronautInfo, adminAstronautDelete, adminAstronautEdit, adminAstronautPool } from '../../../astronaut';
import { httpToErrorCategories } from '../../../testSamples';

const router = Router();

// POST /v1/admin/astronaut - Create new astronaut
router.post('/', (req: Request, res: Response) => {
  const controlUserSessionId = req.header('controlUserSessionId');
  const { nameFirst, nameLast, rank, age, weight, height } = req.body;

  const result = adminAstronautCreate(controlUserSessionId, nameFirst, nameLast, rank, age, weight, height);

  if ('error' in result) {
    const status = httpToErrorCategories[result.errorCategory as keyof typeof httpToErrorCategories];
    return res.status(status).json({ error: result.error });
  }

  return res.status(200).json(result);
});

router.get('/pool', (req: Request, res: Response) => {
  const controlUserSessionId = req.header('controlUserSessionId');

  const result = adminAstronautPool(controlUserSessionId);

  if ('error' in result) {
    const status = httpToErrorCategories[result.errorCategory as keyof typeof httpToErrorCategories];
    return res.status(status).json({ error: result.error });
  }

  return res.status(200).json(result);
});

// GET /v1/admin/astronaut/:astronautid - Get astronaut info
router.get('/:astronautid', (req: Request, res: Response) => {
  const controlUserSessionId = req.header('controlUserSessionId');

  const astronautId = parseInt(req.params.astronautid);
  if (isNaN(astronautId)) {
    return res.status(400).json({ error: 'astronautid is invalid' });
  }

  const result = adminAstronautInfo(controlUserSessionId, astronautId);

  if ('error' in result) {
    const status = httpToErrorCategories[result.errorCategory as keyof typeof httpToErrorCategories];
    return res.status(status).json({ error: result.error });
  }

  return res.status(200).json(result);
});

router.put('/:astronautid', (req, res) => {
  const controlUserSessionId = req.header('controlUserSessionId');
  const astronautId = parseInt(req.params.astronautid);
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
  const astronautId = parseInt(req.params.astronautid);

  const result = adminAstronautDelete(controlUserSessionId, astronautId);
  if ('error' in result) {
    const status = httpToErrorCategories[result.errorCategory as keyof typeof httpToErrorCategories];
    return res.status(status).json({ error: result.error });
  }
  return res.status(200).json({});
});

export default router;
