import { Router } from 'express';
import CardInviteController from '../controllers/card-invite.controller';

const router = Router({ mergeParams: true });

// Invite a member to a card (POST /boards/:boardId/cards/:cardId/invite)
router.post('/', CardInviteController.inviteToCard);

// Accept or decline a card invite (POST /boards/:boardId/cards/:cardId/invite/:inviteId/respond)
router.post('/:inviteId/respond', CardInviteController.respondToInvite);

export default router;