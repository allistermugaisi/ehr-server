import mongoose from 'mongoose';

const userSchema = mongoose.Schema(
	{
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
			minlength: 8,
			required: true,
		},
	},
	{ timestamps: true }
);

export default mongoose.model('User', userSchema);
