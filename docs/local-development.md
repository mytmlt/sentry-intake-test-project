# Local development

Install dependencies and create your local environment file:

```bash
npm install
cp .env.example .env.local
```

Keep `.env.local` on your machine; do not commit it. Jira and Sentry credentials are optional when you are working only on local scenario code and running unit tests. Features that send or manage Jira or Sentry events may need the corresponding credentials in `.env.local`.

Start the development server with:

```bash
npm run dev
```

To check your changes, run:

```bash
npm test
npm run lint
npm run build
```

- `npm test` runs the Vitest unit tests.
- `npm run lint` checks source code with Oxlint.
- `npm run build` runs TypeScript project checks and creates a production build with Vite.
