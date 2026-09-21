export function uniqueSecrets(secrets: Array<string | undefined>): string[] {
  return [
    ...new Set(
      secrets.filter((secret): secret is string => Boolean(secret && secret.length > 3)),
    ),
  ]
}

export function redactSecrets(text: string, secrets: Array<string | undefined>): string {
  return uniqueSecrets(secrets).reduce(
    (redacted, secret) => redacted.replaceAll(secret, '***'),
    text,
  )
}

export function hostOf(url: string): string {
  try {
    return new URL(url).host
  } catch {
    return 'upstream'
  }
}
