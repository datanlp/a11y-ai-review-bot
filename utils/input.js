import { createOctokit } from "./octokit-helper.js";

export async function getInput(repoFullName, filePath) {
  const octokit = createOctokit();
  const [owner, repo] = repoFullName.split("/");

  // Get the latest open PR number
  const pullRequests = await octokit.rest.pulls.list({
    owner,
    repo,
    state: "open",
    per_page: 1,
    sort: "updated",
    direction: "desc",
  });

  const pr = pullRequests.data[0];
  const sha = pr.head.sha;

  // Get file content from PR branch using SHA
  const { data: fileContent } = await octokit.rest.repos.getContent({
    owner,
    repo,
    path: filePath,
    ref: sha,
  });

  const content = Buffer.from(fileContent.content, "base64").toString("utf8");
  return content;
}
