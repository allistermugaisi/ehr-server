import express from 'express';

import {
	signup,
	signin,
	accountActivate,
	verifyCode,
	forgotPassword,
} from '../controllers/user.js';

const router = express.Router();

router.post('/signin', signin);
router.post('/signup', signup);
router.post('/account/activate', accountActivate);
router.post('/verify', verifyCode);
router.put('/forgot-password', forgotPassword);

export default router;
