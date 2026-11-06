# Local Development

Quick-start guide for running this project on your machine.

## Setup

```bash
npm install
cp .env.example .env.local
```

Edit `.env.local` with your credentials if you plan to use Jira or Sentry
features. These are **optional** when working only on local scenario code
and unit tests.

## Start the dev server

```bash
npm run dev
```

## Checks

| Command | Purpose |
| --- | --- |
| `npm test` | Runs unit tests with Vitest. |
| `npm run lint` | Runs the oxlint static analysis. |
| `npm run build` | Type-checks with TypeScript and bundles with Vite. |

## Important

`.env.local` contains secrets and must **never** be committed. It is already
listed in `.gitignore`.