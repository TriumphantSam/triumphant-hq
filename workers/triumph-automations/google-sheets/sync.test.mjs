import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { createHmac, randomUUID } from "node:crypto";

test("bound script upserts rows, neutralizes formulas and retries an acknowledgement without duplicates", () => {
  const secret = "s".repeat(64),
    rows = [],
    requests = [];
  let failedAck = false;
  const lead = {
    id: randomUUID(),
    created_at: "2026-10-13T12:00:00.000Z",
    updated_at: "2026-10-13T12:00:00.000Z",
    source: "test",
    name: "Test Person",
    email: "test@example.com",
    phone: "+234000000000",
    service: "Test",
    need: '=IMPORTXML("example")',
    consent_marketing: 0,
  };
  const sheet = {
    getLastRow: () => rows.length,
    getRange: (r, c, n, w) => ({
      getDisplayValues: () =>
        Array.from({ length: n }, (_, i) =>
          Array.from({ length: w }, (_, j) =>
            String(rows[r + i - 1]?.[c + j - 1] || ""),
          ),
        ),
      setValues: (values) =>
        values.forEach((value, i) => {
          rows[r + i - 1] = [...value];
        }),
    }),
  };
  const context = {
    Date,
    JSON,
    String,
    Error,
    LockService: {
      getScriptLock: () => ({ tryLock: () => true, releaseLock: () => {} }),
    },
    SpreadsheetApp: {
      getActiveSpreadsheet: () => ({ getSheetByName: () => sheet }),
      flush: () => {},
    },
    PropertiesService: {
      getScriptProperties: () => ({
        getProperty: (name) =>
          name === "WORKER_API_BASE" ? "https://worker.example" : secret,
      }),
    },
    Utilities: {
      getUuid: randomUUID,
      Charset: { UTF_8: "UTF-8" },
      computeHmacSha256Signature: (message, key) => [
        ...createHmac("sha256", key).update(message).digest(),
      ],
    },
    UrlFetchApp: {
      fetch: (url, options) => {
        const path = new URL(url).pathname,
          h = options.headers;
        const expected = createHmac("sha256", secret)
          .update(
            [
              h["x-triumph-timestamp"],
              h["x-triumph-nonce"],
              "POST",
              path,
              options.payload,
            ].join("\n"),
          )
          .digest("hex");
        assert.equal(h["x-triumph-signature"], expected);
        assert.equal(options.followRedirects, false);
        requests.push(path);
        if (path.endsWith("/ack") && !failedAck) {
          failedAck = true;
          return { getResponseCode: () => 503 };
        }
        return {
          getResponseCode: () => 200,
          getContentText: () =>
            JSON.stringify(
              path.endsWith("/pull")
                ? { ok: true, leads: [lead] }
                : { ok: true },
            ),
        };
      },
    },
  };
  runInNewContext(
    readFileSync(new URL("./Code.gs", import.meta.url), "utf8"),
    context,
  );
  assert.throws(() => context.syncTriumphLeads(), /rejected/);
  assert.equal(rows.length, 2);
  context.syncTriumphLeads();
  assert.equal(rows.length, 2);
  assert.equal(rows[1][0], lead.id);
  assert.equal(rows[1][7].startsWith("'="), true);
  assert.equal(requests.filter((path) => path.endsWith("/ack")).length, 2);
  lead.status = "qualified";
  lead.owner_notes = "Private owner notes must not be mirrored";
  context.syncTriumphLeads();
  assert.equal(rows.length, 2);
  assert.equal(rows[1][9], "qualified");
  assert.equal(JSON.stringify(rows).includes(lead.owner_notes), false);
});
