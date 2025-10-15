import { Router } from 'express';
import adminRouter from './admin';
import clearRouter from './clear';

const router = Router();

router.use('/admin', adminRouter);
router.use('/clear', clearRouter);

export default router;
