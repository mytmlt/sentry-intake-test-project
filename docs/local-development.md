# Local Development

Quick-start guide for running this test repository locally.

## Prerequisites

- Node.js (version matching the project's `engines` requirement, if specified)
- npm

## Setup

1. Install dependencies:

   ```sh
   npm install
   ```

2. Copy the environment template:

   ```sh
   cp .env.example .env.local
   ```

   **`.env.local` must not be committed.** It is listed in `.gitignore` and contains
   local secrets and overrides.

3. Start the development server:

   ```sh
   npm run dev
   ```

## Credentials

Jira/Sentry credentials are **optional** when you are working only on local scenario
code and unit tests. The application reads credentials from `.env.local` at runtime;
if they are missing, commands that contact external services will fail, but scenario
code and unit tests work without them.

## Available Commands

| Command | Purpose |
|---------|---------|
| `npm test` | Runs unit tests with Vitest. Checks that scenario logic and other code behaves as expected. |
| `npm run lint` | Lints the codebase with `oxlint`. Checks for style issues, common mistakes, and unused code. |
| `npm run build` | Type-checks with `tsc` and bundles the app with Vite. Verifies that the project compiles without errors. |