# Local development

## Start the app

From the repository root, install dependencies, create your local environment file, and start the development server:

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open the local URL printed by Vite. Jira and Sentry credentials are optional when you are working only on local scenario code and running unit tests. Add the relevant credentials to `.env.local` only when you need the Jira or Sentry integrations.

Never commit `.env.local`; it can contain private credentials.

## Checks

Run these commands from the repository root:

- `npm test` runs the unit tests with Vitest.
- `npm run lint` checks the code with Oxlint.
- `npm run build` runs the TypeScript project build and creates the Vite production build.
