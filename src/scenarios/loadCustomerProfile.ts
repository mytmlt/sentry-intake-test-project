/**
 * Harbor Shop — Load customer profile
 *
 * Sentry issue: TypeError reading `.email` on a null profile.
 *
 * Guests have a null profile, so the email is read with optional chaining.
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
  const email = customer.profile?.email
  void email
}
