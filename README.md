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
  "repo": "your-username/your-repo-name"
}
```

You can also pass the PR number in the command, or use `--latest` to select the most recently updated open PR.

---

## ▶️ How to Run the Bot

---

### 📁 Folder Structure Example

```
/projects
  ├── your-project-to-check/
  │   ├── package.json
  │   ├── .a11yrc           ← stays here
  │   └── (you run the bot from here)

  └── your-bot-folder-name/ ← bot lives here
      └── ai-a11y-bot.js
```

> The bot should **not** be placed inside your project folder.  
> It can live outside, anywhere on your system. Just set the correct relative path in `package.json`.

You can run the bot from your project using a single script in `package.json`.

### 📦 package.json

```json
"scripts": {
  "a11y-bot": "node ../your-bot-folder-name/ai-a11y-bot.js"
}
```

> 🧠 Replace `your-bot-folder-name` with the actual folder name where the bot is located.

---

### ✅ 1. Run on the latest open Pull Request

```bash
npm run a11y-bot -- --latest
```

> `--` is important! It tells npm to pass `--latest` to the script.

---

### 🔢 2. Run on a specific Pull Request

```bash
npm run a11y-bot 42
```

The bot will:

- Read `.a11yrc` from your project folder
- Use the bot logic from the external folder
- Post A11Y review comments to the selected PR on GitHub

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
