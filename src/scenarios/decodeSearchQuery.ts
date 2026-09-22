/**
 * Harbor Shop — Decode search query
 *
 * Sentry issue: URIError from decodeURIComponent on a truncated `%` query.
 *
 * Fix the crash so run() no longer throws, then set meta.resolved to true
 * so this trigger disappears from the Error Lab dashboard.
 */

export const meta = {
  id: 'decode-search-query',
  title: 'Decode search query',
  description: 'Decodes the storefront search box value from the URL.',
  resolved: true,
}

function rawSearchParam(): string {
  return '%'
}

function decodeSearchQuery(raw: string): string {
  try {
    return decodeURIComponent(raw)
  } catch (error) {
    if (error instanceof URIError) {
      return raw
    }
    throw error
  }
}

export function run(): void {
  const query = decodeSearchQuery(rawSearchParam())
  void query
}
