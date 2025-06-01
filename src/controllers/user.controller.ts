import { Request, Response } from 'express';
import { UserService } from '../services/user.service';

export default {
  async getAllInvites(req: Request, res: Response) {
    const userId = (req as any).user.id;
    const invites = await UserService.getAllInvites(userId);
    res.json(invites);
  }
};