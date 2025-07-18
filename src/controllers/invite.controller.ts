import { Request, Response } from 'express';
import { InviteService } from '../services/invite.service';

export default {
  async inviteToBoard(req: Request, res: Response) {
    const { boardId } = req.params;
    const { board_owner_id, member_id, email_member, status } = req.body;
    const invite = await InviteService.inviteToBoard({
      boardId,
      board_owner_id,
      member_id,
      email_member,
      status,
    });
    res.status(200).json(invite);
  },

  async respondToInvite(req: Request, res: Response) {
    const { boardId, inviteId } = req.params;
    const { member_id, status, board_owner_id, email_member } = req.body;
    await InviteService.respondToInvite({ 
      boardId,
      invite_id: inviteId,
      member_id,
      status,
      board_owner_id,
      email_member
    });
    res.status(200).json({ success: true });
  },
};