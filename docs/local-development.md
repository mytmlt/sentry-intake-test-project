# Local development

## Run the app

From the repository root, install dependencies and create your local environment file:

```sh
npm install
cp .env.example .env.local
```

Edit `.env.local` only if you need service integrations. Jira and Sentry credentials are optional when working only on local scenario code and running unit tests. Do not commit `.env.local`; it can contain secrets.

Start the development server with:

```sh
npm run dev
```

## Check the project

- `npm test` runs the unit test suite with Vitest.
- `npm run lint` checks the code with Oxlint.
- `npm run build` runs the TypeScript project build checks and creates a production bundle with Vite.
