export function parseCorsWhitelist(raw: string): string[] {
  return raw
    .split(/\s+/g)
    .map(url => url.trim().replace(/\/+$/, ''))
    .filter(Boolean);
}
