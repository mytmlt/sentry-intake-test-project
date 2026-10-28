# Local development

Quick start for running this repository on your machine. Use Node.js 22, the same version as the pull-request workflow.

## Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open the URL Vite prints.

`.env.local` is gitignored. Do not commit it. Do not put secret values in the repository.

## Credentials

Jira and Sentry credentials are optional when you are only working on local scenario code and unit tests.

Without `VITE_SENTRY_DSN`, Sentry stays disabled and crash errors stay local. Unit tests do not call Jira or Sentry.

Credentials are required only to create or manage live Jira and Sentry events. Variable names are in `.env.example`.

## Checks

- `npm test` runs the Vitest unit tests.
- `npm run lint` runs Oxlint.
- `npm run build` typechecks with `tsc -b`, then builds with Vite.

These checks do not need service credentials.
