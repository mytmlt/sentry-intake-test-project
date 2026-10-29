# Local development

## Set up and run

Install the dependencies, create your local environment file from the example, and start the development server:

```sh
npm install
cp .env.example .env.local
npm run dev
```

The app starts with Vite and prints a local URL in the terminal. Jira and Sentry credentials are optional when you are only working on local scenario code and running the unit tests. Features that connect to those services need their corresponding credentials in `.env.local`.

## Run the checks

```sh
npm test       # Run the unit test suite
npm run lint   # Check the code with the linter
npm run build  # Type-check and create the production build
```

`.env.local` can contain private credentials and must not be committed.
