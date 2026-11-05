import type { Metadata } from "next";
import ServicePage from "@/components/ServicePage";

export const metadata: Metadata = {
  title: "Car Rental | Voyago",
  description: "Find a sample rental car for your next road trip with Voyago.",
};

type CarsPageProps = { searchParams: Promise<{ destination?: string | string[] }> };

export default function CarsPage({ searchParams }: CarsPageProps) {
  return <ServicePage service="cars" searchParams={searchParams} />;
}
