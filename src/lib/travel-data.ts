export type ServiceKey = "visa" | "flights" | "hotels" | "cars";

export type VisaOption = {
  country: string;
  flag: string;
  region: string;
  processing: string;
  fee: number;
  entry: string;
  category: string;
  documents: string[];
  eligibility: string;
  notes: string;
};

export type FlightOption = {
  id: string;
  airline: string;
  initials: string;
  from: string;
  fromCode: string;
  to: string;
  toCode: string;
  depart: string;
  arrive: string;
  duration: string;
  minutes: number;
  stops: number;
  price: number;
  cabin: string;
};

export type HotelOption = {
  name: string;
  city: string;
  country: string;
  stars: number;
  score: number;
  type: string;
  price: number;
  image: string;
  description: string;
  amenities: string[];
  freeCancellation: boolean;
  rooms: { name: string; price: number }[];
};

export type CarOption = {
  name: string;
  category: string;
  transmission: string;
  passengers: number;
  luggage: number;
  fuel: string;
  price: number;
  image: string;
  location: string;
};

export const visaOptions: VisaOption[] = [
  { country: "United Arab Emirates", flag: "🇦🇪", region: "UAE", processing: "3–5 business days", fee: 89, entry: "Single entry · 30 days", category: "Tourist", documents: ["Passport valid for 6+ months", "Recent passport photograph", "Return flight itinerary", "Proof of accommodation"], eligibility: "Visitors holding a valid passport and confirmed travel plans may apply for a short-stay visitor visa.", notes: "Ensure your passport has at least two blank pages and remains valid beyond your planned stay." },
  { country: "United Kingdom", flag: "🇬🇧", region: "United Kingdom", processing: "15–20 business days", fee: 145, entry: "Multiple entry · Up to 6 months", category: "Tourist", documents: ["Passport and travel history", "Recent passport photograph", "Bank statements", "Travel itinerary"], eligibility: "Applicants should be able to demonstrate the purpose of their visit and sufficient funds for their stay.", notes: "Biometric appointment availability can affect the total application timeline." },
  { country: "Türkiye", flag: "🇹🇷", region: "Turkey", processing: "1–3 business days", fee: 64, entry: "Multiple entry · 90 days", category: "Tourist", documents: ["Passport valid for 6+ months", "Return travel details", "Accommodation details", "Valid supporting visa if applicable"], eligibility: "Eligibility varies with nationality; some travellers may qualify for an electronic travel authorisation.", notes: "Entry conditions can vary by passport. Confirm your eligibility before departure." },
  { country: "Saudi Arabia", flag: "🇸🇦", region: "Saudi Arabia", processing: "3–7 business days", fee: 118, entry: "Multiple entry · 1 year", category: "Tourist", documents: ["Passport valid for 6+ months", "Passport photograph", "Travel medical insurance", "Confirmed travel dates"], eligibility: "Visitors can apply for tourism subject to nationality-specific entry requirements.", notes: "Local customs and entry regulations apply. Check current travel advisories before travel." },
  { country: "France (Schengen)", flag: "🇫🇷", region: "Schengen", processing: "15–30 business days", fee: 132, entry: "Short stay · Up to 90 days", category: "Tourist", documents: ["Passport and completed application", "Travel medical insurance", "Accommodation and itinerary", "Financial statements"], eligibility: "Short-stay visitors should apply through the country that is their main destination.", notes: "Appointment availability and seasonal demand may extend processing times." },
  { country: "Thailand", flag: "🇹🇭", region: "Thailand", processing: "5–10 business days", fee: 74, entry: "Single entry · Up to 60 days", category: "Tourist", documents: ["Passport valid for 6+ months", "Recent portrait photograph", "Proof of onward travel", "Proof of sufficient funds"], eligibility: "Tourism entry options depend on passport nationality and length of stay.", notes: "Visa-free entry may be available depending on nationality. Verify before applying." },
  { country: "Malaysia", flag: "🇲🇾", region: "Malaysia", processing: "3–7 business days", fee: 52, entry: "Single entry · 30 days", category: "Tourist", documents: ["Passport valid for 6+ months", "Recent passport photograph", "Return flight confirmation", "Accommodation details"], eligibility: "Entry requirements differ by nationality and planned duration of stay.", notes: "Some travellers must complete a digital arrival card before travel." },
  { country: "Australia", flag: "🇦🇺", region: "Australia", processing: "2–6 weeks", fee: 159, entry: "Multiple entry · Up to 12 months", category: "Tourist", documents: ["Passport identity page", "Evidence of funds", "Travel purpose statement", "Previous travel and visa history"], eligibility: "Visitors must meet health and character requirements and show a genuine temporary stay.", notes: "Processing times vary and can be longer if additional information is requested." },
  { country: "Indonesia", flag: "🇮🇩", region: "Indonesia", processing: "3–8 business days", fee: 71, entry: "Single entry · Up to 60 days", category: "Tourist", documents: ["Passport valid for 6+ months", "Return or onward ticket", "Recent passport photograph", "Proof of accommodation"], eligibility: "Visitors may need a visa depending on nationality and length of stay.", notes: "Visa-on-arrival and e-visa eligibility varies. Check the current official guidance." },
  { country: "Maldives", flag: "🇲🇻", region: "Maldives", processing: "Visa on arrival (sample)", fee: 0, entry: "Tourist entry · Up to 30 days", category: "Tourist", documents: ["Passport valid for intended stay", "Confirmed return travel", "Proof of accommodation", "Traveller declaration if required"], eligibility: "Tourist entry provisions are subject to current passport-specific rules.", notes: "Confirm the current traveller declaration and entry rules with official authorities." },
];

