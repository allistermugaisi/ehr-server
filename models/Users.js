import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
	id: { type: String },
	name: {
		type: String,
		maxlength: 50,
		required: true,
	},
	email: {
		type: String,
		trim: true,
		unique: 1,
		required: true,
	},
	password: {
		type: String,
		minlength: 6,
		required: true,
	},
	confirm_password: {
		type: String,
		minlength: 6,
		required: true,
	},
});

export default mongoose.model('User', userSchema);
