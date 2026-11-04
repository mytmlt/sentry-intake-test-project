# Local development

Quick start for running this test repository on your machine.

## Start the app

```bash
npm install
cp .env.example .env.local
npm run dev
```

`npm install` installs dependencies. Copy `.env.example` to `.env.local` and fill in any values you need, then `npm run dev` starts the Vite dev server. Open the URL printed in the terminal.

Jira and Sentry credentials are optional when you are only working on local scenario code and unit tests. Leave those variables empty unless you are creating live Jira or Sentry events.

Do not commit `.env.local`. It is listed in `.gitignore` and may contain tokens.

## Checks

```bash
npm test
npm run lint
npm run build
```

- `npm test` runs the Vitest unit tests.
- `npm run lint` runs oxlint and reports lint issues.
- `npm run build` typechecks the project with `tsc -b`, then produces a production Vite build.

No service credentials are required for these checks.
