# Local development

## Prerequisites

Node.js (LTS release).

## Setup

```bash
npm install
cp .env.example .env.local
```

`.env.local` contains Jira and Sentry credentials. These are optional. When you work only on local scenario code and unit tests, you can leave the variables empty and skip the service configuration sections of the README.

Do not commit `.env.local`. The repository's `.gitignore` already excludes it.

## Development server

```bash
npm run dev
```

Open the printed URL in your browser. Use the Jira and Sentry forms to create intake events, or press **Trigger error** for browser crash scenarios.

## Validation commands

| Command | What it checks |
|---|---|
| `npm test` | Runs unit tests with Vitest (`vitest run`). |
| `npm run lint` | Runs the oxlint static analysis linter. |
| `npm run build` | Compiles TypeScript with `tsc -b` and bundles with Vite (`vite build`). |

None of these commands need service credentials. They pass on a fresh install with an empty `.env.local`.