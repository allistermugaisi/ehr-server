import mongoose from 'mongoose';
const mongoose = mongoose.Schema;

const patientSchema = Schema(
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
		gender: {
			type: String,
		},
		image: String,
		practice: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
		provider: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Provider',
		},
	},
	{ timestamps: true }
);

export default mongoose.model('Patient', patientSchema);
