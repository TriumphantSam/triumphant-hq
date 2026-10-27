/** Keep public runtime settings in one binding to fit the free-plan quota. */
export function siteEnvironment<T extends Record<string, unknown>>(env: T): T & Record<string, unknown> {
  if (typeof env.SITE_PUBLIC_CONFIG !== "string") return env;
  let config: unknown;
  try { config = JSON.parse(env.SITE_PUBLIC_CONFIG); } catch { throw new Error("Invalid public site configuration"); }
  if (!config || typeof config !== "object" || Array.isArray(config)) throw new Error("Invalid public site configuration");
  for (const [key, value] of Object.entries(config)) {
    if (!/^NEXT_PUBLIC_[A-Z0-9_]+$/.test(key) || typeof value !== "string") throw new Error("Invalid public site configuration");
  }
  return { ...env, ...config };
}
