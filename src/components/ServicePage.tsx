import { Suspense } from "react";
import ServiceExperience from "@/components/ServiceExperience";
import type { ServiceKey } from "@/lib/travel-data";

type ServicePageProps = {
  service: ServiceKey;
  searchParams: Promise<{ destination?: string | string[] }>;
};

async function ResolvedService({ service, searchParams }: ServicePageProps) {
  const { destination } = await searchParams;
  return <ServiceExperience service={service} initialDestination={typeof destination === "string" ? destination : ""} />;
}

export default function ServicePage({ service, searchParams }: ServicePageProps) {
  return (
    <Suspense fallback={<div className="service-route-fallback" role="status">Getting your journey ready…</div>}>
      <ResolvedService service={service} searchParams={searchParams} />
    </Suspense>
  );
}
