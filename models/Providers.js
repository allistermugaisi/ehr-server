import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const providerSchema = Schema(
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
		role: {
			type: Number,
			default: 0,
		},
		image: String,
		practice: {
			type: Schema.Types.ObjectId,
			ref: 'User',
		},
		patients: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Patient',
			},
		],
	},
	{ timestamps: true }
);

export default mongoose.model('Provider', providerSchema);
