import express from 'express';
import {
  login,
  logout,
  signup,
  getCurrentUser,
  deleteUser,
} from '../controllers/auth.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/sign-up', signup);
router.post('/login', login);
router.post('/logout', logout);

router.get('/user-info', protectRoute, getCurrentUser);
router.delete('/user-deletion', protectRoute, deleteUser);

export default router;
