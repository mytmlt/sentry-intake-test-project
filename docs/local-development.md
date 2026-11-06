# Local development

## Quick start

From the repository root, install dependencies, create a local environment
file, and start the development server:

```bash
npm install
cp .env.example .env.local
npm run dev
```

The Jira and Sentry credentials in `.env.local` are optional when you are
working only on local scenario code and unit tests. The `.env.local` file is
for local use and must not be committed.

## Verification commands

Run these commands from the repository root:

```bash
npm test
npm run lint
npm run build
```

- `npm test` runs the unit test suite.
- `npm run lint` runs Oxlint static analysis.
- `npm run build` checks the TypeScript project and creates the Vite
  production build.

See the [README](../README.md) for full service setup and environment
variable details.