export const flightOptions: FlightOption[] = [
  { id: "emirates-1", airline: "Emirates", initials: "EK", from: "New York", fromCode: "JFK", to: "Dubai", toCode: "DXB", depart: "10:20 PM", arrive: "7:35 PM", duration: "12h 15m", minutes: 735, stops: 0, price: 684, cabin: "Economy" },
  { id: "qatar-1", airline: "Qatar Airways", initials: "QR", from: "New York", fromCode: "JFK", to: "Dubai", toCode: "DXB", depart: "9:10 PM", arrive: "7:05 PM", duration: "13h 55m", minutes: 835, stops: 1, price: 612, cabin: "Economy" },
  { id: "turkish-1", airline: "Turkish Airlines", initials: "TK", from: "New York", fromCode: "JFK", to: "Dubai", toCode: "DXB", depart: "12:45 AM", arrive: "11:10 PM", duration: "14h 25m", minutes: 865, stops: 1, price: 735, cabin: "Economy" },
  { id: "etihad-1", airline: "Etihad Airways", initials: "EY", from: "New York", fromCode: "JFK", to: "Dubai", toCode: "DXB", depart: "3:30 PM", arrive: "2:55 PM", duration: "13h 25m", minutes: 805, stops: 1, price: 698, cabin: "Economy" },
  { id: "emirates-2", airline: "Emirates", initials: "EK", from: "London", fromCode: "LHR", to: "Dubai", toCode: "DXB", depart: "2:20 PM", arrive: "12:30 AM", duration: "7h 10m", minutes: 430, stops: 0, price: 512, cabin: "Economy" },
  { id: "british-1", airline: "British Airways", initials: "BA", from: "London", fromCode: "LHR", to: "Dubai", toCode: "DXB", depart: "9:40 AM", arrive: "8:05 PM", duration: "7h 25m", minutes: 445, stops: 0, price: 548, cabin: "Economy" },
  { id: "lufthansa-1", airline: "Lufthansa", initials: "LH", from: "New York", fromCode: "JFK", to: "Dubai", toCode: "DXB", depart: "5:50 PM", arrive: "5:20 PM", duration: "14h 30m", minutes: 870, stops: 1, price: 755, cabin: "Economy" },
  { id: "qatar-2", airline: "Qatar Airways", initials: "QR", from: "London", fromCode: "LHR", to: "Dubai", toCode: "DXB", depart: "8:15 AM", arrive: "7:45 PM", duration: "7h 30m", minutes: 450, stops: 0, price: 498, cabin: "Economy" },
  { id: "singapore-1", airline: "Singapore Airlines", initials: "SQ", from: "London", fromCode: "LHR", to: "Dubai", toCode: "DXB", depart: "6:30 AM", arrive: "6:00 PM", duration: "7h 30m", minutes: 450, stops: 0, price: 579, cabin: "Premium Economy" },
  { id: "airfrance-1", airline: "Air France", initials: "AF", from: "New York", fromCode: "JFK", to: "Paris", toCode: "CDG", depart: "8:05 PM", arrive: "9:25 AM", duration: "7h 20m", minutes: 440, stops: 0, price: 642, cabin: "Economy" },
  { id: "klm-1", airline: "KLM", initials: "KL", from: "New York", fromCode: "JFK", to: "Paris", toCode: "CDG", depart: "5:45 PM", arrive: "10:15 AM", duration: "10h 30m", minutes: 630, stops: 1, price: 598, cabin: "Economy" },
  { id: "turkish-2", airline: "Turkish Airlines", initials: "TK", from: "London", fromCode: "LHR", to: "Istanbul", toCode: "IST", depart: "11:20 AM", arrive: "5:30 PM", duration: "4h 10m", minutes: 250, stops: 0, price: 385, cabin: "Economy" },
  { id: "emirates-business", airline: "Emirates", initials: "EK", from: "New York", fromCode: "JFK", to: "Dubai", toCode: "DXB", depart: "10:20 PM", arrive: "7:35 PM", duration: "12h 15m", minutes: 735, stops: 0, price: 2480, cabin: "Business" },
  { id: "etihad-first", airline: "Etihad Airways", initials: "EY", from: "New York", fromCode: "JFK", to: "Dubai", toCode: "DXB", depart: "3:30 PM", arrive: "2:55 PM", duration: "13h 25m", minutes: 805, stops: 1, price: 4290, cabin: "First Class" },
];

