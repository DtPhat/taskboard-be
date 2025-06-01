import axios from 'axios';
import { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } from '../config';

export const AuthGitHubService = {
  getGitHubOAuthUrl(redirect_uri: string) {
    const params = new URLSearchParams({
      client_id: GITHUB_CLIENT_ID!,
      redirect_uri,
      scope: 'read:user user:email',
    });
    return `https://github.com/login/oauth/authorize?${params.toString()}`;
  },

  async exchangeCodeForToken(code: string) {
    const params = {
      client_id: GITHUB_CLIENT_ID!,
      client_secret: GITHUB_CLIENT_SECRET!,
      code,
    };
    const { data } = await axios.post(
      'https://github.com/login/oauth/access_token',
      params,
      { headers: { Accept: 'application/json' } }
    );
    if (data.error) throw new Error(data.error_description);
    // Optionally, fetch user profile here using data.access_token
    return data;
  },
};