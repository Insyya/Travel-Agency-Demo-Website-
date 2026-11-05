"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpDown,
  BadgeCheck,
  CarFront,
  Check,
  ChevronDown,
  CircleHelp,
  Clock3,
  FileCheck2,
  Globe2,
  Hotel,
  MapPin,
  Menu,
  Plane,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Star,
  Users,
  X,
} from "lucide-react";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  CarOption,
  destinations,
  FlightOption,
  flightOptions,
  hotelOptions,
  HotelOption,
  ServiceKey,
  serviceMeta,
  visaOptions,
  VisaOption,
  carOptions,
} from "@/lib/travel-data";

type SearchValues = Record<string, string>;
type SelectedOption = VisaOption | FlightOption | HotelOption | CarOption;
type ModalStep = "details" | "form" | "review" | "confirmation";

const serviceLinks: { key: ServiceKey; label: string; icon: typeof Plane }[] = [
  { key: "visa", label: "Visa help", icon: Globe2 },
  { key: "flights", label: "Flights", icon: Plane },
  { key: "hotels", label: "Stays", icon: Hotel },
  { key: "cars", label: "Cars", icon: CarFront },
];

const fieldClass = "experience-field";

function InputField({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder,
  required = false,
  min,
  options,
}: {
  label: string;
  name: string;
  value?: string;
  onChange?: (name: string, value: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
  min?: string;
  options?: string[];
}) {
  return (
    <label className={fieldClass}>
      <span>{label}</span>
      {options ? (
        <select name={name} value={value} onChange={(event) => onChange?.(name, event.target.value)} required={required}>
          {options.map((option) => <option value={option} key={option}>{option || "Choose an option"}</option>)}
        </select>
      ) : (
        <input
          name={name}
          type={type}
          {...(value === undefined ? {} : { value })}
          onChange={(event) => onChange?.(name, event.target.value)}
          placeholder={placeholder}
          required={required}
          min={min}
        />
      )}
    </label>
  );
}

function ServiceHeader({ current }: { current: ServiceKey }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <header className="experience-header">
      <div className="experience-nav">
        <Link className="brand" href="/" aria-label="Voyago home">
          <span className="brand-mark"><Globe2 size={20} /></span>
          <span>voyago<span className="brand-dot">.</span></span>
        </Link>
        <button className="experience-menu-button" type="button" aria-label="Toggle services menu" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
        <nav className={menuOpen ? "experience-links is-open" : "experience-links"} aria-label="Travel services">
          {serviceLinks.map(({ key, label }) => (
            <Link href={`/${key}`} key={key} className={current === key ? "active" : ""} onClick={() => setMenuOpen(false)}>{label}</Link>
          ))}
          <Link className="experience-nav-cta" href="/#trip-planner">Plan a complete trip <ArrowRight size={14} /></Link>
        </nav>
      </div>
    </header>
  );
}

function ResultImage({ src, alt }: { src: string; alt: string }) {
  return <div className="experience-result-image"><Image src={src} alt={alt} fill sizes="(max-width: 700px) 100vw, 260px" unoptimized /></div>;
}

