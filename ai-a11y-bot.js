import readline from "readline";
import { getInput } from "./utils/input.js";
import { getChangedFilesFromPR, getLatestOpenPR } from "./utils/github.js";
import { reviewCodeWithOpenAI } from "./utils/openai.js";
import { getConfig } from "./utils/config-loader.js";
import { postCommentToPR } from "./utils/comment.js";

(async () => {
  const config = await getConfig();

  const args = process.argv.slice(2);
  const useLatest = args.includes("--latest");
  const prArg = args.find((arg) => /^\d+$/.test(arg));
  let prNumber;

  if (prArg) {
    prNumber = parseInt(prArg, 10);
  } else if (useLatest) {
    prNumber = await getLatestOpenPR(config.repo, config.githubToken);
  } else if (config.pr) {
    prNumber = config.pr;
  } else {
    console.error("❌ No PR specified. Use '--latest' or provide a PR number.");
    process.exit(1);
  }

  const repo = config.repo;

  if (!config.openaiApiKey || !config.githubToken) {
    console.error(
      "❌ Missing credentials. Please set OPENAI_API_KEY and GITHUB_TOKEN in .env."
    );
    process.exit(1);
  }

  const changedFiles = await getChangedFilesFromPR(
    repo,
    prNumber,
    config.githubToken
  );
  const filteredFiles = changedFiles.filter(
    (file) =>
      file.endsWith(".html") ||
      (file.endsWith(".ts") && file.includes(".component")) ||
      file.endsWith(".css")
  );

  console.log("📂 Files to review:", filteredFiles);

  for (const file of filteredFiles) {
    try {
      const content = await getInput(repo, file, config.githubToken);
      const review = await reviewCodeWithOpenAI(content, file, config);
      await postCommentToPR(repo, prNumber, review, file, config.githubToken);
    } catch (error) {
      console.error(`❌ Error reviewing ${file}:`, error.message);
    }
  }

  console.log("✅ Review complete. Comments posted to the Pull Request.");
})();
