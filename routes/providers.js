import express from 'express';
import {
	createProvider,
	updateProvider,
	getProviders,
	getProvider,
} from '../controllers/provider.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Create a new Provider
router.post('/create', auth, createProvider);

// Retrieve all Providers
router.get('/all', auth, getProviders);

// Retrieve a single Provider with id
router.get('/:id', auth, getProvider);

// Update a Provider with id
router.put('/:id'), auth, updateProvider;

export default router;
