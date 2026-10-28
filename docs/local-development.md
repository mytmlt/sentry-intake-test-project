# Local development

From the repository root, install dependencies, copy the example environment
file, and start the Vite development server:

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open the local URL printed by Vite. Jira/Sentry credentials are optional when
working only on local scenario code in `src/scenarios/` and unit tests. You can
leave the example credentials blank for this work; browser Sentry reporting is
disabled when `VITE_SENTRY_DSN` is empty. Configure the relevant values in
`.env.local` only when using the Jira/Sentry event generators or Sentry reporting.

**`.env.local` must not be committed.** It is ignored by Git and may contain
local secrets.

Run these checks from the repository root; no service credentials are needed:

| Command | What it checks |
| --- | --- |
| `npm test` | Runs the unit tests in `tools/**/*.test.ts` once with Vitest, including scenario tests. Service tests use test doubles instead of live Jira/Sentry calls. |
| `npm run lint` | Runs Oxlint to check the code for lint issues. |
| `npm run build` | Runs TypeScript checks with `tsc -b`, then creates the production bundle with `vite build` in `dist/`. |