function DetailDialog({
  service,
  selection,
  step,
  setStep,
  close,
  roomIndex,
  setRoomIndex,
  checkedDocs,
  toggleDoc,
  nights,
  days,
  searchValues,
  applicants,
}: {
  service: ServiceKey;
  selection: SelectedOption;
  step: ModalStep;
  setStep: (step: ModalStep) => void;
  close: () => void;
  roomIndex: number;
  setRoomIndex: (index: number) => void;
  checkedDocs: string[];
  toggleDoc: (doc: string) => void;
  nights: number;
  days: number;
  searchValues: SearchValues;
  applicants: string;
}) {
  const isVisa = service === "visa";
  const isFlight = service === "flights";
  const isHotel = service === "hotels";
  const visa = selection as VisaOption;
  const flight = selection as FlightOption;
  const hotel = selection as HotelOption;
  const car = selection as CarOption;
  const [reviewFields, setReviewFields] = useState<[string, string][]>([]);
  const [applicantValues, setApplicantValues] = useState({
    nationality: searchValues.nationality ?? "",
    destination: searchValues.destination ?? (isVisa ? visa.region : ""),
    visaType: isVisa ? visa.category : "Tourist",
  });
  const modalRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !modalRef.current) return;
    const context = gsap.context(() => {
      gsap.fromTo(modalRef.current, { y: 18, opacity: 0, scale: 0.985 }, { y: 0, opacity: 1, scale: 1, duration: 0.3, ease: "power3.out" });
    });
    return () => context.revert();
  }, [step]);
  function submitDetails(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setReviewFields(Array.from(formData.entries())
      .filter(([, value]) => String(value).trim())
      .map(([name, value]) => [name.replace(/([A-Z])/g, " $1").replace(/^./, (letter) => letter.toUpperCase()), String(value)] as [string, string]));
    setStep("review");
  }

  function modalTitle() {
    if (isVisa) return visa.country;
    if (isFlight) return `${flight.airline} · ${flight.fromCode} to ${flight.toCode}`;
    if (isHotel) return hotel.name;
    return car.name;
  }

  const basePrice = isVisa ? visa.fee * Number.parseInt(applicants, 10) : isFlight ? flight.price * Number.parseInt(searchValues.adults || "1", 10) : isHotel ? hotel.rooms[roomIndex].price * nights * Number.parseInt(searchValues.rooms || "1", 10) : car.price * days;
  const estimatedFees = isHotel || service === "cars" ? Math.round(basePrice * 0.12) : 0;
  const price = basePrice + estimatedFees;

  return (
    <div className="experience-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) close(); }}>
      <section ref={modalRef} className="experience-modal" role="dialog" aria-modal="true" aria-labelledby="experience-modal-title">
        <button className="experience-modal-close" type="button" aria-label="Close dialog" onClick={close}><X size={19} /></button>
        {step === "confirmation" ? (
          <div className="confirmation-view">
            <div className="confirmation-check"><Check size={27} /></div>
            <span className="experience-eyebrow">ALL SET FOR THE NEXT STEP</span>
            <h2 id="experience-modal-title">{isVisa ? "Your request is ready." : "Your trip is taking shape."}</h2>
            <p>{isVisa ? "Your sample visa assistance request has been saved in this demo." : "Your sample selection has been saved in this demo."} No real booking, ticket, or application has been created.</p>
            <div className="confirmation-summary"><strong>{modalTitle()}</strong><span>Estimated total <b>${price.toLocaleString()}</b></span></div>
            <button type="button" className="experience-button experience-button-primary" onClick={close}>Back to options <ArrowRight size={16} /></button>
          </div>
        ) : step === "review" ? (
          <div>
            <span className="experience-eyebrow">PLEASE CHECK BEFORE YOU CONTINUE</span>
            <h2 id="experience-modal-title">Your demo summary.</h2>
            <p className="experience-modal-subtitle">A final look at the details you entered. This remains a simulation; no real reservation is created.</p>
            <div className="booking-mini-summary"><span>{modalTitle()}</span><strong>Estimated ${price.toLocaleString()}</strong></div>
            <div className="review-detail-list">{reviewFields.map(([label, value]) => <div key={`${label}-${value}`}><span>{label}</span><strong>{value}</strong></div>)}</div>
            <div className="experience-modal-actions"><button type="button" className="experience-button experience-button-outline" onClick={() => setStep("form")}>Edit details</button><button type="button" className="experience-button experience-button-primary" onClick={() => setStep("confirmation")}>Confirm demo request <Check size={15} /></button></div>
          </div>
        ) : step === "form" ? (
          <div>
            <span className="experience-eyebrow">{isVisa ? "REQUEST EXPERT GUIDANCE" : isFlight ? "PASSENGER DETAILS" : isHotel ? "GUEST DETAILS" : "RENTER DETAILS"}</span>
            <h2 id="experience-modal-title">{isVisa ? "Let’s get to know you." : "One step closer."}</h2>
            <p className="experience-modal-subtitle">This is a local demo form. Your information is not sent or stored.</p>
            <div className="booking-mini-summary"><span>{modalTitle()}</span><strong>Estimated ${price.toLocaleString()}</strong></div>
            <form className="experience-details-form" onSubmit={submitDetails}>
              {isFlight && <div className="experience-form-grid"><InputField label="First name" name="firstName" placeholder="As on passport" required /><InputField label="Last name" name="lastName" placeholder="Family name" required /></div>}
              {!isFlight && <InputField label="Full name" name="fullName" placeholder="Your name" required />}
              <InputField label="Email address" name="email" type="email" placeholder="you@example.com" required />
              <InputField label="Phone number" name="phone" type="tel" placeholder="+1 (555) 000-0000" required />
              {isFlight && <div className="experience-form-grid"><InputField label="Date of birth" name="dob" type="date" required /><InputField label="Passport number (optional)" name="passport" placeholder="Passport number" /></div>}
              {isVisa && <div className="experience-form-grid">
                <InputField label="Nationality" name="nationality" value={applicantValues.nationality} onChange={(name, value) => setApplicantValues((current) => ({ ...current, [name]: value }))} placeholder="Your nationality" required />
                <InputField label="Destination" name="destination" value={applicantValues.destination} onChange={(name, value) => setApplicantValues((current) => ({ ...current, [name]: value }))} placeholder="Destination" required />
              </div>}
              {isVisa && <InputField label="Visa type" name="visaType" value={applicantValues.visaType} onChange={(name, value) => setApplicantValues((current) => ({ ...current, [name]: value }))} options={["Tourist", "Business", "Student", "Transit"]} required />}
              {isFlight && <p className="booking-note">Itinerary: {flight.from} to {flight.to} · {searchValues.departure || "Date to be confirmed"}{searchValues.return ? ` to ${searchValues.return}` : " · One way"} · {searchValues.adults || "1"} adult passenger(s)</p>}
              {isHotel && <p className="booking-note">{hotel.city} · {searchValues.checkin || "Check-in date to be confirmed"} to {searchValues.checkout || "Check-out date to be confirmed"} · {nights} night{nights === 1 ? "" : "s"} · {searchValues.guests || "2"} guest(s) · {searchValues.rooms || "1"} room(s) · {hotel.rooms[roomIndex].name}</p>}
              {service === "cars" && <>
                <p className="booking-note">{searchValues.pickup || car.location} to {searchValues.dropoff || searchValues.pickup || car.location} · {searchValues.pickupDate || "Pick-up date to be confirmed"} at {searchValues.pickupTime || "10:00"} to {searchValues.returnDate || "Return date to be confirmed"} at {searchValues.returnTime || "10:00"} · {days} rental day(s)</p>
                <InputField label="Driving license number (optional)" name="license" placeholder="License number" />
              </>}
              <label className="experience-disclaimer-check"><input type="checkbox" required /> I understand this is a simulated request with no real booking or payment.</label>
              <button type="submit" className="experience-button experience-button-primary">{isVisa ? "Request assistance" : "Review demo booking"} <ArrowRight size={16} /></button>
            </form>
          </div>
        ) : (
          <div>
            <span className="experience-eyebrow">{isVisa ? "SAMPLE ENTRY INFORMATION" : isFlight ? "YOUR FLIGHT AT A GLANCE" : isHotel ? "A CLOSER LOOK" : "VEHICLE DETAILS"}</span>
            <h2 id="experience-modal-title">{modalTitle()}</h2>
            {isVisa && (
              <>
                <p className="experience-modal-subtitle">{visa.flag} {visa.category} visa · {visa.entry}</p>
                <p>{visa.eligibility}</p>
                <h3 className="modal-section-title">Document checklist <small>{checkedDocs.filter((doc) => visa.documents.includes(doc)).length}/{visa.documents.length} ready</small></h3>
                <div className="document-list">{visa.documents.map((doc) => <label key={doc}><input type="checkbox" checked={checkedDocs.includes(doc)} onChange={() => toggleDoc(doc)} /><span>{doc}</span></label>)}</div>
                <div className="visa-steps"><span><b>01</b> Check eligibility</span><span><b>02</b> Prepare documents</span><span><b>03</b> Submit application</span></div>
                <p className="booking-note"><Clock3 size={14} /> Typical processing: {visa.processing}. {visa.notes}</p>
              </>
            )}
            {isFlight && (
              <>
                <div className="itinerary-row"><div><small>{flight.from}</small><strong>{flight.depart}</strong><b>{flight.fromCode}</b></div><div className="itinerary-path"><span>{flight.duration}</span><i /><small>{flight.stops ? `${flight.stops} stop` : "Nonstop"}</small></div><div><small>{flight.to}</small><strong>{flight.arrive}</strong><b>{flight.toCode}</b></div></div>
                <ul className="detail-bullets"><li><Check size={15} /> 1 cabin bag and 1 checked bag included (sample)</li><li><Check size={15} /> Standard seat selection (sample fare)</li><li><Check size={15} /> Changes subject to sample fare conditions</li></ul>
              </>
            )}
            {isHotel && (
              <>
                <ResultImage src={hotel.image} alt={hotel.name} />
                <p>{hotel.description}</p>
                <div className="detail-tags">{hotel.amenities.map((amenity) => <span key={amenity}>{amenity}</span>)}</div>
                <p className="sample-guest-review"><Star size={14} fill="currentColor" /> Guest score {hotel.score.toFixed(1)}/10 · “A lovely base for exploring, with thoughtful service and a great location.”</p>
                <label className="experience-field room-select"><span>Choose your room</span><select value={roomIndex} onChange={(event) => setRoomIndex(Number(event.target.value))}>{hotel.rooms.map((room, index) => <option value={index} key={room.name}>{room.name} · ${room.price}/night</option>)}</select></label>
                <p className="booking-note">Check-in after 3:00 PM · Check-out before 11:00 AM · {hotel.freeCancellation ? "Free cancellation available (sample)" : "Cancellation terms may apply (sample)"}</p>
              </>
            )}
            {service === "cars" && (
              <>
                <ResultImage src={car.image} alt={car.name} />
                <div className="detail-tags"><span>{car.category}</span><span>{car.transmission}</span><span>{car.passengers} seats</span><span>{car.fuel}</span></div>
                <ul className="detail-bullets"><li><Check size={15} /> Unlimited mileage (sample offer)</li><li><Check size={15} /> Full-to-full fuel policy</li><li><Check size={15} /> Standard protection included</li><li><Check size={15} /> Sample refundable security deposit: $500</li><li><Check size={15} /> {car.luggage} medium suitcases</li></ul>
              </>
            )}
            {isVisa && <p className="official-disclaimer"><CircleHelp size={15} /> Sample information only—not official immigration advice. Confirm current requirements, fees, and processing times with the relevant embassy or immigration authority.</p>}
            <div className="booking-breakdown">
              <span>{isVisa ? "Sample application fee" : isFlight ? "Sample base fare" : isHotel ? `Room estimate · ${nights} nights` : `Rental estimate · ${days} days`} <b>${basePrice.toLocaleString()}</b></span>
              {(isHotel || service === "cars") && <span>Estimated taxes & fees <b>${estimatedFees.toLocaleString()}</b></span>}
              {isFlight && <span>Sample taxes & carrier charges <b>Included</b></span>}
              <span className="detail-total"><span>Estimated total</span><strong>${price.toLocaleString()}</strong></span>
            </div>
            <button type="button" className="experience-button experience-button-primary experience-button-wide" onClick={() => setStep("form")}>{isVisa ? "Request visa assistance" : "Continue"} <ArrowRight size={16} /></button>
          </div>
        )}
      </section>
    </div>
  );
}

