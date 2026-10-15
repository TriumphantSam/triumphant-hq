export async function hmac(secret: string, value: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const result = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(value),
  );
  return [...new Uint8Array(result)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
export async function verifySignedRequest(
  request: Request,
  body: string,
  secret: string,
  now = Date.now(),
) {
  const timestamp = request.headers.get("x-triumph-timestamp") || "",
    nonce = request.headers.get("x-triumph-nonce") || "",
    signature = request.headers.get("x-triumph-signature") || "";
  if (
    !secret ||
    !/^\d{13}$/.test(timestamp) ||
    Math.abs(now - Number(timestamp)) > 60000 ||
    !/^[a-f0-9-]{36}$/.test(nonce) ||
    !/^[a-f0-9]{64}$/.test(signature)
  )
    return false;
  const expected = await hmac(
    secret,
    `${timestamp}\n${nonce}\n${request.method}\n${new URL(request.url).pathname}\n${body}`,
  );
  let difference = 0;
  for (let i = 0; i < expected.length; i++)
    difference |= expected.charCodeAt(i) ^ signature.charCodeAt(i);
  return difference === 0;
}
export const safeSheetCell = (value: string) =>
  /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;
