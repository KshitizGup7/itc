import type { Metadata } from "next";
// Correctly import GeistSans and GeistMono from the 'geist' package
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";

// Your Google Font imports are correct
import { Inter, Roboto_Slab, Space_Grotesk } from "next/font/google";
import "./globals.css";

// Note: The 'geist' package exports the font object directly.
// You don't need to call it like a function.
// The variable name is already set to '--font-geist-sans' and '--font-geist-mono' by default.

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const robotoSlab = Roboto_Slab({
  subsets: ["latin"],
  variable: "--font-roboto-slab",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});


export const metadata: Metadata = {
  title: "Indian Tufted Carpet",
  description: "Discover the art of Indian rug making. We manufacture and supply exquisite hand-knotted, hand-woven, and fully custom rugs for our business partners.Explore our collections designed for the discerning tastes of your clientele.",
  openGraph: {
    title: "Indian Tufted Carpets",
    description: "Premium handmade carpets for global markets.",
    images: [
      {
        url: "/assets/ITCLOGO.jpg",
        width: 1200,
        height: 630,
      },
    ],
  },
};



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${GeistSans.variable} 
  ${GeistMono.variable} 
  ${inter.variable}
  ${robotoSlab.variable}
  ${spaceGrotesk.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}