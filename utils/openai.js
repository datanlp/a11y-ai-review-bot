import OpenAI from "openai";
import fs from "fs/promises";

import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const promptPath = join(__dirname, "..", "prompts", "a11y-review.prompt.txt");

export async function reviewCodeWithOpenAI(content, filename, config) {
  const openai = new OpenAI({ apiKey: config.openaiApiKey });

  const systemPrompt = await fs.readFile(promptPath, "utf-8");

  const messages = [
    { role: "system", content: systemPrompt },
    { role: "user", content: content },
  ];

  const result = await openai.chat.completions.create({
    model: config.model,
    messages,
  });

  return result.choices[0].message.content;
}
