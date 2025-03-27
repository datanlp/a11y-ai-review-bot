# A11Y AI Review Bot

This is a simple bot that helps check your code for accessibility issues (A11Y).  
It uses OpenAI (like ChatGPT) to review code in GitHub Pull Requests.

> ✅ Supports: Angular templates, CSS/SCSS files, and Cypress tests  
> 🚫 This code is **not open source**. All rights reserved © 2025 Vira Melnyk.

---

## 📁 Project Structure

This bot works with any repository on GitHub.  
It does **not need to be inside the project folder**.

It connects to GitHub using the repository name and PR number you provide in the `.a11yrc` file (or via command line).  
It downloads the files from GitHub using the API — so your project can be anywhere (even private).

All the review happens in the cloud, not locally.

---

## 🔧 Installation

1. Make sure you have **Node.js v18+** installed.
2. Clone this repository:
```bash
git clone https://github.com/yourusername/a11y-ai-review-bot.git
cd a11y-ai-review-bot
```
3. Install dependencies:
```bash
npm install
```

---

## ⚙️ Configuration

You need two config files: `.env` and `.a11yrc`

### `.env`

Create a file named `.env` in the root folder with this content:

```
OPENAI_API_KEY=your_openai_key_here
GITHUB_TOKEN=your_github_token_here
# Optional: use a specific OpenAI model (default is gpt-3.5-turbo)
OPENAI_MODEL=gpt-4
```

- `OPENAI_API_KEY`: get it from [platform.openai.com](https://platform.openai.com/account/api-keys)
- `GITHUB_TOKEN`: create it in GitHub → Settings → Developer settings → Fine-grained or classic token  
  ✅ It must have permission to **read and write pull requests**  
  ✅ Repo access is enough

### `.a11yrc`

This file tells the bot which repo and pull request to check.

Example `.a11yrc`:
```json
{
  "repo": "your-username/your-repo-name",
  "pr": 42
}
```

- `"repo"` is required
- `"pr"` is optional:
  - You can also pass the PR number directly in the command
  - Or use `--latest` to automatically select the most recent open PR

---

## ▶️ How to Run the Bot

You can run the bot in two ways:

### ✅ 1. Check the latest open Pull Request

```bash
node ai-a11y-bot.js --latest
```

This will:
- Automatically find the most recently updated open PR
- Review the files in that PR

You can also define this in your project's `package.json`:

```json
"scripts": {
  "a11y-latest": "node ../a11y-bot/ai-a11y-bot.js --latest"
}
```

Then run:

```bash
npm run a11y-latest
```

---

### 🔢 2. Check a specific Pull Request by number

```bash
node ai-a11y-bot.js 42
```

You can also define this in `package.json`:

```json
"scripts": {
  "a11y-pr": "node ../a11y-bot/ai-a11y-bot.js"
}
```

Then run:

```bash
npm run a11y-pr 42
```

🧠 Just add the PR number after the command.

---

## 📁 What the Bot Does

For each file:
- Finds accessibility problems (based on WCAG 2.1 AA)
- Suggests code patches
- Explains each fix
- Suggests or improves Cypress A11Y tests

---

## 👩‍💻 Author

Created by **Vira Melnyk**  
This code is **proprietary**. You may not use or copy it without permission.



---

## 🔄 Integration with Your Existing Project (Optional)

You can run this bot **from inside the project you want to check**.  
This is useful if you want to add a script to your `package.json` like this:

### 📁 Example folder structure:

```
/your-project-to-check
  ├── package.json
  ├── .a11yrc ← lives here
  └── ../a11y-bot/ ← the bot lives in another folder
```

---

### 🧩 Step-by-step

#### 1. In your `.a11yrc` (in the project to check):

```json
{
  "repo": "your-username/your-repo-name"
}
```

(You can also include `"pr": 42`, or pass PR number in the command.)

#### 2. In your project's `package.json`, add:

```json
"scripts": {
  "a11y": "node ../a11y-bot/ai-a11y-bot.js --latest",
  "a11y-pr": "node ../a11y-bot/ai-a11y-bot.js"
}
```

> Replace `../a11y-bot/` with the actual relative path to where the bot folder is.

---

#### 3. Run from your project root:

```bash
npm run a11y        # runs on latest PR
npm run a11y-pr 42  # runs on PR #42
```

The bot will:
- Read `.a11yrc` from your project folder
- Use the bot logic from the external folder
- Post comments to the PR on GitHub
