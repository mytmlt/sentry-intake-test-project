# CLI examples

These examples use `npm run intake`. They do **not** need Jira credentials, Sentry
credentials, or a running Vite dev server.

## Help

```bash
npm run intake -- --help
```

## Status

```bash
npm run intake -- status
```

`status` reports missing configuration without creating Jira issues or Sentry
events. It returns a JSON object with two fields:

- `readiness` — an object whose keys (`jira`, `jiraAssign`, `sentry`,
  `sentryAssign`) are `true` when the corresponding environment variables are
  set and `false` when they are missing.
- `missing` — an array of environment variable names that are not configured.

Run `status` before any create, update, or matrix command to confirm which
services are ready.

## The `--` separator

In npm commands, `--` tells npm to pass all following arguments to the script
rather than interpreting them as npm flags. For example:

```bash
npm run intake -- --help
#             ^^  ^^^^^
#             npm  forwarded to the intake script
```

Without `--`, npm would try to parse `--help` as an npm flag and fail.

## Commands that need service configuration

The following commands interact with external services and need the
corresponding environment variables set in `.env` or `.env.local`:

- `npm run intake -- jira create` — requires Jira credentials
- `npm run intake -- jira update` — requires Jira credentials
- `npm run intake -- sentry create` — requires Sentry credentials
- `npm run intake -- sentry regress|unresolved` — requires Sentry credentials
- `npm run intake -- sentry assign|assigned` — requires Sentry credentials
- `npm run intake -- matrix` — requires Jira or Sentry credentials

See `README.md` for the full list of required environment variables.