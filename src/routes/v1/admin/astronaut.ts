import { Router, Request, Response, NextFunction } from 'express';
import { adminAstronautCreate, adminAstronautInfo, adminAstronautDelete, adminAstronautEdit, adminAstronautPool } from '../../../astronaut';
import HTTPError from 'http-errors';

const router = Router();

// POST /v1/admin/astronaut - Create new astronaut
router.post('/', (req: Request, res: Response, next: NextFunction) => {
  try {
    const controlUserSessionId = req.header('controlUserSessionId');
    const { nameFirst, nameLast, rank, age, weight, height } = req.body;

    const result = adminAstronautCreate(controlUserSessionId, nameFirst, nameLast, rank, age, weight, height);
    return res.status(200).json(result);
  } catch (e) {
    next(e);
  }
});

router.get('/pool', (req: Request, res: Response, next: NextFunction) => {
  try {
    const controlUserSessionId = req.header('controlUserSessionId');

    const result = adminAstronautPool(controlUserSessionId);

    return res.status(200).json(result);
  } catch (e) {
    next(e);
  }
});

// GET /v1/admin/astronaut/:astronautid - Get astronaut info
router.get('/:astronautid', (req: Request, res: Response, next: NextFunction) => {
  try {
    const controlUserSessionId = req.header('controlUserSessionId');

    const astronautId = parseInt(req.params.astronautid);
    if (isNaN(astronautId)) {
      throw HTTPError(400, 'astronautid is invalid');
    }

    const result = adminAstronautInfo(controlUserSessionId, astronautId);
    return res.status(200).json(result.response);
  } catch (e) {
    next(e);
  }
});

router.put('/:astronautid', (req: Request, res: Response, next: NextFunction) => {
  try {
    const controlUserSessionId = req.header('controlUserSessionId');
    const astronautId = parseInt(req.params.astronautid);
    const { nameFirst, nameLast, rank, age, weight, height } = req.body;

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
    return res.status(200).json(result);
  } catch (e) {
    next(e);
  }
});

router.delete('/:astronautid', (req: Request, res: Response, next: NextFunction) => {
  try {
    const controlUserSessionId = req.header('controlUserSessionId');
    const astronautId = parseInt(req.params.astronautid);

    const result = adminAstronautDelete(controlUserSessionId, astronautId);
    return res.status(200).json(result);
  } catch (e) {
    next(e);
  }
});

export default router;
