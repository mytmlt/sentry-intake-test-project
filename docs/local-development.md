# Local development

## Set up and run the app

From the repository root, install dependencies, create your local environment
file, and start the development server:

```bash
npm install
cp .env.example .env.local
npm run dev
```

Jira and Sentry credentials are optional when you are working only on local
scenario code and running unit tests. Add the relevant credentials to
`.env.local` only when you need to use integrations that contact those services.

Never commit `.env.local`; it can contain local credentials.

## Verify changes

- `npm test` runs the unit tests with Vitest.
- `npm run lint` checks the code with oxlint.
- `npm run build` checks TypeScript project references and creates a production
  build with Vite.
