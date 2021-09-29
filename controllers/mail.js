import mailgun from 'mailgun-js';
import dotenv from 'dotenv';

if (process.env.NODE_ENV !== 'production') {
	dotenv.config();
}

const mg = mailgun({
	apiKey: process.env.MAILGUN_API_KEY,
	domain: process.env.DOMAIN,
});

const sendMail = async (recipient, message, attachment) => {
	const data = {
		from: 'AfyaEHR <allister@ehr.afyaservices.us>',
		to: recipient,
		subject: message.subject,
		text: message.text,
		inline: attachment,
		html: message.html,
	};

	await mg.messages().send(data, (error, body) => {
		if (error) {
			return res.status(400).json({ error: error });
		}
		console.log(body);
		return res.status(200).json({
			message: 'Email has been sent, kindly activate your account.',
		});
	});
};

export default sendMail;
