import { Octokit } from "octokit";

export async function postCommentToPR(repo, prNumber, comment, path, token) {
  const octokit = new Octokit({ auth: token });
  const [owner, repoName] = repo.split("/");

  await octokit.rest.issues.createComment({
    owner,
    repo: repoName,
    issue_number: prNumber,
    body: `**A11Y Review for ${path}:**\n\n${comment}`,
  });
}
