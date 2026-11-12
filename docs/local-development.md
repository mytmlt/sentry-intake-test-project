# Local development

## Prerequisites

- [Node.js](https://nodejs.org/) (LTS release)

## Setup

Install dependencies and copy the environment template:

```bash
npm install
cp .env.example .env.local
```

Start the development server:

```bash
npm run dev
```

The server hot-reloads when source files change.

## Credentials

Jira and Sentry credentials in `.env.local` are optional when you are working
only on local scenario code and unit tests. The CLI, UI generator, and
integration tests require credentials for the relevant services.

## Available commands

| Command             | What it checks                                                    |
| ------------------- | ----------------------------------------------------------------- |
| `npm test`          | Runs unit tests with Vitest.                                      |
| `npm run lint`      | Runs oxlint to check for code-quality issues.                     |
| `npm run build`     | Type-checks with TypeScript (`tsc -b`) and bundles with Vite.     |

## Environment file

`.env.local` contains local overrides for service credentials and
configuration. It must **not** be committed to the repository.