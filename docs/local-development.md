# Local development

From the repository root, install dependencies, create your local environment
file, and start the development server:

```bash
npm install
cp .env.example .env.local
npm run dev
```

The development server prints a local URL to open in your browser. Edit the
scenario code and the app will reload as you work. Jira and Sentry credentials
are optional when you are only working on local scenario code and running unit
tests. Features that connect to those services need their corresponding
credentials in `.env.local`.

Run the project checks from the repository root:

```bash
npm test       # Run the unit test suite.
npm run lint   # Check source files for lint issues.
npm run build  # Type-check the project and build the production app.
```

Keep `.env.local` on your machine. **Do not commit it.**
