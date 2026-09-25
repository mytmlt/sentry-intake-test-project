/**
 * Harbor Shop — Load customer profile
 *
 * Sentry issue: TypeError reading `.email` on a null profile.
 *
 * Fixed: guest accounts have no profile, so we fall back to a guest
 * placeholder instead of forcing a non-null read.
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

const GUEST_EMAIL = 'guest@harbor-shop.example'

function getGuestCustomer(): Customer {
  return { id: 'guest', profile: null }
}

export function resolveEmail(customer: Customer): string {
  return customer.profile?.email ?? GUEST_EMAIL
}

export function run(): void {
  const customer = getGuestCustomer()
  const email = resolveEmail(customer)
  void email
}
