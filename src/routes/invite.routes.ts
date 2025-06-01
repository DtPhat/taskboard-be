import { Router } from 'express';
import InviteController from '../controllers/invite.controller';

const router = Router({ mergeParams: true });

// Invite a member to the board
router.post('/', InviteController.inviteToBoard);

// Accept or decline a board invite
router.post('/:inviteId/respond', InviteController.respondToInvite);

export default router;