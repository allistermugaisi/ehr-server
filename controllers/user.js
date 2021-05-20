import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
// import dotenv from 'dotenv';

import User from '../models/Users.js';

// if (process.env.NODE_ENV !== 'production') {
// 	dotenv.config();
// }

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
	const { email, password, confirm_password, firstName, lastName } = req.body;

	try {
		const existingUser = await User.findOne({ email });

		// Check existing user
		if (existingUser)
			return res.status(403).json({ message: 'User already exists!' });

		// Simple validation
		if (!email || !password || !confirm_password || !firstName || !lastName)
			return res.status(400).json({ message: 'Please enter all fields!' });

		// Check password strength
		if (password.length < 8)
			return res
				.status(400)
				.json({ message: 'Password should be atleast 8 characters.' });

		// Compare passwords
		if (password !== confirm_password)
			return res.status(400).json({ message: 'Passwords do not match!' });

		// Hash user password
		const hashedPassword = await bcrypt.hash(password, 12);
		const hashedConfirmPassword = await bcrypt.hash(confirm_password, 12);

		// Create user
		await User.create({
			email,
			password: hashedPassword,
			confirm_password: hashedConfirmPassword,
			name: `${firstName} ${lastName}`,
		});

		res.status(200).json({ message: 'New user created!' });
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: 'Something went wrong.' });
	}
};
