import { Router } from 'express';
import TaskInviteController from '../controllers/task-invite.controller';

const router = Router({ mergeParams: true });

// Invite a member to a task (POST /boards/:boardId/cards/:cardId/tasks/:taskId/invite)
router.post('/', TaskInviteController.inviteToTask);

// Accept or decline a task invite (POST /boards/:boardId/cards/:cardId/tasks/:taskId/invite/:inviteId/respond)
router.post('/:inviteId/respond', TaskInviteController.respondToInvite);

export default router;