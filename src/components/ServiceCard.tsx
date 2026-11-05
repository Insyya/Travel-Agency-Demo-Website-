"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

type ServiceCardProps = {
  icon: React.ComponentType<{ size?: number }>;
  title: string;
  description: string;
  image: string;
  link: string;
  index: number;
};

export default function ServiceCard({
  icon: Icon,
  title,
  description,
  image,
  link,
  index,
}: ServiceCardProps) {
  return (
    <article className="service-card">
      <div className="service-image">
        <Image
          src={image}
          alt=""
          width={900}
          height={500}
          sizes="(max-width: 760px) 100vw, 25vw"
          unoptimized
        />
        <span className="service-count">0{index + 1}</span>
      </div>
      <div className="service-body">
        <div className="service-icon"><Icon size={19} /></div>
        <h3>{title}</h3>
        <p>{description}</p>
        <Link className="text-link" href={`/${link.toLowerCase()}`}>Let’s take a look <ArrowRight size={15} /></Link>
      </div>
    </article>
  );
}