/**
 * Harbor Shop — Load customer profile
 *
 * Sentry issue: TypeError reading `.email` on a null profile.
 *
 * Fix the crash so run() no longer throws, then set meta.resolved to true
 * so this trigger disappears from the Error Lab dashboard.
 */

export const meta = {
  id: 'load-customer-profile',
  title: 'Load customer profile',
  description: 'Opens the signed-out guest account and reads the profile email.',
  resolved: true,
}

type Customer = {
  id: string
  profile: { email: string; name: string } | null
}

function getGuestCustomer(): Customer {
  return { id: 'guest', profile: null }
}

export function run(): void {
  const customer = getGuestCustomer()
  const email = customer.profile?.email ?? ''
  void email
}
