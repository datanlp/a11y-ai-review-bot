import { Octokit } from "octokit";

export function createOctokit() {
  const token = process.env.GITHUB_TOKEN;

  if (!token) {
    console.error("❌ Error: GITHUB_TOKEN not found in .env");
    process.exit(1);
  }

  return new Octokit({ auth: token });
}
