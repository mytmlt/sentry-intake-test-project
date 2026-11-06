# Local development quick-start

## Prerequisites

- Node.js (see `.node-version` or the `engines` field in `package.json`)
- npm

```bash
npm install
```

## Environment

```bash
cp .env.example .env.local
```

Jira and Sentry credentials in `.env.local` are optional when you are working
only on local scenario code and unit tests.

> **`.env.local` must not be committed.** It is listed in `.gitignore` and
> contains secrets if you do configure credentials.

## Running the dev server

```bash
npm run dev
```

## Commands

| Command | What it checks |
|---|---|
| `npm test` | Runs Vitest unit tests |
| `npm run lint` | Runs oxlint for code style and correctness |
| `npm run build` | Runs TypeScript type checking and the Vite production build |

See the [README](../README.md) for the full CLI and environment reference.