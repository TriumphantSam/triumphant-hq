import {
  absoluteCanonicalUrl,
  canonicalRedirectUrl,
  normalizeHostname,
} from "./canonical-host";

function assert(condition: unknown, message: string) {
  if (!condition) throw new Error(message);
}

assert(normalizeHostname("WWW.Triumphantech.com:443") === "www.triumphantech.com", "normalize host");
assert(absoluteCanonicalUrl("/") === "https://triumphantech.com", "homepage canonical");
assert(absoluteCanonicalUrl("/locations/ibadan") === "https://triumphantech.com/locations/ibadan", "path canonical");
assert(
  canonicalRedirectUrl("www.triumphantech.com", "/services/seo", "?utm=1") ===
    "https://triumphantech.com/services/seo?utm=1",
  "www path + query",
);
assert(
  canonicalRedirectUrl("triumphanthq.com", "/locations/ibadan") ===
    "https://triumphantech.com/locations/ibadan",
  "leftover domain preserves path",
);
assert(canonicalRedirectUrl("triumphantech.com", "/about") === null, "apex is not redirected");
assert(canonicalRedirectUrl("preview.vercel.app", "/") === null, "preview host is left alone");
assert(canonicalRedirectUrl("localhost:3000", "/") === null, "localhost is left alone");

console.log("canonical-host checks passed");
