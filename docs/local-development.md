# Local development

From the repository root, install dependencies, copy the environment template,
and start the Vite development server:

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open the local URL printed by Vite. Jira/Sentry credentials are optional when
working only on local scenario code in `src/scenarios/` and unit tests. Leave
credentials and `VITE_SENTRY_DSN` / `SENTRY_DSN` blank for this workflow; browser
Sentry reporting is disabled without `VITE_SENTRY_DSN`. Configure service access
only when you need to generate Jira/Sentry events.

`.env.local` must not be committed; it can contain secrets and is ignored by Git.

## Check local changes

Run these commands from the repository root; no service credentials are needed:

| Command | What it checks |
| --- | --- |
| `npm test` | Runs the Vitest unit tests in `tools/**/*.test.ts`, including scenario and intake helper tests, using local test doubles for service calls. |
| `npm run lint` | Runs Oxlint to check code for lint errors and warnings. |
| `npm run build` | Runs TypeScript project checks (`tsc -b`), then creates the production bundle with Vite. |