const hotelImages = {
  dubai: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=900&q=85",
  paris: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=900&q=85",
  london: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=900&q=85",
  istanbul: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=900&q=85",
  maldives: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=900&q=85",
  bali: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=900&q=85",
  bangkok: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=900&q=85",
};

function hotel(name: string, city: string, country: string, stars: number, score: number, type: string, price: number, image: string, description: string, amenities: string[], freeCancellation: boolean): HotelOption {
  return {
    name, city, country, stars, score, type, price, image, description, amenities, freeCancellation,
    rooms: [
      { name: "Classic room", price },
      { name: "Deluxe room with breakfast", price: price + 48 },
      { name: "Suite", price: price + 125 },
    ],
  };
}

export const hotelOptions: HotelOption[] = [
  hotel("Address Downtown", "Dubai", "UAE", 5, 9.2, "Hotel", 289, hotelImages.dubai, "A contemporary city retreat moments from the Dubai Fountain and the heart of Downtown.", ["Pool", "Spa", "Breakfast", "Free Wi-Fi"], true),
  hotel("The Hoxton Paris", "Paris", "France", 4, 9.0, "Boutique", 189, hotelImages.paris, "A characterful boutique stay with a courtyard garden in the 2nd arrondissement.", ["Restaurant", "Bar", "Free Wi-Fi"], true),
  hotel("The Langham London", "London", "UK", 5, 9.4, "Hotel", 325, hotelImages.london, "Timeless London hospitality on Regent Street, with a celebrated spa and dining.", ["Pool", "Spa", "Breakfast", "Gym"], false),
  hotel("Pera Palace Hotel", "Istanbul", "Türkiye", 5, 9.1, "Hotel", 214, hotelImages.istanbul, "A storied landmark hotel overlooking the Golden Horn in vibrant Beyoğlu.", ["Restaurant", "Spa", "Free Wi-Fi"], true),
  hotel("Baros Maldives", "Maldives", "Maldives", 5, 9.7, "Resort", 735, hotelImages.maldives, "An intimate island escape with overwater villas and a turquoise house reef.", ["Pool", "Spa", "Beach", "Breakfast"], false),
  hotel("Alila Seminyak", "Bali", "Indonesia", 5, 9.3, "Resort", 278, hotelImages.bali, "A modern beachfront resort with expansive ocean views and serene pools.", ["Pool", "Spa", "Beach", "Restaurant"], true),
  hotel("The Standard Bangkok", "Bangkok", "Thailand", 5, 9.0, "Hotel", 176, hotelImages.bangkok, "A lively design-led hotel in the city, with skyline views and rooftop dining.", ["Pool", "Gym", "Restaurant", "Free Wi-Fi"], true),
  hotel("Rove Downtown", "Dubai", "UAE", 3, 8.8, "Hotel", 112, hotelImages.dubai, "A relaxed, well-connected base for exploring Downtown Dubai.", ["Pool", "Gym", "Free Wi-Fi"], true),
  hotel("Maison Souquet", "Paris", "France", 5, 9.4, "Boutique", 245, hotelImages.paris, "A discreet Parisian hideaway with richly layered interiors near Montmartre.", ["Spa", "Bar", "Room service"], false),
  hotel("The Hoxton Shoreditch", "London", "UK", 4, 8.9, "Boutique", 198, hotelImages.london, "A design-forward East London stay surrounded by independent shops and cafes.", ["Restaurant", "Bar", "Free Wi-Fi"], true),
];

