import { Request, Response } from 'express';
import { AuthGitHubService } from '../services/auth.github.service';

export default {
  // Step 1: Start GitHub OAuth
  async githubStart(req: Request, res: Response) {
    const { redirect_uri } = req.query;
    // Redirect user to GitHub OAuth authorize URL
    const url = AuthGitHubService.getGitHubOAuthUrl(redirect_uri as string);
    res.json({ url });
  },

  // Step 2: Handle callback and exchange code for access token
  async githubCallback(req: Request, res: Response) {
    const { code } = req.body;
    const tokenData = await AuthGitHubService.exchangeCodeForToken(code);
    // You may want to create/find a corresponding user in your DB here
    res.json(tokenData);
  }
};