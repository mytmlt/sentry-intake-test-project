# Local development

## Set up and run

Install the project dependencies:

```sh
npm install
```

Copy the example environment file to your local environment file, then start the development server:

```sh
cp .env.example .env.local
npm run dev
```

Jira and Sentry credentials are optional when you are working only on local scenario code and unit tests. Integrations that send or manage Jira or Sentry events require the relevant credentials. Keep credentials in `.env.local`; do not commit `.env.local`.

## Check your changes

- `npm test` runs the Vitest unit tests.
- `npm run lint` checks the code with Oxlint.
- `npm run build` runs the TypeScript project builds and creates the Vite production bundle.
