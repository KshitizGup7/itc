import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Cormorant_Garamond } from "next/font/google";
import "./globals.css";

// Cormorant for elegant headings — fits your luxury carpet brand perfectly
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
  adjustFontFallback: true,
});

export const metadata: Metadata = {
  title: "Indian Tufted Carpet",
  description:
    "Discover the art of Indian rug making. We manufacture and supply exquisite hand-knotted, hand-woven, and fully custom rugs for our business partners.",
  openGraph: {
    title: "Indian Tufted Carpets",
    description: "Premium handmade carpets for global markets.",
    images: [{ url: "/ITCLOGO.jpg", width: 1200, height: 630 }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`
          ${GeistSans.variable}
          ${GeistMono.variable}
          ${cormorant.variable}
          ${GeistSans.className}
          antialiased
        `}
      >
        {children}
      </body>
    </html>
  );
}