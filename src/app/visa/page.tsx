import type { Metadata } from "next";
import ServicePage from "@/components/ServicePage";

export const metadata: Metadata = {
  title: "Visa Assistance | Voyago",
  description: "Explore sample visa requirements and get frontend-only visa guidance with Voyago.",
};

type VisaPageProps = { searchParams: Promise<{ destination?: string | string[] }> };

export default function VisaPage({ searchParams }: VisaPageProps) {
  return <ServicePage service="visa" searchParams={searchParams} />;
}
