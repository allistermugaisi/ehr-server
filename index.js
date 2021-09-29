import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

import userRoutes from './routes/users.js';
import mailRoute from './middleware/mail.js';

const app = express();

if (process.env.NODE_ENV !== 'production') {
	dotenv.config();
}

app.use(express.json()); // used to parse JSON bodies
app.use(express.urlencoded({ limit: '30mb', extended: true })); // parse URL-encoded bodies
app.use(cors());

// Routes middleware
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/communicate', mailRoute);

// Catch / routes
app.get('/', (req, res) => {
	res.json({ message: 'Welcome to AfyaEHR Health Care api endpoint!' });
});

// Connect to MongoDB
mongoose
	.connect(process.env.MONGO_URI, {
		useNewUrlParser: true,
		useFindAndModify: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
	})
	.then(() => console.log('MongoDB connected successfully!'))
	.catch((error) => console.log(error.message));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
	console.log(`Server running successfully on port ${PORT}.`)
);
