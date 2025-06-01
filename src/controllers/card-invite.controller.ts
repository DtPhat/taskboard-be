import { Request, Response } from 'express';
import { CardInviteService } from '../services/card-invite.service';

export default {
  async inviteToCard(req: Request, res: Response) {
    const { boardId, cardId } = req.params;
    const { card_owner_id, member_id, email_member, status } = req.body;
    const invite = await CardInviteService.inviteToCard({
      boardId,
      cardId,
      card_owner_id,
      member_id,
      email_member,
      status,
    });
    res.status(200).json(invite);
  },

  async respondToInvite(req: Request, res: Response) {
    const { boardId, cardId, inviteId } = req.params;
    const { member_id, status } = req.body;
    await CardInviteService.respondToInvite({ boardId, cardId, inviteId, member_id, status });
    res.status(200).json({ success: true });
  },
};