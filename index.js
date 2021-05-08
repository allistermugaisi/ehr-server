import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import userRoutes from './routes/users.js';

const app = express();

if (process.env.NODE_ENV !== 'production') {
	dotenv.config();
}

app.use(express.json()); // used to parse JSON bodies
app.use(express.urlencoded({ limit: '30mb', extended: true })); // parse URL-encoded bodies
app.use(cors());

// Routes middleware
app.use('/user', userRoutes);

// Catch all routes
app.get('*', (req, res) => {
	res.json({ message: 'Welcome to Afya Health Care EMR!' });
});
// Connect to MongoDB
mongoose
	.connect(process.env.MONGO_CONNECT, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
	})
	.then(() => console.log('MongoDB connected successfully!'))
	.catch((error) => console.log(error.message));

const PORT = process.env.port || 5000;

app.listen(PORT, () =>
	console.log(`Server running successfully on port ${PORT}.`)
);
