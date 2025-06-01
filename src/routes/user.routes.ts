import { Router } from 'express';
import UserController from '../controllers/user.controller';

const router = Router();

// Get all invites for current user (GET /user/invites)
router.get('/invites', UserController.getAllInvites);

export default router;