export const carOptions: CarOption[] = [
  { name: "Toyota Corolla", category: "Economy", transmission: "Automatic", passengers: 5, luggage: 3, fuel: "Hybrid", price: 39, location: "Dubai", image: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=900&q=85" },
  { name: "Honda Civic", category: "Sedan", transmission: "Automatic", passengers: 5, luggage: 3, fuel: "Petrol", price: 46, location: "Dubai", image: "https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=900&q=85" },
  { name: "Toyota Camry", category: "Sedan", transmission: "Automatic", passengers: 5, luggage: 4, fuel: "Hybrid", price: 57, location: "Dubai", image: "https://images.unsplash.com/photo-1623869675781-80aa31012a5a?auto=format&fit=crop&w=900&q=85" },
  { name: "Hyundai Tucson", category: "SUV", transmission: "Automatic", passengers: 5, luggage: 4, fuel: "Petrol", price: 68, location: "Dubai", image: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=900&q=85" },
  { name: "Kia Sportage", category: "SUV", transmission: "Automatic", passengers: 5, luggage: 4, fuel: "Hybrid", price: 72, location: "Dubai", image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=900&q=85" },
  { name: "BMW 5 Series", category: "Luxury", transmission: "Automatic", passengers: 5, luggage: 3, fuel: "Petrol", price: 142, location: "Dubai", image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=900&q=85" },
  { name: "Mercedes-Benz C-Class", category: "Luxury", transmission: "Automatic", passengers: 5, luggage: 3, fuel: "Hybrid", price: 136, location: "Dubai", image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=900&q=85" },
  { name: "Tesla Model 3", category: "Electric", transmission: "Automatic", passengers: 5, luggage: 3, fuel: "Electric", price: 104, location: "Dubai", image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=900&q=85" },
  { name: "Porsche 911", category: "Sports", transmission: "Automatic", passengers: 2, luggage: 2, fuel: "Petrol", price: 245, location: "Dubai", image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=85" },
];

export const serviceMeta: Record<ServiceKey, { title: string; eyebrow: string; description: string; image: string; icon: string }> = {
  visa: { title: "Your journey starts with the right visa.", eyebrow: "A LITTLE HELP WITH THE PAPERWORK", description: "Explore sample entry information, understand the usual steps, and get a little expert guidance for the road ahead.", image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=2000&q=85", icon: "✦" },
  flights: { title: "Find your next flight. Fly without limits.", eyebrow: "THE SKY IS YOURS", description: "Compare sample routes, find a flight that fits your plans, and start looking forward to the journey.", image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=2000&q=85", icon: "✈" },
  hotels: { title: "Find your perfect stay anywhere.", eyebrow: "SOMEWHERE TO SETTLE IN", description: "Discover thoughtfully selected hotels, resorts, and stays for the moments that make a trip yours.", image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=2000&q=85", icon: "⌂" },
  cars: { title: "The road is yours. Choose your ride.", eyebrow: "TAKE THE SCENIC ROUTE", description: "Find the right set of wheels for city streets, open roads, and all the places in between.", image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=2000&q=85", icon: "↗" },
};

export const destinations = ["Dubai", "Paris", "London", "Istanbul", "Maldives", "Bali", "Bangkok", "Sydney"];
