# Local development

## Start the app

From the repository root, install dependencies, create your local environment
file, and start the development server:

```bash
npm install
cp .env.example .env.local
npm run dev
```

Jira and Sentry credentials are optional when you are working only on local
scenario code and running unit tests. Features that connect to those services
need the relevant credentials configured in `.env.local`.

## Verify changes

Run these commands from the repository root:

- `npm test` runs the unit tests with Vitest.
- `npm run lint` checks the code with Oxlint.
- `npm run build` runs the TypeScript project build and builds the app with Vite.

`.env.local` may contain credentials and must not be committed.
