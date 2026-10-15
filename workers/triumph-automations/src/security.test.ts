import test from "node:test";
import assert from "node:assert/strict";
import { hmac, verifySignedRequest, safeSheetCell } from "./security";
test("HMAC binds body, method, path, nonce and timestamp", async () => {
  const now = Date.now(),
    nonce = crypto.randomUUID(),
    body = '{"name":"Example"}',
    secret = "test-secret";
  const signature = await hmac(
    secret,
    `${now}\n${nonce}\nPOST\n/v1/leads\n${body}`,
  );
  const request = new Request("https://worker.example/v1/leads", {
    method: "POST",
    headers: {
      "x-triumph-timestamp": String(now),
      "x-triumph-nonce": nonce,
      "x-triumph-signature": signature,
    },
  });
  assert.equal(await verifySignedRequest(request, body, secret, now), true);
  assert.equal(await verifySignedRequest(request, "{}", secret, now), false);
  assert.equal(
    await verifySignedRequest(request, body, secret, now + 61000),
    false,
  );
  assert.equal(
    await verifySignedRequest(request, body, "wrong-secret", now),
    false,
  );
});
test("spreadsheet cells cannot become formulas", () => {
  for (const text of ['=IMPORTXML("url")', "+1", "-1", "@command", "\tvalue"])
    assert.equal(safeSheetCell(text).startsWith("'"), true);
  assert.equal(safeSheetCell("Normal text"), "Normal text");
});
