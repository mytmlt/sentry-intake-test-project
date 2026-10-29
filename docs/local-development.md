# Local development

Run these commands from the repository root:

```bash
npm install
cp .env.example .env.local
npm run dev
```

`npm install` installs the dependencies. Copying `.env.example` creates your
local environment configuration. `npm run dev` starts the Vite development
server; open the URL printed in the terminal.

Jira and Sentry credentials are optional when working only on local scenario
code in `src/scenarios/` and running unit tests. You can leave the service
credentials and DSNs blank in `.env.local`; browser Sentry reporting is disabled
without `VITE_SENTRY_DSN`. Configure the relevant environment variables only
when you want to generate real Jira or Sentry events through the UI or CLI.
See the [README environment reference](../README.md#environment) for details.

**Do not commit `.env.local`.** It is ignored by Git and may contain secrets.

## Check local changes

These commands do not need Jira or Sentry credentials:

| Command | What it checks |
| --- | --- |
| `npm test` | Runs the Vitest unit tests in `tools/`, including scenario and intake helper tests. Integration tests use fake clients rather than live services. |
| `npm run lint` | Runs Oxlint to check the code for lint violations. |
| `npm run build` | Runs TypeScript project checks (`tsc -b`), then creates the production bundle with Vite. |
