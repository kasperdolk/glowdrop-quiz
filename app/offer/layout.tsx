import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your Personalized Glow Protocol | GlowDrop Tanning Drops",
  description: "Get your perfect tan with GlowDrop's drinkable tanning drops. Natural, UV-free glow that builds from within. 30-day money back guarantee.",
};

export default function OfferLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
