import { Request, Response } from 'express';
import { GitHubService } from '../services/github.service';

export default {
  async getRepositoryInfo(req: Request, res: Response) {
    const { repositoryId } = req.params;
    const info = await GitHubService.getRepositoryInfo(repositoryId);
    res.json(info);
  }
}