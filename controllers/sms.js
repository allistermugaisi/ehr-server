import twilio from 'twilio';
import dotenv from 'dotenv';

if (process.env.NODE_ENV !== 'production') {
	dotenv.config();
}

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const client = twilio(accountSid, authToken);

export const sendSMS = (phone, message, channel) => {
	// client.messages
	// 	.create({
	// 		body: message,
	// 		from: parseInt(process.env.TWILIO_PHONE_NUMBER),
	// 		to: phone,
	// 	})
	// 	.then((message) => console.log(message.sid));

	client.verify
		.services(process.env.TWILIO_SERVICE_ID)
		.verifications.create({
			to: `+${phone}`,
			channel: channel === 'call' ? 'call' : 'sms',
		})
		.then((data) => {
			res.status(200).json({
				message,
				phonenumber: phone,
				data,
			});
		});
};

export const verifySMS = (phone, message, code) => {
	client.verify
		.services(process.env.TWILIO_SERVICE_ID)
		.verificationChecks.create({
			to: `+${phone}`,
			code,
		})
		.then((data) => {
			if (data.status === 'approved') {
				res.status(200).json({
					message,
					data,
				});
			}
		});
};
