import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const userSchema = Schema(
	{
		name: {
			type: String,
			maxlength: 50,
			required: true,
		},
		practice_name: {
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
		phone: {
			type: Number,
			maxlength: 15,
			required: true,
			default: 0,
		},
		countryCode: {
			type: Number,
			default: 1,
		},
		password: {
			type: String,
			minlength: 8,
			required: true,
		},
		image: String,
		role: {
			type: Number,
			default: 0,
		},
		token: {
			type: String,
		},
		tokenExp: {
			type: Number,
		},
		isUserActive: {
			type: Boolean,
			default: false,
		},
		isEmailVerified: {
			type: Boolean,
			default: false,
		},
		isPhoneVerified: {
			type: Boolean,
			default: false,
		},
		profileCompleted: {
			type: Boolean,
			default: false,
		},
		accountOTP: {
			type: String,
			default: '',
		},
		resetLink: {
			data: String,
			default: '',
		},
		providers: [
			{
				type: Schema.Types.ObjectId,
				ref: 'Provider',
			},
		],
		patients: [
			{
				type: Schema.Types.ObjectId,
				ref: 'Patient',
			},
		],
	},
	{ timestamps: true }
);

export default mongoose.model('User', userSchema);
