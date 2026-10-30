# Local development

## Set up the project

From the repository root, install the dependencies:

```bash
npm install
```

Copy the example environment file to create your local environment:

```bash
cp .env.example .env.local
```

Fill in any values needed for the work you are doing. Jira and Sentry credentials are optional when working only on local scenario code and unit tests. Never commit `.env.local`; it may contain secrets.

## Start the development server

Run the local Vite development server with:

```bash
npm run dev
```

## Verify changes

Run these checks from the repository root:

```bash
npm test
npm run lint
npm run build
```

- `npm test` runs the unit tests.
- `npm run lint` checks the code for lint and static-quality issues.
- `npm run build` checks that the production TypeScript/Vite build succeeds.
