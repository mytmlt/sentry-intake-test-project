# Local development

From the repository root, install dependencies and create your local environment file:

```bash
npm install
cp .env.example .env.local
```

Then start the Vite development server:

```bash
npm run dev
```

Open the local URL printed by Vite. Jira and Sentry credentials are optional when you are working only on local scenario code and running unit tests. Add credentials to `.env.local` only if you need to exercise the Jira or Sentry integrations. Never commit `.env.local`; it contains local configuration and may contain secrets.

## Checks

Run these commands from the repository root:

```bash
npm test
npm run lint
npm run build
```

- `npm test` runs the unit tests with Vitest.
- `npm run lint` checks the code with Oxlint.
- `npm run build` type-checks the project and creates the production Vite build.
