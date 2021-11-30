import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import User from '../models/Users.js';
import { sendSMS, verifySMS } from '../controllers/sms.js';
import sendMail from './mail.js';

export const signin = async (req, res) => {
	const { email, password } = req.body;

	try {
		const existingUser = await User.findOne({ email });

		// Check existing user
		if (!existingUser)
			return res.status(404).json({ message: "User doesn't exist!" });

		// Simple validation
		if (!email || !password)
			return res.status(400).json({ message: 'Please enter all fields!' });

		const isPasswordCorrect = await bcrypt.compare(
			password,
			existingUser.password
		);

		// Validate password
		if (!isPasswordCorrect)
			return res.status(401).json({ message: 'Invalid credentials!' });

		// Authenticate user
		const token = jwt.sign(
			{ email: existingUser.email, id: existingUser._id },
			process.env.JWT_SECRET,
			{ expiresIn: '7 days' }
		);

		// const welcomeMessage = 'Your AfyaEHR verification code';
		// const phone = +254790516067;
		// const sms = 'sms';

		// sendSMS(phone, welcomeMessage, sms);

		res.status(200).json({ current_user: existingUser.name, token });
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: 'Something went wrong.' });
	}
};

export const signup = async (req, res) => {
	const {
		email,
		password,
		password_confirmation,
		firstName,
		lastName,
		practice_name,
	} = req.body;

	try {
		const existingUser = await User.findOne({ email });
		const existingPractice = await User.findOne({ practice_name });

		// Check existing user
		if (existingUser)
			return res.status(403).json({ message: 'User already exists!' });

		// Check existing practice
		if (existingPractice)
			return res.status(403).json({ message: 'Practice already exists!' });

		// Simple validation
		if (
			!email ||
			!password ||
			!password_confirmation ||
			!firstName ||
			!lastName
		)
			return res.status(400).json({ message: 'Please enter all fields!' });

		// Check password strength
		if (password.length < 8)
			return res
				.status(400)
				.json({ message: 'Password should be atleast 8 characters.' });

		// Compare passwords
		if (password !== password_confirmation)
			return res.status(400).json({ message: 'Passwords do not match!' });

		// Hash user password
		const hashedPassword = await bcrypt.hash(
			password,
			parseInt(process.env.SALT_ROUNDS)
		);

		let name = `${firstName} ${lastName}`;

		const token = jwt.sign(
			{ name, email, hashedPassword },
			process.env.JWT_ACC_ACTIVATION,
			{ expiresIn: '20m' }
		);

		const message = {
			from: 'AfyaEHR <allister@ehr.afyaservices.us>',
			to: email,
			subject: 'Account Activation Link',
			html: '',
			text: '',
			attachment: '',
			template: 'action',
		};

		sendMail(message, token, res);
	} catch (error) {
		res.status(500).json({ message: error });
	}
};

export const accountActivate = async (req, res) => {
	const { token } = req.body;
	if (token) {
		jwt.verify(
			token,
			process.env.JWT_ACC_ACTIVATION,
			async (err, decodedToken) => {
				if (err) {
					console.log(err);
					return res.status(400).json({ error: 'Incorrect or expired token.' });
				}
				const { name, email, hashedPassword } = decodedToken;

				// Create user
				await User.create({
					name,
					email,
					isEmailVerified: true,
					password: hashedPassword,
				});

				res.status(200).json({ message: 'New user created!' });
			}
		);
	} else {
		return res.status(500).json({ error: 'Something went wrong.' });
	}
};

export const verifyCode = async (req, res) => {
	console.log(req.body);
	if (req.body.phonenumber && req.body.code.length === 6) {
		const message = 'User is Verified!';
		const phone = req.body.phonenumber;
		const code = req.body.code;

		await verifySMS(phone, message, code);
	} else {
		res.status(400).json({
			message: 'Wrong phone number or code :(',
			phonenumber: req.body.phonenumber,
			data,
		});
	}
};

export const forgotPassword = async (req, res) => {
	const { email } = req.body;

	const existingUser = await User.findOne({ email });

	// Check existing user
	if (!existingUser)
		return res.status(403).json({ message: 'User does not exist exists!' });

	const token = jwt.sign({ _id: user._id }, process.env.RESET_PASSWORD_KEY, {
		expiresIn: '20m',
	});

	const message = {
		from: 'AfyaEHR <allister@ehr.afyaservices.us>',
		to: email,
		subject: 'Account Activation Link',
		html: '',
		text: '',
		attachment: '',
		template: 'action',
	};
};
