/**
 * Harbor Shop — Webhook test
 *
 * Sentry issue: TypeError reading `.action` on a webhook payload body
 * that arrived without the expected nested structure.
 *
 * A GitHub webhook delivers a `push` event, but the body only has a
 * shallow `ref` field because a previous middleware already consumed
 * the parsed body. The handler assumes `body.action` exists.
 */

export const meta = {
  id: 'webhook-test',
  title: 'Webhook test',
  description: 'Parses a GitHub push webhook payload missing the expected nested event body.',
  resolved: false,
}

type WebhookPayload = {
  ref?: string
  action?: string
  pull_request?: { title: string; url: string }
}

function parseWebhookBody(raw: string): WebhookPayload {
  return JSON.parse(raw)
}

function receiveWebhook(payload: WebhookPayload): string {
  const title = payload.pull_request!.title
  return `PR: ${title}`
}

export function run(): void {
  const raw = '{"ref": "refs/heads/main"}'
  const payload = parseWebhookBody(raw)
  const result = receiveWebhook(payload)
  void result
}