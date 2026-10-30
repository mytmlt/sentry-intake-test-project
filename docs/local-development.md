# Local development

Quick start for running this repository on your machine. Use Node.js 22, the
same version as the pull-request workflow.

## Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open the URL Vite prints (default `http://localhost:5173`).

Credentials in `.env.local` are **optional** when you are only working on local
scenario code and unit tests. `VITE_SENTRY_DSN` is the only variable needed for
the crash-lab buttons in the browser. Unit tests do not call Jira or Sentry.

## Checks

- `npm test` runs the Vitest unit tests.
- `npm run lint` runs oxlint static analysis.
- `npm run build` type-checks with `tsc -b`, then builds with Vite.

These checks do not need service credentials.

## Important

`.env.local` contains secrets and **must not be committed**. It is already
listed in `.gitignore`.