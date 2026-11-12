# Local development

## Quick start

```bash
npm install
cp .env.example .env.local
npm run dev
```

Jira and Sentry credentials in `.env.local` are optional when you are working only on local scenario code and unit tests. The dev server starts without them.

Do not commit `.env.local`. It is listed in `.gitignore`.

## Commands

| Command | What it checks |
| --- | --- |
| `npm test` | Runs unit tests with Vitest. |
| `npm run lint` | Lints the codebase with oxlint. |
| `npm run build` | Type-checks with TypeScript and builds the production bundle with Vite. |