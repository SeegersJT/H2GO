export async function getAppVersion(): Promise<string> {
  const res = await fetch('/version.jsonc?ts=${Date.now()}', { cache: 'no-cache' })
  const data = await res.json()
  return data.version
}
