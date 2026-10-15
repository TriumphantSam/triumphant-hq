"use client";

import { useState } from "react";
import Link from "next/link";
import {
  demoProducts,
  demoSummary,
  demoReport,
  formatNaira,
  type DemoSale,
} from "@/lib/admin-demo";

const draftSources = [
  {
    title: "Website enquiries",
    text: "Make it easier for customers to reach you. TriumphantTech builds websites with clear enquiry paths. Tell us about your business and the next step you want customers to take.",
    href: "/services/websites",
  },
  {
    title: "Booking automation",
    text: "Less back-and-forth when booking a call. Try our free 30-minute automation consultation: choose a time and receive email confirmation and reminders.",
    href: "/automation-lab/booking",
  },
  {
    title: "Lead capture",
    text: "Give every enquiry a next step. Try the TriumphantTech lead capture demo to see an enquiry stored, mirrored to a Sheet and followed by email notifications.",
    href: "/automation-lab/lead-capture",
  },
];

export default function AdminDemo() {
  const [sales, setSales] = useState<DemoSale[]>([]);
  const [approved, setApproved] = useState<string[]>([]);
  const [notice, setNotice] = useState("");
  const summary = demoSummary(sales);
  const low = summary.products.filter(
    (product) => product.stock <= product.threshold,
  );
  const report = demoReport(sales);
  function sell() {
    setSales((current) => {
      const state = demoSummary(current);
      if (state.products[0].stock < 1) return current;
      return [
        ...current,
        {
          id: crypto.randomUUID(),
          product: "handbook",
          quantity: 1,
          amountKobo: demoProducts[0].priceKobo,
        },
      ];
    });
    setNotice(
      "Sample sale recorded. The report and stock level have updated. No payment was collected.",
    );
  }
  function download() {
    const url = URL.createObjectURL(
      new Blob([report], { type: "text/plain;charset=utf-8" }),
    );
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "sample-automation-report.txt";
    anchor.click();
    URL.revokeObjectURL(url);
    setNotice("Sample report downloaded. No customer information is included.");
  }
  return (
    <div className="lab-panel lab-admin">
      <span className="lab-badge">Interactive sample data</span>
      <h2>Your morning, in one view</h2>
      <p className="lab-note">
        All numbers, orders and stock below are fictional. Changes stay in this
        page and reset when you reload. No payments, messages or social posts
        are sent.
      </p>
      <dl className="lab-admin-metrics">
        <div>
          <dt>New enquiries</dt>
          <dd>6</dd>
        </div>
        <div>
          <dt>Consultations booked</dt>
          <dd>3</dd>
        </div>
        <div>
          <dt>Sample payments</dt>
          <dd>{formatNaira(summary.paidKobo)}</dd>
        </div>
        <div>
          <dt>Unpaid sample invoices</dt>
          <dd>2 · ₦25,000</dd>
        </div>
      </dl>
      <h3>Try the stock alert</h3>
      <p className="lab-note">
        Record two sample handbook sales to reach its low-stock threshold. Each
        sale adds ₦3,500 to the sample report.
      </p>
      <ul className="lab-admin-stock">
        {summary.products.map((product) => (
          <li key={product.id}>
            <span>{product.name}</span>
            <strong>{product.stock} left</strong>
            <span>Alert at {product.threshold}</span>
          </li>
        ))}
      </ul>
      <div className="lab-actions">
        <button
          className="lab-link"
          type="button"
          onClick={sell}
          disabled={summary.products[0].stock === 0}
        >
          {summary.products[0].stock
            ? "Record a sample sale"
            : "Sample handbook sold out"}
        </button>
        <button
          className="lab-link secondary"
          type="button"
          onClick={() => {
            setSales([]);
            setApproved([]);
            setNotice("Sample scenario reset.");
          }}
        >
          Reset sample
        </button>
      </div>
      <div className="lab-admin-alert" role="status">
        {low.length ? (
          low.map((product) => (
            <p key={product.id}>
              Restock {product.name.toLowerCase()}: {product.stock} remaining
              (threshold {product.threshold}).
            </p>
          ))
        ) : (
          <p>No stock alerts in this sample yet.</p>
        )}
      </div>
      <h3>Owner report preview</h3>
      <pre className="lab-admin-report">{report}</pre>
      <button className="lab-link secondary" type="button" onClick={download}>
        Download sample report
      </button>
      <h3>Social drafts need your approval</h3>
      <p className="lab-note">
        These are writing templates based on our service pages, not
        AI-generated posts. Approval below is a local demonstration and
        publishes nothing.
      </p>
      {draftSources.map((draft) => (
        <div className="lab-admin-draft" key={draft.title}>
          <h4>{draft.title}</h4>
          <p>{draft.text}</p>
          <Link href={draft.href}>Check the source →</Link>
          <button
            type="button"
            className="lab-link secondary"
            disabled={approved.includes(draft.title)}
            onClick={() => {
              setApproved((current) => [...current, draft.title]);
              setNotice(
                "Draft marked approved in this sample only. Nothing has been published.",
              );
            }}
          >
            {approved.includes(draft.title)
              ? "Approved in sample"
              : "Mark approved in sample"}
          </button>
        </div>
      ))}
      <p className="lab-note" role="status">
        {notice}
      </p>
    </div>
  );
}
