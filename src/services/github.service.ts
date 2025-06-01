import axios from 'axios';

export const GitHubService = {
  async getRepositoryInfo(repositoryId: string) {
    // repositoryId is expected to be "owner/repo"
    const [owner, repo] = repositoryId.split('/');
    // You can authenticate with a GitHub token if needed for higher rate limit
    const base = `https://api.github.com/repos/${owner}/${repo}`;

    const [branches, pulls, issues, commits] = await Promise.all([
      axios.get(`${base}/branches`).then(res => res.data),
      axios.get(`${base}/pulls`).then(res => res.data),
      axios.get(`${base}/issues`).then(res => res.data.filter((i: any) => !i.pull_request)),
      axios.get(`${base}/commits`).then(res => res.data)
    ]);

    return {
      repositoryId,
      branches: branches.map((b: any) => ({ name: b.name, lastCommitSha: b.commit.sha })),
      pulls: pulls.map((p: any) => ({ title: p.title, pullNumber: p.number })),
      issues: issues.map((i: any) => ({ title: i.title, issueNumber: i.number })),
      commits: commits.map((c: any) => ({ sha: c.sha, message: c.commit.message }))
    };
  }
};