import { Router } from 'express';

import { handlers as postHandlers } from './posts';

const router = Router();
router.get('/posts', postHandlers.get);

export default router;
