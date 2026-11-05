"use client";

import {
  ArrowDown,
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  CarFront,
  Check,
  ChevronLeft,
  ChevronRight,
  Compass,
  Globe2,
  Headphones,
  Heart,
  Hotel,
  MapPin,
  Menu,
  Plane,
  Quote,
  ShieldCheck,
  Sparkles,
  Star,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import RoutePreloader from "@/components/RoutePreloader";

type SearchTab = "Flights" | "Hotels" | "Visa" | "Cars";
type MockResult = {
  title: string;
  subtitle: string;
  price: string;
  details: string[];
  image?: string;
  searchTerms?: string[];
};

const heroBackgroundUrl =
  "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=2400&q=90";

const tabs: { name: SearchTab; icon: typeof Plane }[] = [
  { name: "Flights", icon: Plane },
  { name: "Hotels", icon: Hotel },
  { name: "Visa", icon: Globe2 },
  { name: "Cars", icon: CarFront },
];

const services = [
  {
    icon: Globe2,
    title: "Visa assistance",
    description:
      "From paperwork to peace of mind, our specialists make every application feel simple.",
    image:
      "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=900&q=85",
    link: "Visa",
  },
  {
    icon: Plane,
    title: "Flight booking",
    description:
      "Compare thoughtfully selected routes and find a flight that fits your plans.",
    image:
      "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=900&q=85",
    link: "Flights",
  },
  {
    icon: Hotel,
    title: "Hotel stays",
    description:
      "Stay somewhere that feels just right, from boutique hideaways to city icons.",
    image:
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=900&q=85",
    link: "Hotels",
  },
  {
    icon: CarFront,
    title: "Car rental",
    description:
      "Take the scenic route with flexible rides for wherever the road takes you.",
    image:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=85",
    link: "Cars",
  },
];

const destinations = [
  {
    name: "Dubai",
    country: "United Arab Emirates",
    price: "From $680",
    description: "A city of big dreams and desert sunsets.",
    image:
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1000&q=85",
  },
  {
    name: "Paris",
    country: "France",
    price: "From $540",
    description: "Slow mornings, beautiful streets, endless charm.",
    image:
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1000&q=85",
  },
  {
    name: "Istanbul",
    country: "Türkiye",
    price: "From $420",
    description: "Where two continents meet over a cup of tea.",
    image:
      "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1000&q=85",
  },
  {
    name: "London",
    country: "United Kingdom",
    price: "From $590",
    description: "A little old-world wonder around every corner.",
    image:
      "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1000&q=85",
  },
  {
    name: "The Maldives",
    country: "Indian Ocean",
    price: "From $1,240",
    description: "Your very own postcard, surrounded by blue.",
    image:
      "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1000&q=85",
  },
  {
    name: "Bali",
    country: "Indonesia",
    price: "From $760",
    description: "Find your rhythm among rice fields and sea.",
    image:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1000&q=85",
  },
];

const benefits = [
  {
    icon: BadgeCheck,
    title: "People who know the way",
    description:
      "Real travel experts, ready with thoughtful advice whenever you need it.",
  },
  {
    icon: Heart,
    title: "Good trips, fair prices",
    description:
      "Handpicked options that make your budget go further, without cutting corners.",
  },
  {
    icon: Headphones,
    title: "Here, around the clock",
    description:
      "Travel with the reassurance that a friendly human is only a call away.",
  },
  {
    icon: ShieldCheck,
    title: "The details, taken care of",
    description:
      "One calm, considered experience from the first search to the way home.",
  },
];

const reviews = [
  {
    name: "Sophie Williams",
    location: "Paris, France",
    text: "Voyago made our anniversary trip feel effortless. Every little detail was thought through, and we found the sweetest hotel in Le Marais.",
    initials: "SW",
    color: "#e9c7af",
  },
  {
    name: "Amir Rahman",
    location: "Istanbul, Türkiye",
    text: "The visa advice took all the guesswork out of planning. I could focus on being excited about the trip instead of worrying about forms.",
    initials: "AR",
    color: "#d8d1b3",
  },
  {
    name: "Maya Chen",
    location: "Bali, Indonesia",
    text: "From the first flight search to the car we picked up at the airport, it all just worked. Already dreaming about our next getaway.",
    initials: "MC",
    color: "#c5d3c5",
  },
];

const flights: MockResult[] = [
  {
    title: "Emirates",
    subtitle: "08:40 AM  →  06:15 PM",
    price: "$684",
    details: ["DXB · 7h 35m · Direct", "Economy · Round trip"],
    searchTerms: ["dubai", "maldives", "bali"],
  },
  {
    title: "Qatar Airways",
    subtitle: "10:20 AM  →  08:05 PM",
    price: "$612",
    details: ["DOH · 8h 45m · 1 stop", "Economy · Round trip"],
    searchTerms: ["paris", "london", "istanbul"],
  },
  {
    title: "Turkish Airlines",
    subtitle: "02:10 PM  →  11:30 PM",
    price: "$735",
    details: ["IST · 9h 20m · Direct", "Economy · Round trip"],
    searchTerms: ["paris", "london", "istanbul", "dubai"],
  },
];

const hotels: MockResult[] = [
  {
    title: "The Hoxton Paris",
    subtitle: "Paris, France · 0.8 mi from center",
    price: "$189",
    details: ["★ 4.8 · Breakfast available", "Free Wi-Fi · City view"],
    image:
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=700&q=80",
  },
  {
    title: "Maison Souquet",
    subtitle: "Paris, France · Montmartre",
    price: "$245",
    details: ["★ 4.9 · Boutique hotel", "Spa · Room service"],
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=700&q=80",
  },
];

const visaResults: MockResult[] = [
  {
    title: "Tourist visitor visa",
    subtitle: "Short stay · Single or multiple entry",
    price: "From $85",
    details: ["Typical processing: 10–15 business days", "Passport · Photo · Proof of stay"],
  },
  {
    title: "Business visitor visa",
    subtitle: "Meetings · Conferences · Business travel",
    price: "From $120",
    details: ["Typical processing: 7–12 business days", "Passport · Invitation · Itinerary"],
  },
];

const cars: MockResult[] = [
  {
    title: "Mini Cooper Convertible",
    subtitle: "Mini · Automatic · 4 seats",
    price: "$58",
    details: ["Unlimited mileage · Air conditioning", "Pick-up from city centre"],
    image:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=700&q=80",
  },
  {
    title: "Mercedes-Benz C-Class",
    subtitle: "Premium · Automatic · 5 seats",
    price: "$96",
    details: ["Unlimited mileage · Air conditioning", "Free cancellation"],
    image:
      "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=700&q=80",
  },
];

function SectionHeading({
  eyebrow,
  title,
  description,
  light = false,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  light?: boolean;
}) {
  return (
    <div className={`section-heading ${light ? "section-heading-light" : ""}`}>
      <span className="eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      {description && <p>{description}</p>}
    </div>
  );
}

function Brand({ inverse = false }: { inverse?: boolean }) {
  return (
    <a className={`brand ${inverse ? "brand-inverse" : ""}`} href="#home" aria-label="Voyago home">
      <span className="brand-mark"><Compass size={21} strokeWidth={2.2} /></span>
      <span>voyago<span className="brand-dot">.</span></span>
    </a>
  );
}

export default function Home() {
  const [heroReady, setHeroReady] = useState(false);
  const [routeComplete, setRouteComplete] = useState(false);
  const [activeTab, setActiveTab] = useState<SearchTab>("Flights");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [results, setResults] = useState<MockResult[] | null>(null);
  const [searchMessage, setSearchMessage] = useState("");
  const [searching, setSearching] = useState(false);
  const [searchDestination, setSearchDestination] = useState("");
  const [activeReview, setActiveReview] = useState(0);
  const [contactSent, setContactSent] = useState(false);
  const [newsletterSent, setNewsletterSent] = useState(false);
  const [modalResult, setModalResult] = useState<MockResult | null>(null);
  const [savedDestinations, setSavedDestinations] = useState<string[]>([]);
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const siteReady = heroReady && routeComplete;
  const completeRoute = useCallback(() => setRouteComplete(true), []);

  useEffect(() => {
    let cancelled = false;
    const heroImage = new window.Image();
    const finishLoading = () => {
      if (!cancelled) setHeroReady(true);
    };

    heroImage.fetchPriority = "high";
    heroImage.onload = finishLoading;
    heroImage.onerror = finishLoading;
    heroImage.src = heroBackgroundUrl;
    if (heroImage.complete) finishLoading();

    return () => {
      cancelled = true;
      heroImage.onload = null;
      heroImage.onerror = null;
    };
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const root = document.documentElement;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hoverCleanups: (() => void)[] = [];
    const context = gsap.context(() => {
      if (!siteReady) return;
      if (reduceMotion) {
        gsap.utils.toArray<HTMLElement>(".stat-number").forEach((element) => {
          element.textContent = Number(element.dataset.value).toLocaleString();
        });
        return;
      }

      const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
      intro
        .fromTo(".hero-photo", { scale: 1.08 }, { scale: 1, duration: 1.8, ease: "power2.out" }, 0)
        .fromTo(".site-header .brand, .site-header .main-nav > *", { y: -16, opacity: 0 }, {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.07,
        }, 0.25)
        .fromTo(".hero-kicker", { y: 22, opacity: 0, letterSpacing: ".28em" }, {
          y: 0,
          opacity: 1,
          letterSpacing: ".18em",
          duration: 0.7,
        }, 0.38)
        .fromTo(".hero-title-line > span", { yPercent: 115, rotate: 2 }, {
          yPercent: 0,
          rotate: 0,
          duration: 1,
          stagger: 0.12,
        }, 0.48)
        .fromTo(".hero-copy > p, .hero-actions > *, .hero-trust", { y: 22, opacity: 0 }, {
          y: 0,
          opacity: 1,
          duration: 0.65,
          stagger: 0.12,
        }, 0.95)
        .fromTo(".hero-postcard", { x: 70, y: 24, rotate: 7, opacity: 0, scale: 0.92 }, {
          x: 0,
          y: 0,
          rotate: 0,
          opacity: 1,
          scale: 1,
          duration: 1.1,
          ease: "back.out(1.35)",
        }, 0.85)
        .fromTo(".hero-caption, .hero-bottom-inner", { y: 14, opacity: 0 }, {
          y: 0,
          opacity: 1,
          duration: 0.6,
        }, 1.1);

      gsap.to(".hero-postcard", {
        y: -8,
        x: 3,
        duration: 4.8,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        delay: 1.4,
        scrollTrigger: {
          trigger: ".hero",
          start: "top bottom",
          end: "bottom top",
          toggleActions: "play pause resume pause",
        },
      });
      gsap.to(".postcard-stamp", {
        rotate: 360,
        duration: 36,
        ease: "none",
        repeat: -1,
        transformOrigin: "50% 50%",
        scrollTrigger: {
          trigger: ".hero",
          start: "top bottom",
          end: "bottom top",
          toggleActions: "play pause resume pause",
        },
      });
      gsap.to(".hero-photo", {
        yPercent: 10,
        ease: "none",
        scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 0.6 },
      });

      gsap.utils.toArray<HTMLElement>(".reveal").forEach((element) => {
        gsap.fromTo(
          element,
          { y: 46, opacity: 0, filter: "blur(5px)" },
          {
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: { trigger: element, start: "top 86%", once: true },
          },
        );
      });
      gsap.fromTo(".search-panel", { y: 65, opacity: 0, scale: 0.97 }, {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: ".search-panel", start: "top 92%", once: true },
      });
      [".services-grid", ".benefit-grid", ".stats-grid"].forEach((selector) => {
        const cards = gsap.utils.toArray<HTMLElement>(`${selector} > *`);
        if (!cards.length) return;
        gsap.fromTo(cards, { y: 54, opacity: 0, scale: 0.96 }, {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          stagger: 0.13,
          ease: "power3.out",
          scrollTrigger: { trigger: selector, start: "top 82%", once: true },
        });
      });
      gsap.utils.toArray<HTMLElement>(".destination-card").forEach((card) => {
        const image = card.querySelector("img");
        const details = card.querySelectorAll<HTMLElement>(".destination-info > *");
        const reveal = gsap.timeline({
          scrollTrigger: { trigger: card, start: "top 82%", once: true },
        });
        if (image) {
          reveal.fromTo(image, { clipPath: "inset(0% 10% 0% 10%)", scale: 1.1 }, {
            clipPath: "inset(0% 0% 0% 0%)",
            scale: 1,
            duration: 1.15,
            ease: "power3.out",
          }, 0);
        }
        if (details.length) {
          reveal.fromTo(details, { y: 18, opacity: 0 }, {
            y: 0,
            opacity: 1,
            duration: 0.65,
            stagger: 0.07,
            ease: "power3.out",
          }, 0.16);
        }
      });
      gsap.utils.toArray<HTMLElement>(".stat-number").forEach((element) => {
        const target = Number(element.dataset.value);
        const counter = { value: 0 };
        gsap.to(counter, {
          value: target,
          duration: 1.7,
          ease: "power2.out",
          snap: { value: 1 },
          scrollTrigger: { trigger: element, start: "top 90%", once: true },
          onUpdate: () => {
            element.textContent = Math.round(counter.value).toLocaleString();
          },
        });
      });

      gsap.utils.toArray<HTMLElement>(".service-card, .destination-card").forEach((card) => {
        const image = card.querySelector("img");
        const onEnter = () => {
          gsap.to(card, { y: -7, duration: 0.35, ease: "power2.out", overwrite: "auto" });
          if (image) gsap.to(image, { scale: 1.07, duration: 0.7, ease: "power2.out", overwrite: "auto" });
        };
        const onLeave = () => {
          gsap.to(card, { y: 0, duration: 0.45, ease: "power3.out", overwrite: "auto" });
          if (image) gsap.to(image, { scale: 1, duration: 0.6, ease: "power2.out", overwrite: "auto" });
        };
        card.addEventListener("mouseenter", onEnter);
        card.addEventListener("mouseleave", onLeave);
        hoverCleanups.push(() => {
          card.removeEventListener("mouseenter", onEnter);
          card.removeEventListener("mouseleave", onLeave);
        });
      });
      gsap.utils.toArray<HTMLElement>(".button, .destination-bottom button").forEach((button) => {
        const onEnter = () => gsap.to(button, { y: -3, scale: 1.035, duration: 0.22, ease: "power2.out", overwrite: "auto" });
        const onLeave = () => gsap.to(button, { y: 0, scale: 1, duration: 0.3, ease: "power2.out", overwrite: "auto" });
        button.addEventListener("mouseenter", onEnter);
        button.addEventListener("mouseleave", onLeave);
        hoverCleanups.push(() => {
          button.removeEventListener("mouseenter", onEnter);
          button.removeEventListener("mouseleave", onLeave);
        });
      });
    }, root);

    const handleScroll = () => setScrolled(window.scrollY > 24);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (searchTimer.current) clearTimeout(searchTimer.current);
      hoverCleanups.forEach((cleanup) => cleanup());
      context.revert();
    };
  }, [siteReady]);

  useEffect(() => {
    if (!results?.length || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const context = gsap.context(() => {
      gsap.fromTo(".result-card", { y: 22, opacity: 0, scale: 0.98 }, {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.45,
        stagger: 0.1,
        ease: "power2.out",
      });
    });
    return () => context.revert();
  }, [results]);

  function chooseTab(tab: SearchTab) {
    setActiveTab(tab);
    setResults(null);
    setSearchMessage("");
    setMobileOpen(false);
  }

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const startDate = String(formData.get(activeTab === "Hotels" ? "checkin" : activeTab === "Cars" ? "pickupdate" : "departure") ?? "");
    const endDate = String(formData.get(activeTab === "Hotels" ? "checkout" : activeTab === "Cars" ? "returndate" : "return") ?? "");
    if (["Flights", "Hotels", "Cars"].includes(activeTab) && startDate && endDate && endDate < startDate) {
      setSearchMessage("Your return date should be after your departure date.");
      setResults(null);
      return;
    }
    setSearching(true);
    setResults(null);
    setSearchMessage("");
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      const location = String(
        formData.get("destination") ??
          formData.get("to") ??
          formData.get("pickup") ??
          formData.get("country") ??
          "",
      ).toLowerCase();
      const source = activeTab === "Flights" ? flights : activeTab === "Hotels" ? hotels : activeTab === "Visa" ? visaResults : cars;
      const filtered = source.filter((item) => {
        if (!location) return true;
        if (activeTab === "Flights") {
          return item.searchTerms?.some((term) => location.includes(term)) ?? false;
        }
        if (activeTab === "Hotels") {
          return `${item.title} ${item.subtitle}`.toLowerCase().includes(location);
        }
        return true;
      });
      setResults(filtered);
      setSearchMessage(filtered.length ? `${filtered.length} thoughtfully matched options` : "No options found. Try a different destination.");
      setSearching(false);
    }, 650);
  }

  function handleContactSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setContactSent(true);
    event.currentTarget.reset();
  }

  function handleNewsletterSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNewsletterSent(true);
    event.currentTarget.reset();
  }

  function scrollToTripPlanner(destination?: string) {
    if (destination) setSearchDestination(destination);
    document.getElementById("trip-planner")?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function toggleSaved(name: string) {
    setSavedDestinations((current) =>
      current.includes(name) ? current.filter((item) => item !== name) : [...current, name],
    );
  }

  const currentReview = reviews[activeReview];

  return (
    <>
      <RoutePreloader loaded={siteReady} onRouteComplete={completeRoute} />
      <header className={`site-header ${scrolled ? "header-scrolled" : ""}`}>
        <div className="nav-shell">
          <Brand />
          <button
            className="mobile-menu-toggle"
            type="button"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((open) => !open)}
          >
            {mobileOpen ? <X size={23} /> : <Menu size={23} />}
          </button>
          <nav className={`main-nav ${mobileOpen ? "nav-open" : ""}`} aria-label="Main navigation">
            <a href="#home" onClick={() => setMobileOpen(false)}>Home</a>
            <a href="#destinations" onClick={() => setMobileOpen(false)}>Destinations</a>
            <a href="#services" onClick={() => setMobileOpen(false)}>Our services</a>
            <Link href="/visa" onClick={() => setMobileOpen(false)}>Visa</Link>
            <Link href="/flights" onClick={() => setMobileOpen(false)}>Flights</Link>
            <Link href="/hotels" onClick={() => setMobileOpen(false)}>Stays</Link>
            <Link href="/cars" onClick={() => setMobileOpen(false)}>Cars</Link>
            <a href="#why-us" onClick={() => setMobileOpen(false)}>Why Voyago</a>
            <a href="#contact" onClick={() => setMobileOpen(false)}>Contact</a>
            <a className="nav-cta" href="#trip-planner" onClick={() => setMobileOpen(false)}>
              Plan a trip <ArrowRight size={15} />
            </a>
          </nav>
        </div>
      </header>

      <main>
        <section className={`hero ${siteReady ? "is-ready" : ""}`} id="home">
          <div className="hero-photo" style={{ backgroundImage: `url("${heroBackgroundUrl}")` }} aria-hidden="true" />
          <div className="hero-shade" aria-hidden="true" />
          <div className="hero-content page-width">
            <div className="hero-copy">
              <span className="hero-kicker"><Sparkles size={14} /> YOUR NEXT CHAPTER STARTS HERE</span>
              <h1 className="hero-title" aria-label="Somewhere wonderful is waiting.">
                <span className="hero-title-line"><span>Somewhere</span></span>
                <span className="hero-title-line"><span>wonderful is</span></span>
                <span className="hero-title-line"><span><em>waiting.</em></span></span>
              </h1>
              <p>Considered travel planning, made personal. Find your place in the world with Voyago.</p>
              <div className="hero-actions">
                <a className="button button-coral" href="#destinations">Find your somewhere <ArrowRight size={17} /></a>
                <a className="button button-ghost" href="#services">A little about us <ArrowDown size={16} /></a>
              </div>
              <div className="hero-trust">
                <div className="avatar-stack" aria-hidden="true">
                  <span>J</span><span>M</span><span>A</span><span>+</span>
                </div>
                <div><strong>10,000+ happy travellers</strong><small>and counting, one good trip at a time</small></div>
              </div>
            </div>
            <div className="hero-caption"><MapPin size={14} /> Amalfi Coast, Italy <span>·</span> A place to exhale</div>
            <aside className="hero-postcard" aria-label="Featured destination: the Italian coast">
              <div className="postcard-photo" />
              <div className="postcard-copy">
                <span>THE WEEKEND EDIT</span>
                <strong>A little Italian escape</strong>
                <small><MapPin size={12} /> Cinque Terre, Italy</small>
              </div>
              <div className="postcard-stamp" aria-hidden="true"><Compass size={20} /><span>GO<br />SLOW</span></div>
            </aside>
          </div>
          <div className="hero-bottom">
            <div className="page-width hero-bottom-inner">
              <span>NOT JUST PLACES. FEELINGS.</span><span>01 — 06</span>
            </div>
          </div>
        </section>

        <section className="search-wrap page-width" id="search" aria-label="Plan your trip">
          <div className="search-panel">
            <div className="search-topline">
              <div>
                <span className="eyebrow">LET’S GET YOU THERE</span>
                <h2>Where to next?</h2>
              </div>
              <span className="search-note"><ShieldCheck size={15} /> Free to explore. No commitment.</span>
            </div>
            <div className="search-tabs" role="tablist" aria-label="Choose a travel service">
              {tabs.map(({ name, icon: Icon }) => (
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === name}
                  className={`search-tab ${activeTab === name ? "tab-active" : ""}`}
                  onClick={() => chooseTab(name)}
                  key={name}
                >
                  <Icon size={17} /> {name === "Cars" ? "Car rental" : name}
                </button>
              ))}
            </div>
            <form className="search-form" onSubmit={handleSearch}>
              {activeTab === "Flights" && (
                <>
                  <label className="field"><span>From</span><span className="field-control"><MapPin size={16} /><input name="from" placeholder="City or airport" required /></span></label>
                  <label className="field"><span>To</span><span className="field-control"><MapPin size={16} /><input name="to" value={searchDestination} onChange={(event) => setSearchDestination(event.target.value)} placeholder="Where to?" required /></span></label>
                  <label className="field"><span>Departure</span><span className="field-control"><CalendarDays size={16} /><input type="date" name="departure" required /></span></label>
                  <label className="field"><span>Return</span><span className="field-control"><CalendarDays size={16} /><input type="date" name="return" required /></span></label>
                  <label className="field field-compact"><span>Travellers</span><select name="passengers" defaultValue="1"><option value="1">1 traveller</option><option value="2">2 travellers</option><option value="3">3 travellers</option><option value="4">4+ travellers</option></select></label>
                  <label className="field field-compact"><span>Class</span><select name="class" defaultValue="Economy"><option>Economy</option><option>Premium economy</option><option>Business</option><option>First class</option></select></label>
                </>
              )}
              {activeTab === "Hotels" && (
                <>
                  <label className="field field-wide"><span>Destination</span><span className="field-control"><MapPin size={16} /><input name="destination" value={searchDestination} onChange={(event) => setSearchDestination(event.target.value)} placeholder="City, hotel or landmark" required /></span></label>
                  <label className="field"><span>Check in</span><span className="field-control"><CalendarDays size={16} /><input type="date" name="checkin" required /></span></label>
                  <label className="field"><span>Check out</span><span className="field-control"><CalendarDays size={16} /><input type="date" name="checkout" required /></span></label>
                  <label className="field field-compact"><span>Guests</span><select name="guests" defaultValue="2"><option value="1">1 guest</option><option value="2">2 guests</option><option value="3">3 guests</option><option value="4">4+ guests</option></select></label>
                  <label className="field field-compact"><span>Rooms</span><select name="rooms" defaultValue="1"><option value="1">1 room</option><option value="2">2 rooms</option><option value="3">3+ rooms</option></select></label>
                </>
              )}
              {activeTab === "Visa" && (
                <>
                  <label className="field"><span>Your nationality</span><span className="field-control"><Globe2 size={16} /><input name="nationality" placeholder="e.g. Canadian" required /></span></label>
                  <label className="field"><span>Destination country</span><span className="field-control"><MapPin size={16} /><input name="country" value={searchDestination} onChange={(event) => setSearchDestination(event.target.value)} placeholder="Where are you going?" required /></span></label>
                  <label className="field field-compact"><span>Visa type</span><select name="visa" defaultValue="Tourist"><option>Tourist</option><option>Business</option><option>Student</option></select></label>
                  <label className="field"><span>Travel date</span><span className="field-control"><CalendarDays size={16} /><input type="date" name="traveldate" required /></span></label>
                </>
              )}
              {activeTab === "Cars" && (
                <>
                  <label className="field field-wide"><span>Pick-up location</span><span className="field-control"><MapPin size={16} /><input name="pickup" value={searchDestination} onChange={(event) => setSearchDestination(event.target.value)} placeholder="City or airport" required /></span></label>
                  <label className="field"><span>Pick-up date</span><span className="field-control"><CalendarDays size={16} /><input type="date" name="pickupdate" required /></span></label>
                  <label className="field"><span>Return date</span><span className="field-control"><CalendarDays size={16} /><input type="date" name="returndate" required /></span></label>
                  <label className="field field-compact"><span>Car type</span><select name="cartype" defaultValue="Any car"><option>Any car</option><option>Mini</option><option>Economy</option><option>SUV</option><option>Premium</option></select></label>
                </>
              )}
              <button className="button button-navy search-submit" type="submit" disabled={searching}>
                {searching ? <span className="spinner" aria-hidden="true" /> : <Compass size={17} />}
                {searching ? "Finding options" : "Search"}
              </button>
            </form>
            {searchMessage && <p className="search-feedback" role="status">{searchMessage}</p>}
            {results && (
              <div className="results-panel" aria-live="polite">
                <div className="results-heading"><div><span className="eyebrow">CURATED FOR YOU</span><h3>Your {activeTab.toLowerCase()} options</h3></div><button type="button" className="icon-button" aria-label="Close results" onClick={() => setResults(null)}><X size={19} /></button></div>
                {results.length === 0 ? <p className="empty-results">Nothing here just yet. Try another destination and we’ll look again.</p> :
                  <div className="results-list">
                    {results.map((result) => (
                      <article className="result-card" key={result.title}>
                        {result.image ? <Image src={result.image} alt="" width={120} height={110} unoptimized /> : <div className="result-icon">{activeTab === "Flights" ? <Plane size={20} /> : activeTab === "Visa" ? <Globe2 size={20} /> : <Compass size={20} />}</div>}
                        <div className="result-main"><strong>{result.title}</strong><span>{result.subtitle}</span><small>{result.details.join("  ·  ")}</small></div>
                        <div className="result-price"><strong>{result.price}</strong><small>{activeTab === "Hotels" ? "/ night" : activeTab === "Cars" ? "/ day" : "estimated"}</small></div>
                        <button className="button button-outline result-details" type="button" onClick={() => setModalResult(result)}>{activeTab === "Visa" ? "Requirements" : "View details"} <ArrowRight size={14} /></button>
                      </article>
                    ))}
                  </div>}
                <p className="mock-disclaimer">Sample options for demonstration only. No bookings or payments are processed.</p>
              </div>
            )}
          </div>
        </section>

        <section className="services-section section-pad" id="services">
          <div className="page-width">
            <div className="split-heading reveal">
              <SectionHeading eyebrow="THE GOOD STUFF" title="All the pieces, in one place." description="More time looking forward. Less time figuring out the details." />
              <a className="text-link" href="#trip-planner">Explore everything <ArrowRight size={16} /></a>
            </div>
            <div className="services-grid">
              {services.map(({ icon: Icon, title, description, image, link }, index) => (
                <article className="service-card" key={title}>
                  <div className="service-image">
                    <Image src={image} alt="" width={900} height={500} sizes="(max-width: 760px) 100vw, 25vw" unoptimized />
                    <span className="service-count">0{index + 1}</span>
                  </div>
                  <div className="service-body">
                    <div className="service-icon"><Icon size={19} /></div>
                    <h3>{title}</h3>
                    <p>{description}</p>
                    <Link className="text-link" href={`/${link.toLowerCase()}`}>Let’s take a look <ArrowRight size={15} /></Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="destinations-section section-pad" id="destinations">
          <div className="page-width">
            <div className="split-heading reveal">
              <SectionHeading eyebrow="A FEW PLACES WE LOVE" title="A world of possibility." description="A little inspiration for wherever your heart's leaning." />
              <a className="text-link" href="#search">See all destinations <ArrowRight size={16} /></a>
            </div>
            <div className="destinations-grid">
              {destinations.map((destination, index) => (
                <article className={`destination-card destination-card-${index + 1}`} key={destination.name}>
                  <Image src={destination.image} alt={`${destination.name}, ${destination.country}`} fill sizes="(max-width: 760px) 100vw, 33vw" unoptimized />
                  <div className="destination-overlay" />
                  <button
                    className={`save-destination ${savedDestinations.includes(destination.name) ? "is-saved" : ""}`}
                    type="button"
                    aria-label={`${savedDestinations.includes(destination.name) ? "Remove" : "Save"} ${destination.name}`}
                    onClick={() => toggleSaved(destination.name)}
                  ><Heart size={17} fill={savedDestinations.includes(destination.name) ? "currentColor" : "none"} /></button>
                  <div className="destination-info">
                    <span className="destination-country">{destination.country}</span>
                    <h3>{destination.name}</h3>
                    <p>{destination.description}</p>
                    <div className="destination-bottom">
                      <span>{destination.price} <small>/ person</small></span>
                      <button type="button" aria-label={`Explore ${destination.name}`} onClick={() => scrollToTripPlanner(destination.name)}><ArrowRight size={17} /></button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="trip-planner-section section-pad" id="trip-planner">
          <div className="page-width">
            <div className="trip-planner-heading reveal">
              <span className="eyebrow">ONE DESTINATION. ALL THE PIECES.</span>
              <h2>Plan your complete trip.</h2>
              <p>Pick a place and bring the moving parts together. We’ll help you explore every step, all in one place.</p>
            </div>
            <label className="trip-destination-picker">
              <span><MapPin size={16} /> I’m dreaming of</span>
              <select value={searchDestination} onChange={(event) => setSearchDestination(event.target.value)}>
                <option value="">Choose a destination</option>
                {destinations.map((destination) => <option value={destination.name} key={destination.name}>{destination.name}, {destination.country}</option>)}
              </select>
            </label>
            <div className="trip-service-grid">
              {[
                { key: "visa", title: "Visa assistance", description: "Understand sample entry requirements and prepare for the application.", icon: Globe2 },
                { key: "flights", title: "Flights", description: "Compare sample routes and choose the journey that works for you.", icon: Plane },
                { key: "hotels", title: "Places to stay", description: "Browse considered stays for your time away.", icon: Hotel },
                { key: "cars", title: "Car rental", description: "Find a ride for airport transfers or a longer road trip.", icon: CarFront },
              ].map(({ key, title, description, icon: Icon }) => (
                <article className="trip-service-card" key={key}>
                  <span className="trip-service-icon"><Icon size={20} /></span>
                  <div><h3>{title}</h3><p>{description}</p></div>
                  <Link href={`/${key}?destination=${encodeURIComponent(searchDestination || "Dubai")}`} aria-label={`Explore ${title}`}><ArrowRight size={17} /></Link>
                </article>
              ))}
            </div>
            <p className="trip-planner-note"><ShieldCheck size={14} /> All options use local mock data. Nothing is booked or sent.</p>
          </div>
        </section>

        <section className="why-section section-pad" id="why-us">
          <div className="page-width why-layout">
            <div className="why-intro reveal">
              <span className="eyebrow">TRAVEL, THE WAY IT SHOULD FEEL</span>
              <h2>The world is big.<br />Planning can feel <em>small.</em></h2>
              <p>We believe the best trips start with a little less stress and a lot more possibility. So we bring all the moving pieces together, with people who genuinely care about yours.</p>
              <a className="button button-navy" href="#contact">Meet your travel people <ArrowRight size={16} /></a>
            </div>
            <div className="benefit-grid">
              {benefits.map(({ icon: Icon, title, description }, index) => (
                <article className="benefit-card" key={title}>
                  <div className="benefit-icon"><Icon size={20} /></div>
                  <span className="benefit-index">0{index + 1}</span>
                  <h3>{title}</h3><p>{description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="stats-section" aria-label="Voyago in numbers">
          <div className="page-width stats-grid">
            <div className="stat-item"><span className="stat-number" data-value="50">0</span><span className="stat-suffix">+</span><p>countries to wander</p></div>
            <div className="stat-item"><span className="stat-number" data-value="10000">0</span><span className="stat-suffix">+</span><p>happy travellers</p></div>
            <div className="stat-item"><span className="stat-number" data-value="500">0</span><span className="stat-suffix">+</span><p>stays worth remembering</p></div>
            <div className="stat-item"><span className="stat-number" data-value="98">0</span><span className="stat-suffix">%</span><p>would travel with us again</p></div>
          </div>
        </section>

        <section className="testimonial-section section-pad" id="stories">
          <div className="page-width testimonial-layout">
            <div className="testimonial-heading reveal">
              <span className="eyebrow">NOT JUST OUR WORD</span>
              <h2>Good trips make<br />good <em>stories.</em></h2>
              <p>And the best part? Hearing about yours when you get home.</p>
              <div className="review-controls">
                <button type="button" className="icon-button" aria-label="Previous testimonial" onClick={() => setActiveReview((activeReview + reviews.length - 1) % reviews.length)}><ChevronLeft size={19} /></button>
                <span>0{activeReview + 1} <i>/</i> 0{reviews.length}</span>
                <button type="button" className="icon-button" aria-label="Next testimonial" onClick={() => setActiveReview((activeReview + 1) % reviews.length)}><ChevronRight size={19} /></button>
              </div>
            </div>
            <article className="testimonial-card reveal" aria-live="polite">
              <Quote className="quote-icon" size={31} />
              <div className="review-stars" aria-label="5 out of 5 stars">{Array.from({ length: 5 }, (_, i) => <Star size={15} fill="currentColor" key={i} />)}</div>
              <blockquote>“{currentReview.text}”</blockquote>
              <div className="review-person">
                <span className="review-avatar" style={{ backgroundColor: currentReview.color }}>{currentReview.initials}</span>
                <span><strong>{currentReview.name}</strong><small>Explored {currentReview.location}</small></span>
                <span className="verified"><Check size={12} /> Verified traveller</span>
              </div>
            </article>
          </div>
        </section>

        <section className="contact-section section-pad" id="contact">
          <div className="page-width contact-layout">
            <div className="contact-copy reveal">
              <span className="eyebrow">WE’RE GOOD LISTENERS</span>
              <h2>Tell us what<br />you’re <em>dreaming of.</em></h2>
              <p>A big adventure, a long-overdue getaway, or just a question. We’re all ears.</p>
              <div className="contact-details">
                <a href="mailto:hello@voyago.travel"><span className="contact-detail-icon"><Globe2 size={17} /></span><span><small>WRITE US A NOTE</small>hello@voyago.travel</span></a>
                <a href="tel:+18005550184"><span className="contact-detail-icon"><Headphones size={17} /></span><span><small>GIVE US A CALL</small>+1 (800) 555-0184</span></a>
                <div><span className="contact-detail-icon"><MapPin size={17} /></span><span><small>FIND OUR LITTLE CORNER</small>Brooklyn, New York</span></div>
              </div>
            </div>
            <form className="contact-form reveal" onSubmit={handleContactSubmit}>
              <div className="form-heading"><span className="eyebrow">LET’S START HERE</span><h3>Send us a message</h3></div>
              <div className="form-row">
                <label className="contact-field">Your name<input name="name" placeholder="How should we call you?" required /></label>
                <label className="contact-field">Email address<input name="email" type="email" placeholder="you@example.com" required /></label>
              </div>
              <div className="form-row">
                <label className="contact-field">Phone (optional)<input name="phone" type="tel" placeholder="+1 (555) 000-0000" /></label>
                <label className="contact-field">What’s on your mind?
                  <select name="subject" defaultValue="" required><option value="" disabled>Choose a topic</option><option>Plan a trip</option><option>Flights & stays</option><option>Visa guidance</option><option>Something else</option></select>
                </label>
              </div>
              <label className="contact-field">A little more about it<textarea name="message" rows={4} placeholder="Tell us what you're thinking..." required /></label>
              <button className="button button-navy" type="submit">Send your note <ArrowRight size={16} /></button>
              {contactSent && <p className="form-success" role="status"><Check size={16} /> Thanks for reaching out. We’ll be in touch soon.</p>}
              <p className="privacy-note"><ShieldCheck size={13} /> Your details stay between us. Always.</p>
            </form>
          </div>
        </section>

        <section className="newsletter-section">
          <div className="page-width newsletter-layout">
            <div><span className="eyebrow">A LITTLE INSPIRATION, NOW AND THEN</span><h2>Good places find their way to you.</h2><p>Thoughtful travel ideas, occasional offers, zero noise.</p></div>
            <form className="newsletter-form" onSubmit={handleNewsletterSubmit}>
              <label className="sr-only" htmlFor="newsletter-email">Your email address</label>
              <input id="newsletter-email" name="email" type="email" placeholder="Your email address" required />
              <button type="submit" aria-label="Subscribe to newsletter"><ArrowRight size={19} /></button>
              {newsletterSent && <span className="newsletter-success" role="status">You’re on the list — welcome aboard!</span>}
            </form>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="page-width">
          <div className="footer-main">
            <div className="footer-brand-col"><Brand inverse /><p>Making the world feel a little closer, one thoughtful trip at a time.</p><div className="social-links"><a href="https://www.instagram.com/" aria-label="Instagram"><span>ig</span></a><a href="https://www.facebook.com/" aria-label="Facebook"><span>f</span></a><a href="https://www.pinterest.com/" aria-label="Pinterest"><span>p</span></a></div></div>
            <div className="footer-links"><h3>Find your way</h3><a href="#home">Home</a><a href="#destinations">Destinations</a><a href="#stories">Traveller stories</a><a href="#contact">Get in touch</a></div>
            <div className="footer-links"><h3>We can help with</h3><Link href="/visa">Visa assistance</Link><Link href="/flights">Flights</Link><Link href="/hotels">Places to stay</Link><Link href="/cars">Car rental</Link></div>
            <div className="footer-contact"><h3>Here for you</h3><p>Questions, daydreams, travel plans — we’d love to hear them.</p><a href="mailto:hello@voyago.travel">hello@voyago.travel</a><a href="tel:+18005550184">+1 (800) 555-0184</a></div>
          </div>
          <div className="footer-bottom"><span>© 2026 Voyago Travel Co. Made for the love of going.</span><div><a href="#contact">Privacy policy</a><a href="#contact">Terms of use</a></div><span className="footer-made">A little wonder goes a long way <Sparkles size={13} /></span></div>
        </div>
      </footer>

      {modalResult && (
        <div className="modal-backdrop" role="presentation" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setModalResult(null);
        }}>
          <section className="details-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
            <button type="button" className="icon-button modal-close" aria-label="Close details" onClick={() => setModalResult(null)}><X size={19} /></button>
            <span className="eyebrow">A LITTLE MORE TO KNOW</span>
            <h2 id="modal-title">{modalResult.title}</h2>
            <p>{modalResult.subtitle}</p>
            <ul>{modalResult.details.map((detail) => <li key={detail}><Check size={15} /> {detail}</li>)}</ul>
            <p className="modal-price">Estimated at <strong>{modalResult.price}</strong> <span>· Sample information only</span></p>
            <button className="button button-navy" type="button" onClick={() => setModalResult(null)}>Got it <Check size={16} /></button>
          </section>
        </div>
      )}
    </>
  );
}
