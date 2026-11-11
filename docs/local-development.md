# Local development quick-start

## Setup

```bash
npm install
cp .env.example .env.local
```

Jira and Sentry credentials are optional when working only on local scenario code and
unit tests. Commands that do not need service configuration will work without them.

## Development server

```bash
npm run dev
```

## Available commands

| Command | What it checks |
| --- | --- |
| `npm test` | Runs unit tests with Vitest |
| `npm run lint` | Lints the codebase with oxlint |
| `npm run build` | Type-checks with TypeScript and builds the Vite bundle |

## `.env.local` must not be committed

The file contains secrets (API tokens, DSNs). It is already listed in `.gitignore`.