# Local development quick start

## Setup

```bash
npm install
cp .env.example .env.local
```

Jira and Sentry credentials in `.env.local` are optional when you are working
only on local scenario code and unit tests. The app starts without them;
commands that need service configuration will report the missing values at
runtime.

Do not commit `.env.local`. It is listed in `.gitignore`.

## Run the dev server

```bash
npm run dev
```

Open the printed URL. Use the Jira and Sentry forms for filter events. Use
**Trigger error** for browser crash scenarios.

## Useful commands

| Command | What it checks |
| --- | --- |
| `npm test` | Runs unit tests with Vitest |
| `npm run lint` | Lints the codebase with oxlint |
| `npm run build` | Type-checks with TypeScript and builds with Vite |

See the [README](../README.md) for CLI examples, environment variables, and
scenario documentation.