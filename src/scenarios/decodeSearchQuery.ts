/**
 * Harbor Shop — Decode search query
 *
 * Sentry issue: URIError from decodeURIComponent on a truncated `%` query.
 *
 * Fixed: decoding is now wrapped so malformed percent-encoding falls back to
 * the raw string instead of throwing. This trigger is resolved and no longer
 * appears on the Error Lab dashboard.
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

function safeDecodeURIComponent(value: string): string {
  try {
    return decodeURIComponent(value)
  } catch (error) {
    if (error instanceof URIError) {
      return value
    }
    throw error
  }
}

export function run(): void {
  const query = safeDecodeURIComponent(rawSearchParam())
  void query
}
