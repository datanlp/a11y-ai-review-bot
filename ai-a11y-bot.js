import readline from 'readline';
import { getInput } from './utils/input.js';
import { getChangedFilesFromPR } from './utils/github.js';
import { reviewCodeWithOpenAI } from './utils/openai.js';
import { getConfig } from './utils/config-loader.js';
import { postCommentToPR } from './utils/comment.js';

(async () => {
  const config = await getConfig();
  const prNumber = process.argv[2] || config.pr || "latest";
  const repo = config.repo;

  if (!config.openaiApiKey || !config.githubToken) {
    console.error("❌ Check your .env: OPENAI_API_KEY and GITHUB_TOKEN are required.");
    process.exit(1);
  }

  const changedFiles = await getChangedFilesFromPR(repo, prNumber, config.githubToken);
  const filteredFiles = changedFiles.filter(file =>
    file.endsWith('.html') ||
    (file.endsWith('.ts') && file.includes('.component')) ||
    file.endsWith('.css')
  );

  console.log('📂 Files to analyze:', filteredFiles);

  for (const file of filteredFiles) {
    try {
      const content = await getInput(repo, file, config.githubToken);
      const review = await reviewCodeWithOpenAI(content, file, config);
      await postCommentToPR(repo, prNumber, review, file, config.githubToken);
    } catch (error) {
      console.error(`❌ Error during analysis ${file}:`, error.message);
    }
  }

  console.log("✅ Analysis complete. Comments were added to the Pull Request.");
})();
