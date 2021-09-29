import express from 'express';

import {
	signup,
	signin,
	accountActivate,
	verifyCode,
} from '../controllers/user.js';

const router = express.Router();

router.post('/signin', signin);
router.post('/signup', signup);
router.post('/account/activate', accountActivate);
router.post('/verify', verifyCode);

export default router;
