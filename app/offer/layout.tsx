import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your Parasite Cleanse Protocol | Serene Herbs Soursop Bitters",
  description: "Eliminate parasites naturally with our doctor-approved 16-herb formula. Target bloating, brain fog, and stubborn fat at the root cause. 60-day guarantee.",
};

export default function OfferLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
