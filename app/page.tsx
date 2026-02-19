import type { Metadata } from "next";
import HeroSection from "@/components/Hero";
import Image from "next/image";
import WhyChooseUs from "@/components/Us";
import Products from "@/components/Products"
import ContactSection from "@/components/Contact";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Indian Tufted Carpet",
  
  keywords: ["hand tufted", "silk carpet", "Bhadohi rugs", "Indian carpet exporter", "hand knotted", "carpet", "rugs", "bhadohi"],
  description: "Leading manufacturer of exquisite hand-tufted, hand-knotted, and silk carpets. Based in Bhadohi, India, we offer custom designs, premium wool rugs, and global shipping.",
  openGraph: {
    title: "Indian Tufted Carpet | Artistry in Every Knot",
    description: "Explore our premium collection of handcrafted carpets from Bhadohi. Quality, tradition, and modern designs.",
    siteName: "Indian Tufted Carpet",
    locale: "en_INDIA",
    type: "website",
    images: [
      {
        url: "/ITCLOGO.jpg",
        width: 1200,
        height: 630,
        alt: "Indian Tufted Carpet Logo",
      },
    ],
  },
};

export default function Home() {
  return (
    <div className="overflow-x-hidden">
    <HeroSection/>
    <WhyChooseUs/>
    <Products/>
    <ContactSection/>
    <Footer/>
    </div>
    
  );
}
