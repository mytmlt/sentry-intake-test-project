# Local development

## Start the app

From the repository root, install dependencies, copy the example environment file, and start the Vite development server:

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open the local URL printed by Vite. The Jira and Sentry integrations need credentials in `.env.local`. Jira and Sentry credentials are optional when you are working only on local scenario code and running unit tests.

`.env.local` can contain secrets and must not be committed.

## Checks

Run these commands from the repository root:

- `npm test` runs the unit tests with Vitest.
- `npm run lint` checks the code with Oxlint.
- `npm run build` runs the TypeScript project checks and builds the production app with Vite.
