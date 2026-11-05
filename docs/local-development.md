# Local development

Install the project dependencies and copy the example environment file to your local settings file:

```bash
npm install
cp .env.example .env.local
```

Start the Vite development server with:

```bash
npm run dev
```

Open the local URL printed by Vite. Jira and Sentry credentials are optional when you are working only on local scenario code and unit tests. Integration features that need those services will remain unconfigured without their credentials.

Run the repository checks with:

```bash
npm test
npm run lint
npm run build
```

- `npm test` runs the unit tests with Vitest.
- `npm run lint` checks the code with oxlint.
- `npm run build` runs the TypeScript checks and creates the Vite production build.

`.env.local` may contain local secrets and must not be committed.
