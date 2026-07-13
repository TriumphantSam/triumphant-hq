import type { Metadata } from "next";
import ServiceLanding from "@/components/marketing/ServiceLanding";
import { getAgencyService } from "@/lib/services";

export const metadata: Metadata = {
  title: "Custom Application Development | Triumphant HQ",
  description: "Custom web applications, portals and operational software designed around your business.",
};

export default function AppDevelopmentPage() {
  return <ServiceLanding service={getAgencyService("app-development")!} />;
}
