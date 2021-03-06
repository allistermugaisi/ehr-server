import Provider from '../models/Providers.js';

let crypto;
try {
	crypto = await import('crypto');
} catch (err) {
	console.log('crypto support is disabled!');
}

export const createProvider = async (req, res) => {
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

export const getProviders = async (req, res) => {
	try {
		const providers = await Provider.find();

		res.status(200).json(providers);
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};

export const getProvider = async (req, res) => {
	const { id } = req.params;

	try {
		const provider = await Provider.findById(id);

		res.status(200).json(provider);
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};

export const updateProvider = async (req, res) => {
	const { id } = req.params;
	const { name, email, password, gender, role, image } = req.body;

	if (!mongoose.Types.ObjectId.isValid(id))
		return res.status(404).send(`No provider with id: ${id}`);

	const updatedProvider = {
		name,
		email,
		password,
		gender,
		role,
		image,
		_id: id,
	};

	await Provider.findByIdAndUpdate(id, updatedProvider, { new: true });

	res.json(updatedProvider);
};
