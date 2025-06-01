# GitHub OAuth Authentication Endpoints

## 1. Start OAuth Process
**GET** `/auth/github/start?redirect_uri=YOUR_CALLBACK_URL`

- Returns: `{ url: "<github_oauth_authorize_url>" }`
- Redirect user to the provided URL for GitHub login.

## 2. Callback Exchange
**POST** `/auth/github/callback`  
Body:
```json
{ "code": "<code_from_github>" }
```
- Returns:  
```json
{
  "access_token": "...",
  "scope": "...",
  "token_type": "bearer"
}
```
- Use `access_token` to fetch user profile, link to your app's user, or issue your own JWT.

## Notes
- You can now offer "Sign in with GitHub" in your frontend.
- Make sure to set `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` in your `.env`.