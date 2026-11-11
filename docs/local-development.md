# Local development

## Quick start

```bash
npm install
cp .env.example .env.local
npm run dev
```

Jira and Sentry credentials are optional when you are working only on local
scenario code and unit tests. The app starts without them.

Do not commit `.env.local`.

## Available commands

| Command | Purpose |
| --- | --- |
| `npm test` | Run unit tests with Vitest. |
| `npm run lint` | Check code style with oxlint. |
| `npm run build` | Type-check with TypeScript (`tsc -b`) and bundle with Vite. |