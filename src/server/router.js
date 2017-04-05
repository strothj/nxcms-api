import { Router } from 'express';

import { handlers as postHandlers } from './posts';

(async () => {
  console.log('babel test'); // eslint-disable-line no-console
})();

const router = Router();
router.get('/posts', postHandlers.get);

export default router;
