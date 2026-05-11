import type { Metadata } from "next";
import "./globals.css";
import { kombin, dynaPuff, spaceGrotesk } from "./fonts";
import { MockWalletProvider } from "@/lib/use-mock-wallet";
import { PizzaRainProvider } from "@/lib/pizza-rain-context";
import PizzaRain from "@/components/PizzaRain";
import PizzaRainToggle from "@/components/PizzaRainToggle";

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
      className={`${kombin.variable} ${dynaPuff.variable} ${spaceGrotesk.variable}`}
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
