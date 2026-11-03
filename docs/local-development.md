# Local development quick-start guide

## First time setup

```bash
npm install
cp .env.example .env.local
```

Edit `.env.local` and fill in the values you need (see [Environment variables](#environment-variables) below).

## Start the dev server

```bash
npm run dev
```

Open the printed URL. The app is now running locally.

## Credentials

Jira and Sentry credentials are **optional** when you are only working on local scenario code or running unit tests. The app works without them for those tasks.

## Environment variables

See the [README](../README.md#environment) for the full list of variables.

## Commands

| Command | What it checks |
| --- | --- |
| `npm test` | Runs unit tests via Vitest |
| `npm run lint` | Lints the codebase with oxlint |
| `npm run build` | Type-checks with TypeScript (`tsc -b`) and bundles with Vite |

## Do not commit `.env.local`

`.env.local` contains secrets (API tokens, DSNs, etc.) and must not be committed to the repository.