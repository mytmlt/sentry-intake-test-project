# Local development

## Prerequisites

[Node.js](https://nodejs.org) 18 or later.

## Setup

```bash
npm install
cp .env.example .env.local
```

Jira and Sentry credentials are optional when working only on local scenario
code and unit tests.

## Run the dev server

```bash
npm run dev
```

Open the printed URL. The app loads without service credentials.

## Verify

| Command | What it checks |
| --- | --- |
| `npm test` | Unit tests with Vitest |
| `npm run lint` | Code style with oxlint |
| `npm run build` | TypeScript types with `tsc -b`, then production bundle with Vite |

## Keep `.env.local` out of version control

`.env.local` is already in `.gitignore`. Verify it never enters a commit.