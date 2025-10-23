import { Router } from 'express';
import { notImplementedHandler } from '../../utils';
// import { deleteAstronaut, editAstronaut, seeAstronautPool, createAstronaut, getAstronautInfo, assginAstronaut, unassginAstronaut } from '../../../astronaut';
// import { httpToErrorCategories } from '../../../testSamples';

const router = Router();

router.get('/pool', notImplementedHandler);
router.post('/', notImplementedHandler);
router.get('/:astronautid', notImplementedHandler);
// router.put('/:astronautid', (req, res) => {
//   const controlUserSessionId = req.header('controlUserSessionId');
//   const astronautId = Number(req.params.astronautid);
//   const { nameFirst, nameLast, rank, age, weight, height } = req.body || {};

//   const result = editAstronaut(
//     controlUserSessionId,
//     astronautId,
//     nameFirst,
//     nameLast,
//     rank,
//     age,
//     weight,
//     height
//   );
//   if ('error' in result) {
//     const status = httpToErrorCategories[result.errorCategory as keyof typeof httpToErrorCategories];
//     return res.status(status).json({ error: result.error });
//   }
//   return res.status(200).json({});
// });
// router.delete('/:astronautid', (req, res) => {
//   const controlUserSessionId = req.header('controlUserSessionId');
//   const astronautId = Number(req.params.astronautid);

//   const result = deleteAstronaut(controlUserSessionId, astronautId);
//   if ('error' in result) {
//     const status = httpToErrorCategories[result.errorCategory as keyof typeof httpToErrorCategories];
//     return res.status(status).json({ error: result.error });
//   }
//   return res.status(200).json({});
// });

export default router;
