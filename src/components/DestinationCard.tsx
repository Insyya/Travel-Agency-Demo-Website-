"use client";

import Image from "next/image";
import { ArrowRight, Heart } from "lucide-react";

type Destination = {
  name: string;
  country: string;
  price: string;
  description: string;
  image: string;
};

type DestinationCardProps = {
  destination: Destination;
  index: number;
  savedDestinations: string[];
  toggleSaved: (name: string) => void;
  scrollToTripPlanner: (destination: string) => void;
};

export default function DestinationCard({
  destination,
  index,
  savedDestinations,
  toggleSaved,
  scrollToTripPlanner,
}: DestinationCardProps) {
  return (
    <article
      className={`destination-card destination-card-${index + 1}`}
      key={destination.name}
    >
      <Image
        src={destination.image}
        alt={`${destination.name}, ${destination.country}`}
        fill
        sizes="(max-width: 760px) 100vw, 33vw"
        unoptimized
      />
      <div className="destination-overlay" />
      <button
        className={`save-destination ${savedDestinations.includes(destination.name) ? "is-saved" : ""}`}
        type="button"
        aria-label={`${savedDestinations.includes(destination.name) ? "Remove" : "Save"} ${destination.name}`}
        onClick={() => toggleSaved(destination.name)}
      >
        <Heart
          size={17}
          fill={savedDestinations.includes(destination.name) ? "currentColor" : "none"}
        />
      </button>
      <div className="destination-info">
        <span className="destination-country">{destination.country}</span>
        <h3>{destination.name}</h3>
        <p>{destination.description}</p>
        <div className="destination-bottom">
          <span>{destination.price} <small>/ person</small></span>
          <button
            type="button"
            aria-label={`Explore ${destination.name}`}
            onClick={() => scrollToTripPlanner(destination.name)}
          >
            <ArrowRight size={17} />
          </button>
        </div>
      </div>
    </article>
  );
}