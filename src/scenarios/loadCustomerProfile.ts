/**
 * Harbor Shop — Load customer profile
 *
 * Sentry issue: TypeError reading `.email` on a null profile.
 *
 * Fixed: signed-out guests never have a profile, so the page now falls
 * back to a guest placeholder instead of assuming one exists.
 */

export const meta = {
  id: 'load-customer-profile',
  title: 'Load customer profile',
  description: 'Opens the signed-out guest account and reads the profile email.',
  resolved: true,
}

const GUEST_EMAIL = 'guest@harborshop.example'

type Customer = {
  id: string
  profile: { email: string; name: string } | null
}

function getGuestCustomer(): Customer {
  return { id: 'guest', profile: null }
}

export function run(): void {
  const customer = getGuestCustomer()
  const email = customer.profile?.email ?? GUEST_EMAIL
  void email
}
