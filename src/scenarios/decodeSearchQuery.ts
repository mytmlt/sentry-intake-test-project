/**
 * Harbor Shop — Decode search query
 *
 * Sentry issue: URIError from decodeURIComponent on a truncated `%` query.
 *
 * Fixed: malformed percent-encoding in the search box (a stray `%` from a
 * partially typed or copy-pasted query) no longer crashes the page. We fall
 * back to the raw value so the search box still renders whatever the
 * shopper typed.
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

export function decodeSearchQuery(raw: string): string {
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
