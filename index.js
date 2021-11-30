import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import morgan from 'morgan';
import { v4 as uuidv4 } from 'uuid';

import authRoutes from './routes/users.js';
import providerRoutes from './routes/providers.js';
import mailRoute from './middleware/mail.js';

const app = express();

if (process.env.NODE_ENV !== 'production') {
	dotenv.config();
}

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

app.use(express.json()); // used to parse JSON bodies
app.use(express.urlencoded({ limit: '30mb', extended: true })); // parse URL-encoded bodies
app.use(cors());
app.use(assignId);

morgan.token('id', function getId(req) {
	return req.id;
});

app.use(
	morgan(
		':id :method :url :status HTTP/:http-version :user-agent :response-time ms'
	)
);

// Routes middleware
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/provider', providerRoutes);
app.use('/api/v1/communicate', mailRoute);

// Catch / routes
app.get('/', (req, res) => {
	res.json({ message: 'Welcome to AfyaEHR Health Care api endpoint!' });
});

function assignId(req, res, next) {
	req.id = uuidv4();
	next();
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
	console.log(`Server running successfully on port ${PORT}.`)
);
