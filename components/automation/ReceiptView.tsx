"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
type Receipt = {
  reference: string;
  amountKobo: number;
  currency: string;
  paidAt: string;
  mode: "test";
  status: "paid";
};
export default function ReceiptView({ reference }: { reference: string }) {
  const [receipt, setReceipt] = useState<Receipt | null>(null),
    [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    fetch("/api/automation/payments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "receipt", reference }),
    })
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.error);
        if (active) setReceipt(result);
      })
      .catch((e) => {
        if (active)
          setError(e instanceof Error ? e.message : "Receipt unavailable.");
      });
    return () => {
      active = false;
    };
  }, [reference]);
  return (
    <main className="mx-auto max-w-2xl px-6 py-24">
      <h1 className="text-3xl font-bold">Automation Lab test receipt</h1>
      <p className="my-6">
        TEST MODE — no real money was collected. This is a demonstration
        receipt, not a tax invoice.
      </p>
      {receipt ? (
        <dl className="space-y-4">
          <div>
            <dt>Business</dt>
            <dd>Triumphant Technological Services · Basorun Rd, Ibadan</dd>
          </div>
          <div>
            <dt>Verified amount</dt>
            <dd>₦100.00 · NGN</dd>
          </div>
          <div>
            <dt>Reference</dt>
            <dd className="break-all">{receipt.reference}</dd>
          </div>
          <div>
            <dt>Payment date (Lagos time)</dt>
            <dd>
              {new Date(receipt.paidAt).toLocaleString("en-GB", {
                timeZone: "Africa/Lagos",
              })}{" "}
              WAT
            </dd>
          </div>
          <div>
            <dt>Status</dt>
            <dd>Verified test payment</dd>
          </div>
        </dl>
      ) : (
        <p role="status">{error || "Checking receipt…"}</p>
      )}
      {receipt && (
        <button
          className="my-6 rounded border px-5 py-3 print:hidden"
          onClick={() => window.print()}
        >
          Print / save as PDF
        </button>
      )}
      <Link className="block print:hidden" href="/automation-lab/payments">
        Back to the payment demo →
      </Link>
    </main>
  );
}
