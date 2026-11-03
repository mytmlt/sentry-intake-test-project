# Local development on your machine

## Setup

1. **Install dependencies**

   ```sh
   npm install
   ```

2. **Configure environment variables**

   Copy the example environment file:

   ```sh
   cp .env.example .env.local
   ```

   ## test comment

3. **Start the development server**

   ```sh
   npm run dev
   ```

   The Vite dev server starts on `http://localhost:5173` by default.

## Credentials

Jira and Sentry credentials are entirely optional when you are working only on local
scenario code and unit tests. The project works without any external service
configuration for these tasks.

## Commands

| Command | Purpose |
|---------|---------|
| `npm test` | Runs the unit test suite (Vitest). |
| `npm run lint` | Checks code style and reports lint violations (oxlint). |
| `npm run build` | Compiles TypeScript and produces a production bundle (Vite). |

## Important notes

- **`.env.local` must not be committed.** It is already listed in `.gitignore`,
  but verify you never stage or commit it manually.
