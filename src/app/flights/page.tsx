import type { Metadata } from "next";
import ServicePage from "@/components/ServicePage";

export const metadata: Metadata = {
  title: "Find Flights | Voyago",
  description: "Search and compare sample flight options for your next journey with Voyago.",
};

type FlightsPageProps = { searchParams: Promise<{ destination?: string | string[] }> };

export default function FlightsPage({ searchParams }: FlightsPageProps) {
  return <ServicePage service="flights" searchParams={searchParams} />;
}
