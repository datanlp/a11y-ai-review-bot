import * as dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createOctokit } from './octokit-helper.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load .env from bot directory
dotenv.config({ path: path.resolve(__dirname, '../.env') });

export async function getConfig() {
  const configPath = path.resolve(process.cwd(), '.a11yrc');
  const isLatest = process.argv.includes('--latest');

  let repo = process.env.GITHUB_REPOSITORY;
  let pr = process.env.PR_NUMBER;

  // Read .a11yrc if it exists
  if (fs.existsSync(configPath)) {
    const json = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    repo = json.repo || repo;
    pr = json.pr || pr;
  }

  // If --latest flag is set, ignore PR from .env/.a11yrc
  if (isLatest && repo) {
    const octokit = createOctokit();
    const [owner, repoName] = repo.split('/');
    const pulls = await octokit.rest.pulls.list({
      owner,
      repo: repoName,
      state: 'open',
      per_page: 1,
      sort: 'updated',
      direction: 'desc'
    });

    if (pulls.data.length > 0) {
      pr = pulls.data[0].number;
      console.log(`📌 Using the latest open PR: #${pr}`);
    } else {
      console.error('❌ No open PRs found in this repository');
      process.exit(1);
    }
  }

  return {
    openaiApiKey: process.env.OPENAI_API_KEY,
    githubToken: process.env.GITHUB_TOKEN,
    repo,
    pr,
    model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
    systemPrompt: process.env.SYSTEM_PROMPT,
  };
}
