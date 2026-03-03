# Contributing to CSV DataLab

Thank you for your interest in contributing. This document covers everything you need to get started.

## Tech Stack

- Next.js 15 (App Router)
- TypeScript
- Anthropic Claude API (AI SDK v6 + Anthropic SDK)
- No CSS framework — all styles are inline

---

## Local Setup

1. **Fork and clone**

   ```bash
   git clone https://github.com/<your-username>/csv-datalab.git
   cd csv-datalab
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment**

   ```bash
   cp .env.example .env
   ```

   Open `.env` and add your Anthropic API key:

   ```
   ANTHROPIC_API_KEY=sk-ant-...
   ```

   You can get an API key at [console.anthropic.com](https://console.anthropic.com).

4. **Start the dev server**

   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:3000`.

---

## Development Workflow

- Make changes on a feature branch (see branch naming below).
- Test manually in the browser. There is no automated test suite yet — verify your changes work end-to-end with a real CSV file and a real API key.
- Keep the dev server running while you work; Next.js hot-reloads on save.
- If you change API routes, restart the server to pick up environment variable changes.

---

## Pull Request Process

**Branch naming**

Use lowercase kebab-case with a short prefix:

```
feat/add-export-button
fix/csv-parse-edge-case
chore/update-dependencies
docs/improve-readme
```

**Before opening a PR**

- Confirm the app builds without errors: `npm run build`
- Make sure TypeScript compiles cleanly: `npx tsc --noEmit`
- Test the specific flow your change affects (upload, chat, report, model selector, etc.)

**PR description**

Include:
- What the change does and why
- Steps to reproduce the bug being fixed, or the use case being addressed
- Screenshots or screen recordings for UI changes
- Any tradeoffs or alternatives considered

PRs that are small and focused are easier to review and merge faster. Avoid bundling unrelated changes.

---

## Code Style

- **TypeScript**: Use explicit types. Avoid `any`. The project does not use a linter config yet, so use your judgment and match the surrounding code.
- **Inline styles**: All styling is done with inline `style` props — no CSS modules, no Tailwind, no external CSS files. Keep new styles consistent with the existing amber CRT aesthetic (`#080600` background, `#ffb800` amber, `IBM Plex Mono` font).
- **No new dependencies without discussion**: Open an issue first if you think a new package is needed. The project intentionally keeps its dependency surface small.
- **File structure**: Follow Next.js 15 App Router conventions. New routes go under `app/`, shared components under `components/`, API routes under `app/api/`.

---

## Reporting Bugs

Open a [GitHub Issue](../../issues/new) and include:

- A clear description of the bug
- Steps to reproduce it
- What you expected to happen vs. what actually happened
- Your browser, OS, and Node.js version
- Any relevant console errors or network responses

Do not include your API key in bug reports.

---

## Questions

If you are unsure whether a change is a good fit, open an issue and describe what you want to build before writing code. That saves everyone time.
