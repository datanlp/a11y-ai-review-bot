import fetch from "node-fetch";

/**
 * Get the list of changed files in a pull request
 */
export async function getChangedFilesFromPR(repo, prNumber, githubToken) {
  const url = `https://api.github.com/repos/${repo}/pulls/${prNumber}/files`;

  const response = await fetch(url, {
    headers: {
      Authorization: `token ${githubToken}`,
      Accept: "application/vnd.github.v3+json",
    },
  });

  if (!response.ok) {
    throw new Error(
      `GitHub API error: ${response.status} ${response.statusText}`
    );
  }

  const files = await response.json();
  return files.map((file) => file.filename);
}

/**
 * Get the number of the latest open pull request
 */
export async function getLatestOpenPR(repo, githubToken) {
  const url = `https://api.github.com/repos/${repo}/pulls?state=open&sort=updated&direction=desc`;

  const response = await fetch(url, {
    headers: {
      Authorization: `token ${githubToken}`,
      Accept: "application/vnd.github.v3+json",
    },
  });

  if (!response.ok) {
    throw new Error(
      `GitHub API error: ${response.status} ${response.statusText}`
    );
  }

  const pulls = await response.json();
  if (pulls.length === 0) {
    throw new Error("No open pull requests found.");
  }

  console.log(`📌 Using the latest open PR: #${pulls[0].number}`);
  return pulls[0].number;
}
