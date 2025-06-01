import { Request, Response } from 'express';
import { CardService } from '../services/card.service';

export default {
  async getAllCards(req: Request, res: Response) {
    const { boardId } = req.params;
    const userId = (req as any).user.id;
    const cards = await CardService.getAllCards(boardId, userId);
    res.json(cards);
  },

  async createCard(req: Request, res: Response) {
    const { boardId } = req.params;
    const { name, description, createdAt } = req.body;
    const userId = (req as any).user.id;
    const card = await CardService.createCard(boardId, { name, description, createdAt, ownerId: userId });
    res.status(201).json(card);
  },

  async getCardById(req: Request, res: Response) {
    const { boardId, id } = req.params;
    const userId = (req as any).user.id;
    const card = await CardService.getCardById(boardId, id, userId);
    res.json(card);
  },

  async updateCard(req: Request, res: Response) {
    const { boardId, id } = req.params;
    const { name, description, params } = req.body;
    const userId = (req as any).user.id;
    const updated = await CardService.updateCard(boardId, id, userId, { name, description, ...params });
    res.json(updated);
  },

  async deleteCard(req: Request, res: Response) {
    const { boardId, id } = req.params;
    const userId = (req as any).user.id;
    await CardService.deleteCard(boardId, id, userId);
    res.status(204).send();
  },

  async getCardsByUser(req: Request, res: Response) {
    const { boardId, userId } = req.params;
    const cards = await CardService.getCardsByUser(boardId, userId);
    res.json(cards);
  },

  async acceptInvite(req: Request, res: Response) {
    const { boardId, id } = req.params; // id = cardId
    const { invite_id, card_id, member_id, status } = req.body;
    await CardService.acceptInvite({ invite_id, card_id, member_id, status });
    res.json({ success: true });
  }
}