import { Router } from 'express';
import v1Router from './v1';
const router = Router();

router.use('/v1', v1Router);
// Align clear route with README/spec: provide DELETE /clear and /clear/v1

export default router;
