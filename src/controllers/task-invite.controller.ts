import { Request, Response } from 'express';
import { TaskInviteService } from '../services/task-invite.service';

export default {
  async inviteToTask(req: Request, res: Response) {
    const { boardId, cardId, taskId } = req.params;
    const { task_owner_id, member_id, email_member, status } = req.body;
    const invite = await TaskInviteService.inviteToTask({
      boardId,
      cardId,
      taskId,
      task_owner_id,
      member_id,
      email_member,
      status,
    });
    res.status(200).json(invite);
  },

  async respondToInvite(req: Request, res: Response) {
    const { boardId, cardId, taskId, inviteId } = req.params;
    const { member_id, status } = req.body;
    await TaskInviteService.respondToInvite({ boardId, cardId, taskId, inviteId, member_id, status });
    res.status(200).json({ success: true });
  },
};