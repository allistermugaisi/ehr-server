import express from 'express';

const router = express.Router();

// Create a new Provider
router.post('/create');

// Retrieve all Providers
router.get('/all');

// Retrieve a single Provider with id
router.get('/:id');

// Update a Provider with id
router.put('/:id');

export default router;
