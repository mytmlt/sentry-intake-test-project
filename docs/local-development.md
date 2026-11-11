# Local development quick start

## Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open the printed URL to use the application.

Jira and Sentry credentials in `.env.local` are optional when you are working
only on local scenario code and unit tests. The app and CLI still start without
them; only the Jira and Sentry features require configured credentials.

## Verification

| Command | What it checks |
| --- | --- |
| `npm test` | Runs Vitest unit tests in `tools/**/*.test.ts` |
| `npm run lint` | Runs oxlint with React and TypeScript rules |
| `npm run build` | TypeScript type check plus Vite production build |

## Notes

- `.env.local` must **not** be committed. It is already listed in `.gitignore`.
- See [CLI examples](cli-examples.md) for a credential-free CLI walkthrough.
- See the [README](../README.md) for full service setup and environment variable
  reference.