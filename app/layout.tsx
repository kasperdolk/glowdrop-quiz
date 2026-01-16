import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, Coustard } from "next/font/google";
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

const coustard = Coustard({
  variable: "--font-coustard",
  subsets: ["latin"],
  weight: ["400"],
});

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
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${coustard.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
