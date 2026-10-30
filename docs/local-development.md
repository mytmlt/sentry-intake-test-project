# Local development

## Set up and run

From the repository root, install the dependencies and create your local environment file:

```sh
npm install
cp .env.example .env.local
```

Then start the development server:

```sh
npm run dev
```

Jira and Sentry credentials are optional when you are working only on local scenario code and running unit tests. Features that connect to those services need their corresponding credentials configured in `.env.local`.

## Run checks

- `npm test` runs the unit tests with Vitest.
- `npm run lint` checks the source files with Oxlint.
- `npm run build` runs the TypeScript project build and creates the production build with Vite.

Keep `.env.local` on your machine. **Do not commit it.**
