/**
 * Harbor Shop — Load customer profile
 *
 * Sentry issue: TypeError reading `.email` on a null profile.
 *
 * Fixed: guest accounts have no profile yet, so run() now falls back to a
 * guest email instead of forcing access on a null profile.
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

const GUEST_EMAIL = 'guest@harborshop.example'

function getGuestCustomer(): Customer {
  return { id: 'guest', profile: null }
}

export function getCustomerEmail(customer: Customer): string {
  return customer.profile?.email ?? GUEST_EMAIL
}

export function run(): void {
  const customer = getGuestCustomer()
  const email = getCustomerEmail(customer)
  void email
}
