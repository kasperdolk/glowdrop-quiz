import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

// Using Google Fonts link for Instrument Serif since it's not available in next/font/google
// We'll add it via CSS import in globals.css

export const metadata: Metadata = {
  title: "Do You Have a Parasite? | Doctor Approved Quiz | Serene Herbs",
  description: "Bloating, brain fog, and stubborn fat? Take our doctor-approved quiz to discover if parasites are causing your symptoms and get your personalized solution.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link href="https://db.onlinewebfonts.com/c/bf01e62ae842ea4c690e771ec2427a1f?family=Cooper+Lt+BT+Bold" rel="stylesheet" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} antialiased`}
        style={{ backgroundColor: '#F9F7F5FF' }}
      >
        {children}
      </body>
    </html>
  );
}
