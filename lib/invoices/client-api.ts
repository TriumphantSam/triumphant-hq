export async function readApiJson<T = Record<string, unknown>>(res: Response): Promise<T> {
  const text = await res.text();
  if (!text.trim()) {
    throw new Error(
      res.ok
        ? "Empty response from server"
        : `Request failed (${res.status}). ${res.status === 401 ? "Please sign in again." : "Try again or check server logs."}`
    );
  }
  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error(
      `Unexpected server response (${res.status}): ${text.replace(/\s+/g, " ").slice(0, 180)}`
    );
  }
}
