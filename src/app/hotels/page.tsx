import type { Metadata } from "next";
import ServicePage from "@/components/ServicePage";

export const metadata: Metadata = {
  title: "Find a Stay | Voyago",
  description: "Discover sample hotels, resorts, and stays around the world with Voyago.",
};

type HotelsPageProps = { searchParams: Promise<{ destination?: string | string[] }> };

export default function HotelsPage({ searchParams }: HotelsPageProps) {
  return <ServicePage service="hotels" searchParams={searchParams} />;
}
