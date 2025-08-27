export async function getAppVersion(): Promise<string> {
  const res = await fetch(`/version.json?ts=${Date.now()}`, { cache: 'no-store' })
  const data = await res.json()
  return String(data.version ?? '0.0.0')
}
