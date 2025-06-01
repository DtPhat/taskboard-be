import { Router } from 'express';
import AuthGitHubController from '../controllers/auth.github.controller';

const router = Router();

router.get('/start', AuthGitHubController.githubStart);
router.post('/callback', AuthGitHubController.githubCallback);

export default router;