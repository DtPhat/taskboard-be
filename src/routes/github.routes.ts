import { Router } from 'express';
import GitHubController from '../controllers/github.controller';

const router = Router();

router.get('/:repositoryId/github-info', GitHubController.getRepositoryInfo);

export default router;