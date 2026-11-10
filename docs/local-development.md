# Local development quick-start guide

## Setup

```bash
npm install
cp .env.example .env.local
```

Jira and Sentry credentials in `.env.local` are optional. You can leave them
blank or remove them when working only on local scenario code and unit tests.

## Dev server

```bash
npm run dev
```

Starts the Vite development server with hot module replacement.

## Verification commands

| Command | What it checks |
| ------- | -------------- |
| `npm test` | Runs unit tests with Vitest |
| `npm run lint` | Runs oxlint for code style and correctness |
| `npm run build` | Runs TypeScript type checking (`tsc -b`) then Vite production build |

## Notes

- `.env.local` is listed in `.gitignore` and **must not be committed**.