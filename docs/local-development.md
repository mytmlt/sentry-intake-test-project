# Local development quick-start guide

## Setup

```bash
npm install
cp .env.example .env.local
```

Edit `.env.local` with your Jira and Sentry credentials.

> **Jira / Sentry credentials are optional** when you are working only on local
> scenario code and unit tests. The app still starts without them.

```bash
npm run dev
```

Open the printed URL to use the dashboard.

## Commands

| Command | What it does |
| --- | --- |
| `npm test` | Runs unit tests with Vitest |
| `npm run lint` | Checks code style and catches common mistakes with oxlint |
| `npm run build` | Type-checks the project with TypeScript and creates a production bundle |

## Important

`.env.local` contains credentials and must **not** be committed.
It is already listed in `.gitignore`.