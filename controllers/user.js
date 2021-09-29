import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import User from '../models/Users.js';
import mailgun from 'mailgun-js';
import dotenv from 'dotenv';

if (process.env.NODE_ENV !== 'production') {
	dotenv.config();
}

const mg = mailgun({
	apiKey: process.env.MAILGUN_API_KEY,
	domain: process.env.DOMAIN,
});

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

		res.status(200).json({ current_user: existingUser.name, token });
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: 'Something went wrong.' });
	}
};

export const signup = async (req, res) => {
	const { email, password, confirmPassword, firstName, lastName } = req.body;

	try {
		const existingUser = await User.findOne({ email });

		// Check existing user
		if (existingUser)
			return res.status(403).json({ message: 'User already exists!' });

		// Simple validation
		if (!email || !password || !confirmPassword || !firstName || !lastName)
			return res.status(400).json({ message: 'Please enter all fields!' });

		// Check password strength
		if (password.length < 8)
			return res
				.status(400)
				.json({ message: 'Password should be atleast 8 characters.' });

		// Compare passwords
		if (password !== confirmPassword)
			return res.status(400).json({ message: 'Passwords do not match!' });

		// Hash user password
		const hashedPassword = await bcrypt.hash(password, 12);

		let name = `${firstName} ${lastName}`;

		const token = jwt.sign(
			{ name, email, hashedPassword },
			process.env.JWT_ACC_ACTIVATION,
			{ expiresIn: '20m' }
		);

		const data = {
			from: 'AfyaEHR <allister@ehr.afyaservices.us>',
			to: email,
			subject: 'Account Activation Link',
			html: `
			<h2>Please click on the given link to activate your account</h2><br/>
			<a href='${process.env.CLIENT_URL}/authentication/activate/${token}'>${process.env.CLIENT_URL}/authentication/activate/${token}</a>
			`,
		};

		await mg.messages().send(data, (error, body) => {
			if (error) {
				console.log('Mail error:', error);
				return res.status(400).json({ error: error });
			}
			console.log(body);
			return res.status(200).json({
				message: 'Email has been sent, kindly activate your account.',
			});
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: 'Something went wrong.' });
	}
};

export const accountActivate = async (req, res) => {
	const { token } = req.body;
	console.log(token);
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
					password: hashedPassword,
				});

				res.status(200).json({ message: 'New user created!' });
			}
		);
	} else {
		return res.status(500).json({ error: 'Something went wrong.' });
	}
};
