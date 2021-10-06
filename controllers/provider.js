import Provider from '../models/Providers.js';

let crypto;
try {
	crypto = await import('crypto');
} catch (err) {
	console.log('crypto support is disabled!');
}

export const create = async (req, res) => {
	const { firstName, lastName, email, gender, role, practiceID } = req.body;
	const wishlist =
		'0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz~!@-#$';
	const length = 10;

	const generatePassword = (length, wishlist) =>
		Array.from(crypto.randomFillSync(new Uint32Array(length)))
			.map((x) => wishlist[x % wishlist.length])
			.join('');

	try {
		const existingUser = await Provider.findOne({ email });

		// Check existing user
		if (existingUser)
			return res.status(403).json({ message: 'Provider already exists!' });

		// Simple validation
		if (!email || !gender || !practiceID || !role || !firstName || !lastName)
			return res.status(400).json({ message: 'Please enter all fields!' });

		const password = generatePassword(length, wishlist);

		// Hash provider generated password
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
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: error });
	}
};
