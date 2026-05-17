// Bug fix: N/A — root layout with brand fonts (Newake + Indivisible + Caveat handwritten) and Dutch locale.
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { Caveat } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const newake = localFont({
  src: "../../newake/NewakeFont-Demo.otf",
  variable: "--font-newake",
  display: "swap",
});

const indivisible = localFont({
  src: "../../fonts/fonnts.com-Indivisible.otf",
  variable: "--font-indivisible",
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-handwritten",
  display: "swap",
});

export const metadata: Metadata = {
  title: "De Werktelefoon",
  description: "Hoe gaat het met je op het werk?",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="nl"
      className={`${newake.variable} ${indivisible.variable} ${caveat.variable}`}
    >
      <body className="min-h-[100dvh] antialiased">
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