export default function ServiceExperience({ service, initialDestination = "" }: { service: ServiceKey; initialDestination?: string }) {
  const meta = serviceMeta[service];
  const [values, setValues] = useState<SearchValues>((): SearchValues => {
    if (!initialDestination) return {};
    return {
      destination: initialDestination,
      to: initialDestination,
      pickup: initialDestination,
    };
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sortBy, setSortBy] = useState("Recommended");
  const [maxPrice, setMaxPrice] = useState(service === "cars" ? 300 : service === "hotels" ? 800 : 5000);
  const [stopsFilter, setStopsFilter] = useState("Any stops");
  const [airlineFilter, setAirlineFilter] = useState("");
  const [departPeriod, setDepartPeriod] = useState("Any time");
  const [arrivePeriod, setArrivePeriod] = useState("Any time");
  const [starFilter, setStarFilter] = useState(0);
  const [minimumScore, setMinimumScore] = useState(0);
  const [propertyFilter, setPropertyFilter] = useState("Any property");
  const [amenityFilter, setAmenityFilter] = useState("");
  const [freeCancelOnly, setFreeCancelOnly] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("Any category");
  const [transmissionFilter, setTransmissionFilter] = useState("Any");
  const [fuelFilter, setFuelFilter] = useState("Any");
  const [passengerFilter, setPassengerFilter] = useState(0);
  const [selection, setSelection] = useState<SelectedOption | null>(null);
  const [modalStep, setModalStep] = useState<ModalStep>("details");
  const [roomIndex, setRoomIndex] = useState(0);
  const [checkedDocs, setCheckedDocs] = useState<string[]>([]);
  const [isRoundTrip, setIsRoundTrip] = useState(true);
  const [differentDropoff, setDifferentDropoff] = useState(false);
  const [travellerCount, setTravellerCount] = useState("1");
  const [roomCount, setRoomCount] = useState("1");
  const resultRef = useRef<HTMLDivElement>(null);
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    const context = gsap.context(() => {
      const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
      intro
        .fromTo(".experience-hero-backdrop", { scale: 1.12 }, { scale: 1, duration: 1.6, ease: "power2.out" })
        .fromTo(".experience-hero-copy > *", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.75, stagger: 0.13 }, 0.25)
        .fromTo(".experience-search-card", { y: 55, opacity: 0, scale: 0.98 }, { y: 0, opacity: 1, scale: 1, duration: 0.8 }, 0.7);
      gsap.utils.toArray<HTMLElement>(".experience-scroll-reveal").forEach((element) => {
        gsap.fromTo(element, { y: 36, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: "power2.out", scrollTrigger: { trigger: element, start: "top 88%", once: true } });
      });
    });
    return () => {
      if (searchTimer.current) clearTimeout(searchTimer.current);
      context.revert();
    };
  }, []);

  useEffect(() => {
    if (!submitted || loading || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const resultCards = resultRef.current?.querySelectorAll<HTMLElement>(".service-result-card");
    if (!resultCards?.length) return;
    const context = gsap.context(() => {
      gsap.fromTo(resultCards, { y: 26, opacity: 0, scale: 0.985 }, { y: 0, opacity: 1, scale: 1, duration: 0.5, stagger: 0.09, ease: "power2.out" });
    }, resultRef);
    return () => context.revert();
  }, [submitted, loading, service]);

  useEffect(() => {
    if (loading || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const cleanups: (() => void)[] = [];
    gsap.utils.toArray<HTMLElement>(".service-result-card, .experience-button").forEach((element) => {
      const onEnter = () => gsap.to(element, { y: -3, duration: 0.22, ease: "power2.out", overwrite: "auto" });
      const onLeave = () => gsap.to(element, { y: 0, duration: 0.3, ease: "power2.out", overwrite: "auto" });
      element.addEventListener("mouseenter", onEnter);
      element.addEventListener("mouseleave", onLeave);
      cleanups.push(() => {
        element.removeEventListener("mouseenter", onEnter);
        element.removeEventListener("mouseleave", onLeave);
      });
    });
    return () => cleanups.forEach((cleanup) => cleanup());
  });

  function updateValue(name: string, value: string) {
    setValues((current) => ({ ...current, [name]: value }));
  }

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const startName = service === "hotels" ? "checkin" : service === "cars" ? "pickupDate" : "departure";
    const endName = service === "hotels" ? "checkout" : service === "cars" ? "returnDate" : "return";
    const startDate = String(formData.get(startName) ?? "");
    const endDate = String(formData.get(endName) ?? "");
    const today = new Date(Date.now());
    today.setHours(0, 0, 0, 0);
    const todayISO = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
    if (startDate && startDate < todayISO) {
      setSearchError("Choose a date that is today or later.");
      return;
    }
    if (service !== "visa" && endDate && startDate && endDate < startDate) {
      setSearchError("Your return date should be after your departure date.");
      return;
    }
    setSearchError("");
    const formEntries = Object.fromEntries(
      Array.from(formData.entries(), ([name, value]) => [name, String(value)]),
    );
    setValues((current) => ({ ...current, ...formEntries }));
    if (service === "visa") updateValue("category", String(formData.get("category") ?? "Tourist"));
    if (service === "flights") {
      updateValue("from", String(formData.get("from") ?? ""));
      updateValue("to", String(formData.get("to") ?? ""));
      updateValue("cabin", String(formData.get("cabin") ?? "Economy"));
    }
    if (service === "hotels") {
      updateValue("destination", String(formData.get("destination") ?? ""));
      updateValue("checkin", startDate);
      updateValue("checkout", endDate);
    }
    if (service === "cars") {
      updateValue("pickup", String(formData.get("pickup") ?? ""));
      updateValue("dropoff", String(formData.get("dropoff") ?? formData.get("pickup") ?? ""));
      updateValue("pickupDate", startDate);
      updateValue("returnDate", endDate);
    }
    setSubmitted(true);
    setLoading(true);
    setFiltersOpen(false);
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      setLoading(false);
      window.setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
    }, 500);
  }

  const filteredVisas = useMemo(() => {
    const country = (values.destination ?? "").trim().toLowerCase();
    const aliases: Record<string, string[]> = {
      dubai: ["uae"],
      london: ["united kingdom"],
      paris: ["schengen", "france"],
      istanbul: ["turkey"],
      bali: ["indonesia"],
    };
    const terms = [country, ...(aliases[country] ?? [])];
    return visaOptions.filter((option) => !country || terms.some((term) => `${option.country} ${option.region}`.toLowerCase().includes(term)))
      .map((option) => ({ ...option, category: values.category || "Tourist" }));
  }, [values.destination, values.category]);

  const filteredFlights = useMemo(() => {
    const from = (values.from ?? "").trim().toLowerCase();
    const to = (values.to ?? "").trim().toLowerCase();
    const inPeriod = (time: string, period: string) => {
      if (period === "Any time") return true;
      const match = time.match(/^(\d+):/);
      if (!match) return true;
      let hour = Number(match[1]);
      if (time.includes("PM") && hour !== 12) hour += 12;
      if (time.includes("AM") && hour === 12) hour = 0;
      return period === "Morning" ? hour >= 5 && hour < 12 : period === "Afternoon" ? hour >= 12 && hour < 18 : hour >= 18 || hour < 5;
    };
    let list = flightOptions.filter((flight) =>
      (!from || `${flight.from} ${flight.fromCode}`.toLowerCase().includes(from)) &&
      (!to || `${flight.to} ${flight.toCode}`.toLowerCase().includes(to)) &&
      (!values.cabin || flight.cabin === values.cabin) &&
      flight.price <= maxPrice &&
      (stopsFilter === "Any stops" || (stopsFilter === "Nonstop" ? flight.stops === 0 : flight.stops > 0)) &&
      (!airlineFilter || flight.airline === airlineFilter) &&
      inPeriod(flight.depart, departPeriod) &&
      inPeriod(flight.arrive, arrivePeriod),
    );
    if (sortBy === "Cheapest") list = [...list].sort((a, b) => a.price - b.price);
    if (sortBy === "Fastest") list = [...list].sort((a, b) => a.minutes - b.minutes);
    return list;
  }, [values.from, values.to, values.cabin, maxPrice, stopsFilter, airlineFilter, departPeriod, arrivePeriod, sortBy]);

  const filteredHotels = useMemo(() => {
    const destination = (values.destination ?? "").trim().toLowerCase();
    let list = hotelOptions.filter((option) =>
      (!destination || `${option.city} ${option.country}`.toLowerCase().includes(destination) || destination.includes(option.city.toLowerCase())) &&
      option.price <= maxPrice &&
      (!starFilter || option.stars === starFilter) &&
      option.score >= minimumScore &&
      (propertyFilter === "Any property" || option.type === propertyFilter) &&
      (!amenityFilter || option.amenities.includes(amenityFilter)) &&
      (!freeCancelOnly || option.freeCancellation),
    );
    if (sortBy === "Lowest price") list = [...list].sort((a, b) => a.price - b.price);
    if (sortBy === "Highest rating") list = [...list].sort((a, b) => b.score - a.score);
    return list;
  }, [values.destination, maxPrice, starFilter, minimumScore, propertyFilter, amenityFilter, freeCancelOnly, sortBy]);

  const filteredCars = useMemo(() => {
    let list = [...carOptions];
    const pickup = (values.pickup ?? "").trim().toLowerCase();
    list = list.filter((car) =>
      (!pickup || `${car.location} DXB`.toLowerCase().includes(pickup) || pickup.includes(car.location.toLowerCase())) &&
      car.price <= maxPrice &&
      (categoryFilter === "Any category" || car.category === categoryFilter) &&
      (transmissionFilter === "Any" || car.transmission === transmissionFilter) &&
      (fuelFilter === "Any" || car.fuel === fuelFilter) &&
      (!passengerFilter || car.passengers >= passengerFilter),
    );
    if (sortBy === "Lowest price") list.sort((a, b) => a.price - b.price);
    if (sortBy === "Highest price") list.sort((a, b) => b.price - a.price);
    return list;
  }, [values.pickup, categoryFilter, maxPrice, transmissionFilter, fuelFilter, passengerFilter, sortBy]);

  const nights = Math.max(1, Math.ceil((new Date(values.checkout || "2026-12-12").getTime() - new Date(values.checkin || "2026-12-10").getTime()) / 86400000));
  const rentalDays = Math.max(1, Math.ceil((new Date(values.returnDate || "2026-12-12").getTime() - new Date(values.pickupDate || "2026-12-10").getTime()) / 86400000));

  function openSelection(option: SelectedOption) {
    setSelection(option);
    setModalStep("details");
    setRoomIndex(0);
  }

  function closeSelection() {
    setSelection(null);
    setModalStep("details");
  }

  function toggleDocument(document: string) {
    setCheckedDocs((current) => current.includes(document) ? current.filter((entry) => entry !== document) : [...current, document]);
  }

  function swapLocations() {
    setValues((current) => ({ ...current, from: current.to ?? "", to: current.from ?? "" }));
  }

  function changeDestination(destination: string) {
    setValues((current) => ({ ...current, destination, to: destination, pickup: destination }));
  }

  const currentResults: SelectedOption[] = service === "visa" ? filteredVisas : service === "flights" ? filteredFlights : service === "hotels" ? filteredHotels : filteredCars;
  const currentSorts = service === "flights" ? ["Recommended", "Cheapest", "Fastest"] : service === "hotels" ? ["Recommended", "Lowest price", "Highest rating"] : ["Recommended", "Lowest price", "Highest price"];

  return (
    <div className="service-experience">
      <ServiceHeader current={service} />
      <main>
        <section className="experience-hero">
          <div className="experience-hero-backdrop" style={{ backgroundImage: `url("${meta.image}")` }} />
          <div className="experience-hero-overlay" />
          <div className="experience-width experience-hero-content">
            <div className="experience-hero-copy">
              <Link className="experience-back-link" href="/"><ArrowLeft size={14} /> Back to Voyago</Link>
              <span className="experience-eyebrow"><span>{meta.icon}</span> {meta.eyebrow}</span>
              <h1>{meta.title}</h1>
              <p>{meta.description}</p>
              <div className="experience-trust"><ShieldCheck size={16} /> Thoughtful help, every step of the way</div>
            </div>
            <div className="experience-hero-mark" aria-hidden="true">{meta.icon}</div>
          </div>
        </section>

        <section className="experience-search-wrap experience-width" aria-label={`${service} search`}>
          <div className="experience-search-card">
            <div className="service-switcher" aria-label="Choose a service">
              {serviceLinks.map(({ key, label, icon: Icon }) => <Link key={key} href={`/${key}`} className={key === service ? "selected" : ""}><Icon size={16} />{label}</Link>)}
            </div>
            <div className="experience-search-heading"><div><span className="experience-eyebrow">YOUR NEXT STEP</span><h2>{service === "visa" ? "Where are you headed?" : service === "flights" ? "Find a flight that feels right." : service === "hotels" ? "Find somewhere lovely to stay." : "Pick a ride for the road ahead."}</h2></div><span className="search-secure-note"><ShieldCheck size={15} /> Free to explore</span></div>
            {service === "flights" && <div className="trip-type-switch"><button type="button" className={isRoundTrip ? "active" : ""} onClick={() => setIsRoundTrip(true)}>Round trip</button><button type="button" className={!isRoundTrip ? "active" : ""} onClick={() => setIsRoundTrip(false)}>One way</button></div>}
            {service === "cars" && <label className="different-dropoff"><input type="checkbox" checked={differentDropoff} onChange={(event) => setDifferentDropoff(event.target.checked)} /> Return to a different location</label>}
            <form className="experience-search-form" onSubmit={submitSearch}>
              {service === "visa" && <>
                <InputField label="Your nationality" name="nationality" value={values.nationality ?? ""} onChange={updateValue} placeholder="e.g. Canadian" required />
                <InputField label="Destination country" name="destination" value={values.destination ?? ""} onChange={updateValue} placeholder="Choose a country" options={["", ...destinations]} required />
                <InputField label="Visa category" name="category" value={values.category ?? "Tourist"} onChange={updateValue} options={["Tourist", "Business", "Student", "Transit"]} required />
                <InputField label="Intended travel date" name="travelDate" type="date" value={values.travelDate ?? ""} onChange={updateValue} required />
                <InputField label="Applicants" name="applicants" value={values.applicants ?? "1"} onChange={updateValue} options={["1", "2", "3", "4", "5+"]} />
              </>}
              {service === "flights" && <>
                <div className="flight-locations"><InputField label="From" name="from" value={values.from ?? ""} onChange={updateValue} placeholder="City or airport" required /><button className="swap-locations" type="button" title="Swap locations" aria-label="Swap departure and destination" onClick={swapLocations}><ArrowUpDown size={16} /></button><InputField label="To" name="to" value={values.to ?? ""} onChange={updateValue} placeholder="City or airport" required /></div>
                <InputField label="Departure" name="departure" type="date" value={values.departure ?? ""} onChange={updateValue} required />
                {isRoundTrip && <InputField label="Return" name="return" type="date" value={values.return ?? ""} onChange={updateValue} min={values.departure} required />}
                <InputField label="Adults" name="adults" value={travellerCount} onChange={(_, value) => setTravellerCount(value)} options={["1", "2", "3", "4", "5", "6"]} />
                <InputField label="Children" name="children" value={values.children ?? "0"} onChange={updateValue} options={["0", "1", "2", "3", "4"]} />
                <InputField label="Infants" name="infants" value={values.infants ?? "0"} onChange={updateValue} options={["0", "1", "2", "3"]} />
                <InputField label="Cabin class" name="cabin" value={values.cabin ?? "Economy"} onChange={updateValue} options={["Economy", "Premium Economy", "Business", "First Class"]} />
              </>}
              {service === "hotels" && <>
                <InputField label="Destination" name="destination" value={values.destination ?? ""} onChange={updateValue} placeholder="City, hotel or landmark" required />
                <InputField label="Check-in" name="checkin" type="date" value={values.checkin ?? ""} onChange={updateValue} required />
                <InputField label="Check-out" name="checkout" type="date" value={values.checkout ?? ""} onChange={updateValue} min={values.checkin} required />
                <InputField label="Guests" name="guests" value={travellerCount} onChange={(_, value) => setTravellerCount(value)} options={["1", "2", "3", "4", "5", "6"]} />
                <InputField label="Rooms" name="rooms" value={roomCount} onChange={(_, value) => setRoomCount(value)} options={["1", "2", "3", "4"]} />
              </>}
              {service === "cars" && <>
                <InputField label="Pick-up location" name="pickup" value={values.pickup ?? ""} onChange={updateValue} placeholder="City or airport" required />
                {differentDropoff && <InputField label="Drop-off location" name="dropoff" value={values.dropoff ?? ""} onChange={updateValue} placeholder="Drop-off city" required />}
                <InputField label="Pick-up date" name="pickupDate" type="date" value={values.pickupDate ?? ""} onChange={updateValue} required />
                <InputField label="Pick-up time" name="pickupTime" type="time" value={values.pickupTime ?? "10:00"} onChange={updateValue} required />
                <InputField label="Return date" name="returnDate" type="date" value={values.returnDate ?? ""} onChange={updateValue} min={values.pickupDate} required />
                <InputField label="Return time" name="returnTime" type="time" value={values.returnTime ?? "10:00"} onChange={updateValue} required />
                <InputField label="Car category" name="category" value={categoryFilter} onChange={(_, value) => setCategoryFilter(value)} options={["Any category", "Economy", "Sedan", "SUV", "Luxury", "Sports", "Electric"]} />
              </>}
              <button className="experience-button experience-button-primary experience-submit" type="submit" disabled={loading}>{loading ? <span className="experience-spinner" /> : <Search size={16} />}{loading ? "Finding options" : `Search ${service === "visa" ? "visas" : service}`}</button>
            </form>
            {searchError && <p className="experience-error" role="alert">{searchError}</p>}
          </div>
        </section>

        {submitted && (
          <section className="experience-results-section experience-width" ref={resultRef}>
            <div className="experience-results-heading">
              <div><span className="experience-eyebrow">OPTIONS FOR YOUR JOURNEY</span><h2>{service === "visa" ? "Visa information to get you started" : service === "flights" ? "Flights worth looking forward to" : service === "hotels" ? "Stays with a little something extra" : "A good ride for the road ahead"}</h2><p>{loading ? "Searching our sample collection..." : `${currentResults.length} sample ${service === "visa" ? "visa options" : service === "flights" ? "flight options" : service === "hotels" ? "places to stay" : "vehicles"}${values.destination || values.to ? ` for ${values.destination || values.to}` : ""}`}</p></div>
              <button className="filter-toggle" type="button" aria-expanded={filtersOpen} onClick={() => setFiltersOpen(!filtersOpen)}><SlidersHorizontal size={16} /> Filters <ChevronDown size={15} /></button>
            </div>
            {!loading && (
              <div className="experience-result-layout">
                <aside className={`experience-filters ${filtersOpen ? "filters-open" : ""}`}>
                  <div className="filter-title"><strong>Refine your options</strong><button type="button" aria-label="Close filters" onClick={() => setFiltersOpen(false)}><X size={17} /></button></div>
                  {service === "flights" && <>
                    <label className="filter-group"><span>Max ticket price <b>${maxPrice}</b></span><input type="range" min="300" max="5000" step="50" value={maxPrice} onChange={(event) => setMaxPrice(Number(event.target.value))} /></label>
                    <FilterSelect title="Stops" value={stopsFilter} values={["Any stops", "Nonstop", "1+ stops"]} onChange={setStopsFilter} />
                    <FilterSelect title="Airline" value={airlineFilter || "All airlines"} values={["All airlines", ...Array.from(new Set(flightOptions.map((flight) => flight.airline)))]} onChange={(value) => setAirlineFilter(value === "All airlines" ? "" : value)} />
                    <FilterSelect title="Departure time" value={departPeriod} values={["Any time", "Morning", "Afternoon", "Evening"]} onChange={setDepartPeriod} />
                    <FilterSelect title="Arrival time" value={arrivePeriod} values={["Any time", "Morning", "Afternoon", "Evening"]} onChange={setArrivePeriod} />
                  </>}
                  {service === "hotels" && <>
                    <label className="filter-group"><span>Max price per night <b>${maxPrice}</b></span><input type="range" min="80" max="800" step="10" value={maxPrice} onChange={(event) => setMaxPrice(Number(event.target.value))} /></label>
                    <FilterSelect title="Star rating" value={starFilter ? `${starFilter} stars` : "Any rating"} values={["Any rating", "3 stars", "4 stars", "5 stars"]} onChange={(value) => setStarFilter(value === "Any rating" ? 0 : Number(value[0]))} />
                    <FilterSelect title="Guest rating" value={minimumScore ? `${minimumScore}+` : "Any score"} values={["Any score", "8+", "9+", "9.5+"]} onChange={(value) => setMinimumScore(value === "Any score" ? 0 : Number(value.replace("+", "")))} />
                    <FilterSelect title="Property type" value={propertyFilter} values={["Any property", "Hotel", "Boutique", "Resort"]} onChange={setPropertyFilter} />
                    <FilterSelect title="Amenity" value={amenityFilter || "Any amenity"} values={["Any amenity", "Pool", "Spa", "Breakfast", "Free Wi-Fi", "Beach", "Gym"]} onChange={(value) => setAmenityFilter(value === "Any amenity" ? "" : value)} />
                    <label className="filter-checkbox"><input type="checkbox" checked={freeCancelOnly} onChange={(event) => setFreeCancelOnly(event.target.checked)} /> Free cancellation</label>
                  </>}
                  {service === "cars" && <>
                    <label className="filter-group"><span>Max price per day <b>${maxPrice}</b></span><input type="range" min="30" max="300" step="5" value={maxPrice} onChange={(event) => setMaxPrice(Number(event.target.value))} /></label>
                    <FilterSelect title="Category" value={categoryFilter} values={["Any category", "Economy", "Sedan", "SUV", "Luxury", "Electric"]} onChange={setCategoryFilter} />
                    <FilterSelect title="Transmission" value={transmissionFilter} values={["Any", "Automatic", "Manual"]} onChange={setTransmissionFilter} />
                    <FilterSelect title="Fuel type" value={fuelFilter} values={["Any", "Petrol", "Hybrid", "Electric"]} onChange={setFuelFilter} />
                    <FilterSelect title="Passengers" value={passengerFilter ? `${passengerFilter}+ seats` : "Any capacity"} values={["Any capacity", "2+ seats", "4+ seats", "5+ seats"]} onChange={(value) => setPassengerFilter(value === "Any capacity" ? 0 : Number(value[0]))} />
                  </>}
                  <button className="clear-filters" type="button" onClick={() => { setMaxPrice(service === "cars" ? 300 : service === "hotels" ? 800 : 5000); setStopsFilter("Any stops"); setAirlineFilter(""); setDepartPeriod("Any time"); setArrivePeriod("Any time"); setStarFilter(0); setMinimumScore(0); setPropertyFilter("Any property"); setAmenityFilter(""); setFreeCancelOnly(false); setCategoryFilter("Any category"); setTransmissionFilter("Any"); setFuelFilter("Any"); setPassengerFilter(0); }}>Reset filters</button>
                </aside>
                <div className="experience-result-list">
                  <div className="sort-row"><span>{currentResults.length} options</span><label>Sort by <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>{currentSorts.map((sort) => <option key={sort}>{sort}</option>)}</select></label></div>
                  {currentResults.length ? currentResults.map((option, index) => (
                  <ResultCard key={service === "flights" ? (option as FlightOption).id : service === "hotels" ? (option as HotelOption).name : service === "cars" ? (option as CarOption).name : (option as VisaOption).country} service={service} option={option} index={index} nights={nights} days={rentalDays} onSelect={() => openSelection(option)} />
                  )) : <div className="no-results"><Search size={23} /><h3>No matching options yet</h3><p>Try a nearby destination or relax a filter to see more sample options.</p></div>}
                  <p className="sample-note"><ShieldCheck size={13} /> Prices and information are samples for this frontend demo only.</p>
                </div>
              </div>
            )}
            {loading && <div className="loading-options"><span className="experience-spinner" />Finding thoughtful options for you...</div>}
          </section>
        )}

        {submitted && service === "visa" && <p className="official-disclaimer experience-disclaimer experience-width"><CircleHelp size={16} /> Visa requirements, fees, and processing times shown here are illustrative samples—not official immigration advice. Confirm all details with the relevant embassy or authority.</p>}

        <section className="experience-destination-band experience-width experience-scroll-reveal">
          <div><span className="experience-eyebrow">NOT SURE WHERE TO START?</span><h2>One destination. All the pieces.</h2><p>Pick somewhere and we’ll help you explore the rest of the trip.</p></div>
          <label className="experience-field"><span>I&apos;m dreaming of</span><select value={values.destination ?? ""} onChange={(event) => changeDestination(event.target.value)}><option value="">Choose a destination</option>{destinations.map((destination) => <option key={destination}>{destination}</option>)}</select></label>
          <div className="destination-shortcuts">{serviceLinks.map(({ key, label, icon: Icon }) => <Link href={`/${key}?destination=${encodeURIComponent(values.destination || "Dubai")}`} key={key}><Icon size={15} /> Explore {label} <ArrowRight size={14} /></Link>)}</div>
        </section>
        <section className="experience-footnote experience-width"><FileCheck2 size={17} /><p>Everything on this page is a frontend-only demonstration using local sample data. No booking, ticket, payment, visa application, or reservation is submitted.</p></section>
      </main>
      <footer className="experience-footer"><div className="experience-width"><Link className="brand" href="/"><span className="brand-mark"><Globe2 size={19} /></span><span>voyago<span className="brand-dot">.</span></span></Link><span>See you out there. © 2026 Voyago Travel Co.</span><Link href="/">Back to homepage <ArrowRight size={14} /></Link></div></footer>
      {selection && <DetailDialog service={service} selection={selection} step={modalStep} setStep={setModalStep} close={closeSelection} roomIndex={roomIndex} setRoomIndex={setRoomIndex} checkedDocs={checkedDocs} toggleDoc={toggleDocument} nights={nights} days={rentalDays} searchValues={values} applicants={values.applicants ?? "1"} />}
    </div>
  );
}

