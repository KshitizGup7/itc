"use client"
import { Button } from "@/components/ui/button";
import Image from "next/image";
import heroBackground from "@/public/assets/fback.jpg";
import { motion, type Variants } from "framer-motion";
import { redirect } from 'next/navigation'

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.3,
      duration: 0.8,
      ease: [0.4, 0, 0.2, 1] as const,
    },
  }),
};


const HeroSection = () => {

  const handleContactClick = () => {
    const contactSection = document.getElementById("contact");
    contactSection?.scrollIntoView({ behavior: "smooth" });
  };
  const CatalogClick = () => {
     redirect('/catalog')
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-burgundy text-white">
      {/* Background Image with gradient overlay */}
      <div className="absolute inset-0 -z-10">
        <Image
          src={heroBackground}
          alt="Hero Carpet Background"
          fill
          className="w-full h-[300px] sm:h-[400px] md:h-[600px] object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/10" />
      </div>

      {/* Animated Content */}
      <motion.div
        initial="hidden"
        animate="visible"
        className="relative z-10 container mx-auto px-6 text-center"
      >
        <motion.h1
          variants={fadeInUp}
          custom={0}
          className="text-4xl md:text-6xl font-bold  uppercase tracking-widest mb-6 text-[#F9F9F9]"
        >
          Indian Tufted Carpets
        </motion.h1>

        <motion.p
          variants={fadeInUp}
          custom={1}
          className="text-xl font-bold uppercase tracking-wide md:text-2xl mb-4 text-cream text-[#F9F9F9]"
        >
          A mark for quality, weaving the magic of creativity
        </motion.p>

        <motion.p
          variants={fadeInUp}
          custom={2}
          className="text-lg md:text-xl mb-8 font-bold text-[#F9F9F9] max-w-3xl mx-auto  uppercase tracking-wide"
        >
          Masterfully woven in Bhadohi, India delivering exquisite hand tufted, woven, knotted carpets for over 45 years.
        </motion.p>

        <motion.div
          variants={fadeInUp}
          custom={3}
          className="flex flex-col sm:flex-row justify-center items-center gap-4"
        >
          <Button size="lg"  onClick={CatalogClick}
          className="text-lg px-8 py-4 cursor-pointer">
            Explore Collection
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={handleContactClick}
            className="text-lg px-8 py-4 bg-white/10 border-white text-white hover:bg-[#fbfafa49] cursor-pointer"
          >
            Contact Us
          </Button>


        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          variants={fadeInUp}
          custom={4}
          className="mt-10 text-white/70 animate-bounce"
          aria-hidden="true"
        >
          <svg
            className="w-6 h-6 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
