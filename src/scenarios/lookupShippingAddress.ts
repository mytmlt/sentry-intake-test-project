/**
 * Harbor Shop — Lookup shipping address
 *
 * Sentry issue: TypeError reading `.zip` on a null address returned by the
 * geocoding API for an unsupported region.
 *
 * Fix the crash so run() no longer throws, then set meta.resolved to true
 * so this trigger disappears from the Error Lab dashboard.
 */

export const meta = {
  id: 'lookup-shipping-address',
  title: 'Lookup shipping address',
  description: 'Looks up a shipping address from coordinates returned by the geocoding API.',
  resolved: false,
}

type Address = { street: string; zip: string }

function geocode(_lat: number, _lng: number): Address | null {
  return null
}

export function run(): void {
  const address = geocode(0, 0)!
  const zip = address.zip
  void zip
}