# Local Development

## Prerequisites

- [Node.js](https://nodejs.org/) (LTS release recommended)

## Setup

1. Install dependencies:

   ```sh
   npm install
   ```

2. Copy the environment template:

   ```sh
   cp .env.example .env.local
   ```

3. Start the development server:

   ```sh
   npm run dev
   ```

## Credentials

Jira and Sentry credentials in `.env.local` are optional when you are working only on local scenario code and unit tests. You will see warnings at startup if the variables are empty, but the application will still run.

## Available Commands

| Command | Description |
|---|---|
| `npm test` | Runs unit tests with Vitest. |
| `npm run lint` | Checks code style and catches common mistakes with oxlint. |
| `npm run build` | Type-checks the project with TypeScript and creates a production build with Vite. |

## Environment File

`.env.local` contains secrets and must **not** be committed to version control. It is already listed in `.gitignore`.