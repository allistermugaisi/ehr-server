import mailgun from 'mailgun-js';
import dotenv from 'dotenv';

if (process.env.NODE_ENV !== 'production') {
	dotenv.config();
}

const mg = mailgun({
	apiKey: process.env.MAILGUN_API_KEY,
	domain: process.env.DOMAIN,
});

const sendMail = async (message, token, res) => {
	const { from, to, subject, attachment, template, html, text } = message;
	const data = {
		from,
		to,
		subject,
		text,
		template,
		inline: attachment,
		html,
		'h:X-Mailgun-Variables': JSON.stringify({ token: `${token}` }),
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
