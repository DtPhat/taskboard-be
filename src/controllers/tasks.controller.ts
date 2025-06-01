import { Request, Response } from 'express';
import { TaskService } from '../services/task.service';

export default {
  async getAllTasks(req: Request, res: Response) {
    const { boardId, cardId } = req.params;
    const tasks = await TaskService.getAllTasks(boardId, cardId);
    res.json(tasks);
  },

  async createTask(req: Request, res: Response) {
    const { boardId, cardId } = req.params;
    const { title, description, status } = req.body;
    const ownerId = (req as any).user.id;
    const task = await TaskService.createTask(boardId, cardId, { title, description, status, ownerId });
    res.status(201).json(task);
  },

  async getTaskById(req: Request, res: Response) {
    const { boardId, cardId, taskId } = req.params;
    const task = await TaskService.getTaskById(boardId, cardId, taskId);
    res.json(task);
  },

  async updateTask(req: Request, res: Response) {
    const { boardId, cardId, taskId } = req.params;
    const { title, description, status } = req.body;
    const ownerId = (req as any).user.id;
    const updated = await TaskService.updateTask(boardId, cardId, taskId, { title, description, status, ownerId });
    res.json(updated);
  },

  async deleteTask(req: Request, res: Response) {
    const { boardId, cardId, taskId } = req.params;
    await TaskService.deleteTask(boardId, cardId, taskId);
    res.status(204).send();
  },

  async assignMemberToTask(req: Request, res: Response) {
    const { boardId, cardId, taskId } = req.params;
    const { memberId } = req.body;
    await TaskService.assignMemberToTask(boardId, cardId, taskId, memberId);
    res.status(201).json({ taskId, memberId });
  },

  async getAssignedMembers(req: Request, res: Response) {
    const { boardId, cardId, taskId } = req.params;
    const members = await TaskService.getAssignedMembers(boardId, cardId, taskId);
    res.json(members);
  },

  async removeMemberAssignment(req: Request, res: Response) {
    const { boardId, cardId, taskId, memberId } = req.params;
    await TaskService.removeMemberAssignment(boardId, cardId, taskId, memberId);
    res.status(204).send();
  },

  async attachGithubItem(req: Request, res: Response) {
    const { boardId, cardId, taskId } = req.params;
    const { type, number } = req.body;
    const attachment = await TaskService.attachGithubItem(boardId, cardId, taskId, { type, number });
    res.status(201).json(attachment);
  },

  async getGithubAttachments(req: Request, res: Response) {
    const { boardId, cardId, taskId } = req.params;
    const attachments = await TaskService.getGithubAttachments(boardId, cardId, taskId);
    res.json(attachments);
  },

  async removeGithubAttachment(req: Request, res: Response) {
    const { boardId, cardId, taskId, attachmentId } = req.params;
    await TaskService.removeGithubAttachment(boardId, cardId, taskId, attachmentId);
    res.status(204).send();
  },
};