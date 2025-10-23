import { Router, Request, Response, NextFunction } from 'express';
import { notImplementedHandler } from '../../utils';
import { getData } from '../../../dataStore';
import { adminMissionNameUpdate, adminMissionTargetUpdate, adminMissionDescriptionUpdate, adminMissionRemove, adminMissionCreate, adminMissionList, adminMissionTransfer, adminMissionInfo } from '../../../mission';
import { httpToErrorCategories } from '../../../testSamples';
import { findSessionFromSessionId } from '../../../helper';

const router = Router();

router.get('/list', (req: Request, res: Response, next: NextFunction) => {
  const controlUserSessionId = req.header('controlUserSessionId');

  try {
    if (!controlUserSessionId) {
      return res.status(401).json({ error: 'ControlUserSessionId is empty or invalid' });
    }
    const data = getData();
    const session = data.sessions.find(s => s.controlUserSessionId === controlUserSessionId);
    if (!session) {
      return res.status(401).json({ error: 'ControlUserSessionId is empty or invalid' });
    }
    const result = adminMissionList(session.controlUserId);
    if ('error' in result) {
      const status = httpToErrorCategories[result.errorCategory as keyof typeof httpToErrorCategories];
      return res.status(status).json({ error: result.error });
    }

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

router.post('/', (req: Request, res: Response, next: NextFunction) => {
  const controlUserSessionId = (req.header('controlUserSessionId'));
  const { name, description, target } = req.body;

  try {
    if (!controlUserSessionId) {
      return res.status(401).json({ error: 'ControlUserSessionId is empty or invalid' });
    }

    const session = findSessionFromSessionId(controlUserSessionId);
    if (!session) {
      return res.status(401).json({ error: 'ControlUserSessionId is empty or invalid' });
    }

    const result = adminMissionCreate(session.controlUserId, name, description, target);
    if ('error' in result) {
      let status: number;

      if (result.errorCategory in httpToErrorCategories) {
        status = httpToErrorCategories[
          result.errorCategory as keyof typeof httpToErrorCategories
        ];
      } else {
        status = 500;
      }
      return res.status(status).json({ error: result.error });
    }

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

router.get('/:missionid', (req: Request, res: Response, next: NextFunction) => {
  const controlUserSessionId = req.header('controlUserSessionId');
  const missionId = Number(req.params.missionid);

  try {
    if (!controlUserSessionId) {
      return res.status(401).json({ error: 'ControlUserSessionId is empty or invalid' });
    }

    const session = findSessionFromSessionId(controlUserSessionId);
    if (!session) {
      return res.status(401).json({ error: 'ControlUserSessionId is empty or invalid' });
    }

    const result = adminMissionInfo(session.controlUserId, missionId);
    if ('error' in result) {
      const status = httpToErrorCategories[
        (result as { error: string; errorCategory: keyof typeof httpToErrorCategories }).errorCategory
      ];
      return res.status(status).json({ error: result.error });
    }
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

router.delete('/:missionid', (req: Request, res: Response, next: NextFunction) => {
  const controlUserSessionId = req.header('controlUserSessionId');
  const missionId = Number(req.params.missionid);

  try {
    if (!controlUserSessionId) {
      return res.status(401).json({ error: 'ControlUserSessionId is empty or invalid' });
    }

    const session = findSessionFromSessionId(controlUserSessionId);
    if (!session) {
      return res.status(401).json({ error: 'ControlUserSessionId is empty or invalid' });
    }

    const result = adminMissionRemove(session.controlUserId, missionId);
    if ('error' in result) {
      const status = httpToErrorCategories[
        (result as { error: string; errorCategory: keyof typeof httpToErrorCategories }).errorCategory
      ];
      return res.status(status).json({ error: result.error });
    }

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

router.put('/:missionId/name', (req: Request, res: Response) => {
  const controlUserSessionId = req.header('controlUserSessionId');
  const missionId = Number(req.params.missionId);
  const name = req.body || {};

  const session = findSessionFromSessionId(controlUserSessionId);
  if (!session) {
    return res.status(401).json({ error: 'ControlUserSessionId is empty or invalid' });
  }

  const controlUserId = session.controlUserId;
  const result = adminMissionNameUpdate(controlUserId, missionId, name.name);
  if ('error' in result) {
    const status = httpToErrorCategories[result.errorCategory as keyof typeof httpToErrorCategories];
    return res.status(status).json({ error: result.error });
  }

  return res.status(200).json({});
});

router.put('/:missionId/description', (req: Request, res: Response) => {
  const controlUserSessionId = req.header('controlUserSessionId');
  const missionId = Number(req.params.missionId);
  const description = req.body || {};

  const session = findSessionFromSessionId(controlUserSessionId);
  if (!session) {
    return res.status(401).json({ error: 'ControlUserSessionId is empty or invalid' });
  }

  const controlUserId = session.controlUserId;
  const result = adminMissionDescriptionUpdate(controlUserId, missionId, description.description);
  if ('error' in result) {
    const status = httpToErrorCategories[result.errorCategory as keyof typeof httpToErrorCategories];
    return res.status(status).json({ error: result.error });
  }

  return res.status(200).json({});
});

router.put('/:missionId/target', (req: Request, res: Response) => {
  const controlUserSessionId = req.header('controlUserSessionId');
  const missionId = Number(req.params.missionId);
  const target = req.body || {};

  const session = findSessionFromSessionId(controlUserSessionId);
  if (!session) {
    return res.status(401).json({ error: 'ControlUserSessionId is empty or invalid' });
  }

  const controlUserId = session.controlUserId;
  const result = adminMissionTargetUpdate(controlUserId, missionId, target.target);
  if ('error' in result) {
    const status = httpToErrorCategories[result.errorCategory as keyof typeof httpToErrorCategories];
    return res.status(status).json({ error: result.error });
  }

  return res.status(200).json({});
});

router.post('/:missionid/transfer', (req: Request, res: Response, next: NextFunction) => {
  const controlUserSessionId = req.header('controlUserSessionId');
  const missionId = Number(req.params.missionid);
  const { userEmail } = req.body;

  try {
    if (!controlUserSessionId) {
      return res.status(401).json({ error: 'ControlUserSessionId is empty or invalid' });
    }

    const data = getData();
    const sessions = (data.sessions || []) as { controlUserSessionId: string; controlUserId: number }[];
    const session = sessions.find(s => s.controlUserSessionId === controlUserSessionId);
    if (!session) {
      return res.status(401).json({ error: 'ControlUserSessionId is empty or invalid' });
    }

    type TransferError = {
      error: string;
      errorCategory: keyof typeof httpToErrorCategories;
    };
    type TransferSuccess = Record<string, never>;
    type TransferResult = TransferError | TransferSuccess;

    const result: TransferResult = adminMissionTransfer(session.controlUserId, missionId, userEmail);

    if ('error' in result) {
      const status = httpToErrorCategories[result.errorCategory] ?? 400;
      return res.status(status).json({ error: result.error });
    }

    return res.status(200).json(result);
  } catch (err) {
    return next(err);
  }
});

/* router.post('/:missionid/assign/:astronautid', (req ,res)=>{
  const controlUserSessionId = req.headers.controlusersessionid as string;
  if(!controlUserSessionId){
    return res.status(401).json({
      error: 'controlUserSessionId is invalid'
    });
  }
  const missionId = parseInt(req.params.missionid);
  const astronautId = parseInt(req.params.astronautid);
  const result=assignAstronaut(controlUserSessionId,missionId,astronautId);
  if('error' in result){
    const status = httpToErrorCategories[result.errorCategory as keyof typeof httpToErrorCategories];
    return res.status(status).json({ error: result.error });
  }
  return res.status(200).json({});
});
*/

router.delete('/:missionid/assign/:astronautid', notImplementedHandler);

export default router;
