import type { Metadata } from "next";
import { Alfa_Slab_One, Bungee, DM_Sans } from "next/font/google";
import "./globals.css";
import { MockWalletProvider } from "@/lib/use-mock-wallet";
import { PizzaRainProvider } from "@/lib/pizza-rain-context";
import PizzaRain from "@/components/PizzaRain";
import PizzaRainToggle from "@/components/PizzaRainToggle";

const alfaSlab = Alfa_Slab_One({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-alfa-slab",
  display: "swap",
});

const bungee = Bungee({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bungee",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "BNB Pizza Day 2026 · What slice of crypto are you?",
  description:
    "Take the 5-question quiz, get your Bitcoin Pizza Day collector card, and mint it to BNB Chain.",
  openGraph: {
    title: "BNB Pizza Day 2026 · What slice of crypto are you?",
    description:
      "Take the 5-question quiz, get your Bitcoin Pizza Day collector card, and mint it to BNB Chain.",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    site: "@BNBCHAIN",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${alfaSlab.variable} ${bungee.variable} ${dmSans.variable}`}
    >
      <body className="bg-bnb text-ink antialiased min-h-full flex flex-col">
        <MockWalletProvider>
          <PizzaRainProvider>
            <PizzaRain />
            {children}
            <PizzaRainToggle />
          </PizzaRainProvider>
        </MockWalletProvider>
      </body>
    </html>
  );
}
