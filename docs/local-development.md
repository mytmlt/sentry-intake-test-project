# Local development quick-start guide

## Prerequisites

- [Node.js](https://nodejs.org/) (LTS version recommended)
- npm

## Setup

Install dependencies:

```bash
npm install
```

Copy the example environment file and edit as needed:

```bash
cp .env.example .env.local
```

Start the development server:

```bash
npm run dev
```

## Credentials

Jira and Sentry credentials are **optional** when you are working only on local
scenario code and unit tests. You only need to configure them when you run CLI
commands that interact with those services (see the
[README](../README.md#cli-and-environment-reference) for details).

## Available commands

| Command | What it checks |
|---|---|
| `npm test` | Runs unit tests via [vitest](https://vitest.dev/). |
| `npm run lint` | Lints the codebase with [oxlint](https://oxc.rs/). |
| `npm run build` | Type-checks the project with TypeScript (`tsc -b`) and produces a production build with [Vite](https://vite.dev/). |

## Important

`.env.local` contains local configuration and **must not be committed**. The
repository's `.gitignore` already excludes it.