function FilterSelect({ title, value, values, onChange }: { title: string; value: string; values: string[]; onChange: (value: string) => void }) {
  return <label className="filter-select"><span>{title}</span><select value={value} onChange={(event) => onChange(event.target.value)}>{values.map((option) => <option key={option}>{option}</option>)}</select></label>;
}

function ResultCard({ service, option, index, nights, days, onSelect }: { service: ServiceKey; option: SelectedOption; index: number; nights: number; days: number; onSelect: () => void }) {
  if (service === "visa") {
    const visa = option as VisaOption;
    return <article className="service-result-card visa-result-card"><div className="visa-flag">{visa.flag}</div><div className="service-result-main"><span className="result-index">0{index + 1} · {visa.category} VISA</span><h3>{visa.country}</h3><p>{visa.entry}</p><div className="result-facts"><span><Clock3 size={14} /> {visa.processing}</span><span><FileCheck2 size={14} /> {visa.documents.length} key documents</span></div></div><div className="service-result-price"><span>Sample fee from</span><strong>${visa.fee}</strong><button className="experience-button experience-button-outline" type="button" onClick={onSelect}>View details <ArrowRight size={14} /></button></div></article>;
  }
  if (service === "flights") {
    const flight = option as FlightOption;
    return <article className="service-result-card flight-result-card"><div className="airline-initials">{flight.initials}</div><div className="flight-times"><div><strong>{flight.depart}</strong><span>{flight.fromCode}</span><small>{flight.from}</small></div><div className="flight-duration"><span>{flight.duration}</span><i /><small>{flight.stops ? `${flight.stops} stop${flight.stops > 1 ? "s" : ""}` : "Nonstop"}</small></div><div><strong>{flight.arrive}</strong><span>{flight.toCode}</span><small>{flight.to}</small></div></div><div className="flight-airline"><b>{flight.airline}</b><span>{flight.cabin} · {flight.stops ? "1 connection" : "Direct"}</span><small>Departures around {flight.depart}</small></div><div className="service-result-price"><span>Per person · sample</span><strong>${flight.price}</strong><button className="experience-button experience-button-outline" type="button" onClick={onSelect}>Select flight <ArrowRight size={14} /></button></div></article>;
  }
  if (service === "hotels") {
    const hotel = option as HotelOption;
    return <article className="service-result-card hotel-result-card"><ResultImage src={hotel.image} alt={`${hotel.name}, ${hotel.city}`} /><div className="service-result-main"><span className="result-index">{hotel.type.toUpperCase()} · {"★".repeat(hotel.stars)}</span><h3>{hotel.name}</h3><p><MapPin size={13} /> {hotel.city}, {hotel.country}</p><p className="hotel-description">{hotel.description}</p><div className="detail-tags">{hotel.amenities.slice(0, 3).map((amenity) => <span key={amenity}>{amenity}</span>)}</div><div className="result-facts"><span className="rating-badge"><Star size={13} fill="currentColor" /> {hotel.score.toFixed(1)} / 10</span>{hotel.freeCancellation && <span><Check size={14} /> Free cancellation</span>}</div></div><div className="service-result-price"><span>Per night · sample</span><strong>${hotel.price}</strong><small>~${hotel.price * nights} stay estimate</small><button className="experience-button experience-button-outline" type="button" onClick={onSelect}>View rooms <ArrowRight size={14} /></button></div></article>;
  }
  const car = option as CarOption;
  return <article className="service-result-card car-result-card"><ResultImage src={car.image} alt={car.name} /><div className="service-result-main"><span className="result-index">{car.category.toUpperCase()} · {car.fuel.toUpperCase()}</span><h3>{car.name}</h3><p>{car.transmission} transmission · {car.passengers} seats</p><div className="car-specs"><span><Users size={14} /> {car.passengers} seats</span><span>◫ {car.luggage} bags</span><span><BadgeCheck size={14} /> Unlimited mileage</span></div></div><div className="service-result-price"><span>Per day · sample</span><strong>${car.price}</strong><small>~${car.price * days} rental estimate</small><button className="experience-button experience-button-outline" type="button" onClick={onSelect}>Select car <ArrowRight size={14} /></button></div></article>;
}
