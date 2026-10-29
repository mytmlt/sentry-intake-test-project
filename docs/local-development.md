# Local development quick start

From the repository root, install dependencies and create your local environment file:

```bash
npm install
cp .env.example .env.local
```

Jira and Sentry credentials are optional when working only on local scenario code
in `src/scenarios/` and running unit tests. You can leave the credential fields
empty for that work. Configure the relevant values in `.env.local` only when you
need Jira/Sentry event generation or Sentry error reporting.

**Do not commit `.env.local`.** It holds local settings and credentials and is
ignored by Git.

Start the app:

```bash
npm run dev
```

Open the local URL printed by Vite in your browser.

## Project checks

Run these commands from the repository root; no service credentials are needed:

| Command | What it checks |
| --- | --- |
| `npm test` | Runs the Vitest unit tests in `tools/**/*.test.ts`, including scenario and intake helper tests. |
| `npm run lint` | Runs Oxlint to check JavaScript/TypeScript and React code for lint issues. |
| `npm run build` | Checks TypeScript with `tsc -b`, then creates a production bundle with Vite. |
