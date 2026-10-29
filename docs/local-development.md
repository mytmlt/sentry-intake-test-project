# Local development

## Setup

From the repository root, install dependencies, create your local environment file, and start the development server:

```sh
npm install
cp .env.example .env.local
npm run dev
```

Jira and Sentry credentials are optional when you are working only on local scenario code and running unit tests. Features that connect to those services need their corresponding credentials configured in `.env.local`.

Never commit `.env.local`; it may contain credentials and local settings.

## Checks

- `npm test` runs the unit test suite.
- `npm run lint` checks the code with oxlint.
- `npm run build` checks TypeScript and creates a production build with Vite.
