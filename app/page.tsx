
import HeroSection from "@/components/Hero";
import Image from "next/image";
import WhyChooseUs from "@/components/Us";
import Products from "@/components/Products"
import ContactSection from "@/components/Contact";
import Footer from "@/components/Footer";

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
