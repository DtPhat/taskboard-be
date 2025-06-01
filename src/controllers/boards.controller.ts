import { Request, Response } from 'express';
import { BoardService } from '../services/board.service';

export default {
  async createBoard(req: Request, res: Response) {
    const { name, description } = req.body;
    const userId = (req as any).user.id;
    const board = await BoardService.createBoard({ name, description, ownerId: userId });
    res.status(201).json(board);
  },

  async getAllBoards(req: Request, res: Response) {
    const userId = (req as any).user.id;
    const boards = await BoardService.getBoardsByUser(userId);
    res.json(boards);
  },

  async getBoardById(req: Request, res: Response) {
    const { id } = req.params;
    const userId = (req as any).user.id;
    const board = await BoardService.getBoardById(id, userId);
    res.json(board);
  },

  async updateBoard(req: Request, res: Response) {
    const { id } = req.params;
    const { name, description } = req.body;
    const userId = (req as any).user.id;
    const updated = await BoardService.updateBoard(id, userId, { name, description });
    res.json(updated);
  },

  async deleteBoard(req: Request, res: Response) {
    const { id } = req.params;
    const userId = (req as any).user.id;
    await BoardService.deleteBoard(id, userId);
    res.status(204).send();
  },

  async inviteMember(req: Request, res: Response) {
    // Call InviteService
  }
}