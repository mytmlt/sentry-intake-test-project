# Local development

## Prerequisites

Install Node.js and npm before starting. Check that both are available with
`node --version` and `npm --version`.

## Setup

From the repository root, install dependencies and create your local
environment file:

```bash
npm install
cp .env.example .env.local
```

Start the development server with:

```bash
npm run dev
```

Open the local URL printed by Vite. Jira and Sentry credentials in `.env.local`
are optional when working only on local scenario code and unit tests. Add them
when you need to exercise the Jira or Sentry integrations.

## Available commands

| Command | What it checks |
| --- | --- |
| `npm test` | Runs the unit test suite with Vitest. |
| `npm run lint` | Checks the code with Oxlint. |
| `npm run build` | Runs TypeScript checks and creates a production Vite build. |

## Important

`.env.local` may contain credentials and must not be committed.
