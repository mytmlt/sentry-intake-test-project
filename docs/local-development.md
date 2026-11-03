# Local development quick-start

## Setup

From the repository root, run:

```bash
npm install
cp .env.example .env.local
npm run dev
```
asdfasdf
asdf
`npm install` installs project dependencies. The copy creates your local settings
file, and `npm run dev` starts the Vite development server. Open the local URL
printed by the server.

**Do not commit `.env.local`.** It is already ignored by Git and may contain
credentials.

## Optional credentials

Jira and Sentry credentials can remain unset when working only on local scenario
code and unit tests. You can leave the credentials in the copied `.env.example`
template blank. Browser Sentry reporting is disabled without `VITE_SENTRY_DSN`.

To use external event-generation or reporting features, configure the
corresponding settings in `.env.local`: Jira needs its site URL, email, API token,
and project key; Sentry capture needs a DSN, while issue lookup, resolution, and
assignment also need the appropriate API token, organization, project, and
assignee settings. Integration readiness depends on these configured values.

## Checks

Run these commands from the repository root; no Jira or Sentry credentials are
needed:

| Command | What it checks |
| --- | --- |
| `npm test` | Runs the Vitest unit tests once from `tools/**/*.test.ts`, including scenario regression coverage. Integration tests use injected fakes rather than live services. |
| `npm run lint` | Runs Oxlint to check source code for configured lint issues. |
| `npm run build` | Runs TypeScript project checks and creates the Vite production build. |
