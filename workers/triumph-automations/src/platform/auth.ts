import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { emailOTP } from "better-auth/plugins/email-otp";
import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schema";
import { hmac } from "../security";
import type { Env } from "../types";

export type OtpSender = (email: string, otp: string) => Promise<void>;
export async function platformAuth(env: Env, sender?: OtpSender) {
  const secret = await hmac(env.AUTOMATION_HMAC_SECRET, "platform-auth-v1");
  return betterAuth({
    appName: "TriumphantTech Workspace",
    baseURL: "https://platform.internal",
    basePath: "/auth",
    secret,
    database: drizzleAdapter(drizzle(env.DB, { schema }), {
      provider: "sqlite",
      schema,
    }),
    emailAndPassword: { enabled: false },
    session: { expiresIn: 60 * 60 * 8, cookieCache: { enabled: false } },
    advanced: {
      cookiePrefix: "triumph-platform",
      useSecureCookies: env.ENVIRONMENT !== "test",
      defaultCookieAttributes: {
        httpOnly: true,
        sameSite: "strict",
        path: "/",
      },
      database: { generateId: () => crypto.randomUUID() },
    },
    // RPC admission uses durable D1 counters; no per-isolate limiter is relied on.
    rateLimit: { enabled: false },
    plugins: [
      emailOTP({
        otpLength: 8,
        expiresIn: 300,
        allowedAttempts: 5,
        storeOTP: "hashed",
        async sendVerificationOTP({ email, otp, type }) {
          if (type !== "sign-in") throw new Error("Unsupported verification");
          if (sender) return sender(email, otp);
          if (!env.RESEND_API_KEY || !env.EMAIL_FROM)
            throw new Error("Email connection unavailable");
          const response = await fetch("https://api.resend.com/emails", {
            method: "POST",
            redirect: "manual",
            signal: AbortSignal.timeout(8000),
            headers: {
              Authorization: `Bearer ${env.RESEND_API_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              from: env.EMAIL_FROM,
              to: [email],
              subject: "Your TriumphantTech sign-in code",
              text: `Your sign-in code is ${otp}. It expires in five minutes. Do not share it. If you did not request it, ignore this email.`,
            }),
          });
          if (!response.ok) throw new Error("Email connection unavailable");
        },
      }),
    ],
    logger: { disabled: true },
  });
}
