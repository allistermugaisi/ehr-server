import express from 'express';

import { signup, signin, accountActivate } from '../controllers/user.js';

const router = express.Router();

router.post('/signin', signin);
router.post('/signup', signup);
router.post('/account/activate', accountActivate);

export default router;
