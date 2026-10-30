# Local development

Quick-start guide for running this repository locally.

## Getting started

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open the printed URL in your browser.

## Optional credentials

Jira and Sentry credentials are **optional** when you are working only on local scenario code (`src/scenarios/`) and unit tests. The app starts and the verification commands run without a valid `.env.local`.

Fill in credentials only when you need to send real events to Jira or Sentry through the UI or the CLI.

## Verification commands

| Command | What it checks |
| --- | --- |
| `npm test` | Runs unit tests with vitest |
| `npm run lint` | Lints the codebase with oxlint |
| `npm run build` | Type-checks with `tsc` and builds with Vite |

Run these before pushing to catch issues early.

## Notes

- `.env.local` contains environment-specific secrets. **Do not commit it.**
- The file is already listed in `.gitignore`, but double-check before staging.