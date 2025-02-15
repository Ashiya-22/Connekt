import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import {
  getSuggestedConnections,
  getPublicProfile,
  updateProfile,
  getSearchResults,
} from '../controllers/user.controller.js';

const router = express.Router();

router.get('/suggestions', protectRoute, getSuggestedConnections);
router.get('/search-users', protectRoute, getSearchResults);
router.put('/profile', protectRoute, updateProfile);

router.get('/:username', protectRoute, getPublicProfile);

export default router;
