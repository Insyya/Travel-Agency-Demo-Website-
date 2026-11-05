import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Voyago — Find Your Somewhere",
  description:
    "Considered travel planning, made personal. Explore destinations, flights, stays, visa assistance and car rentals with Voyago.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  );
}
