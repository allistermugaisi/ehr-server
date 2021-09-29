import express from 'express';
import sendMail from '../controllers/mail.js';

const router = express.Router();

router.post('/mail', async (req, res, next) => {
	const { recipient, message } = req.body;
	try {
		await sendMail(recipient, message);
		res.json({ message: 'Your mail has been sent' });
		await next();
	} catch (e) {
		await next(e);
	}
});

export default router;
