# Local CLI examples

Run these commands from the repository root. The `--` separator tells npm to
pass the arguments that follow it to the intake CLI.

## Show available commands

```bash
npm run intake -- --help
```

## Check configuration

```bash
npm run intake -- status
```

`status` reports which service configuration is missing. It is safe to run
without service credentials: it does not create Jira issues or send Sentry
events.

## Commands that create test data

Create, update, regress, assign, and `matrix` commands can create external
test data. Configure the relevant Jira and/or Sentry service settings before
running them. For example, `jira update` without an issue key creates a Jira
issue before updating it, and `matrix` can generate many Jira and Sentry
events.
