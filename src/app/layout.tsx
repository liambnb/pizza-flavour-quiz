import type { Metadata } from "next";
import "./globals.css";
import { MockWalletProvider } from "@/lib/use-mock-wallet";

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
    <html lang="en">
      <body className="bg-[#0B0E11] text-white antialiased min-h-full flex flex-col">
        <MockWalletProvider>{children}</MockWalletProvider>
      </body>
    </html>
  );
}
