
import { Octokit } from "octokit";

export async function getChangedFilesFromPR(repo, prNumber, token) {
  const octokit = new Octokit({ auth: token });
  const [owner, repoName] = repo.split("/");

  const response = await octokit.request('GET /repos/{owner}/{repo}/pulls/{pull_number}/files', {
    owner,
    repo: repoName,
    pull_number: prNumber,
  });

  return response.data.map(file => file.filename);
}
