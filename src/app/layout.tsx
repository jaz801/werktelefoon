// Bug fix: N/A — root layout with brand fonts (Newake + Indivisible) and Dutch locale.
import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "De Werktelefoon",
  description: "Hoe gaat het echt met je op het werk?",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl" className={`${newake.variable} ${indivisible.variable}`}>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
