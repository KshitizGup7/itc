// "use client"
// import { Button } from "@/components/ui/button";
// import Image from "next/image";
// import heroBackground from "@/public/assets/fback.webp";
// import { motion, type Variants } from "framer-motion";
// import { redirect } from 'next/navigation'

// const fadeInUp = {
//   hidden: { opacity: 0, y: 40 },
//   visible: (i: number) => ({
//     opacity: 1,
//     y: 0,
//     transition: {
//       delay: i * 0.3,
//       duration: 0.8,
//       ease: [0.4, 0, 0.2, 1] as const,
//     },
//   }),
// };


// const HeroSection = () => {

//   const handleContactClick = () => {
//     const contactSection = document.getElementById("contact");
//     contactSection?.scrollIntoView({ behavior: "smooth" });
//   };
//   const CatalogClick = () => {
//      redirect('/catalog')
//   }
//   const AboutClick = () => {
//      redirect('/about')
//   }

//   return (
//     <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-burgundy text-white">
//       {/* Background Image with gradient overlay */}
//       <div className="absolute inset-0 -z-10">
//         <Image
//           src={heroBackground}
//           alt="Hero Carpet Background"
//           fill
//           className="w-full h-[300px] sm:h-[400px] md:h-[600px] object-cover object-center"
//           priority
//         />
//         <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/10" />
//       </div>

//       {/* Animated Content */}
//       <motion.div
//         initial="hidden"
//         animate="visible"
//         className="relative z-10 container mx-auto px-6 text-center"
//       >
//         <motion.h1
//           variants={fadeInUp}
//           custom={0}
//           className="text-4xl md:text-6xl font-bold  uppercase tracking-widest mb-6 text-[#F9F9F9]"
//         >
//           Indian Tufted Carpets
//         </motion.h1>

//         <motion.p
//           variants={fadeInUp}
//           custom={1}
//           className="text-xl font-bold uppercase tracking-wide md:text-2xl mb-4 text-cream text-[#F9F9F9]"
//         >
//           A mark for quality, weaving the magic of creativity
//         </motion.p>

//         <motion.p
//           variants={fadeInUp}
//           custom={2}
//           className="text-lg md:text-xl mb-8 font-bold text-[#F9F9F9] max-w-3xl mx-auto  uppercase tracking-wide"
//         >
//           Masterfully woven in Bhadohi, India delivering exquisite hand tufted, woven, knotted carpets for over 45 years.
//         </motion.p>

//         <motion.div
//           variants={fadeInUp}
//           custom={3}
//           className="flex flex-col sm:flex-row justify-center items-center gap-4"
//         >
//           <Button size="lg"  onClick={CatalogClick}
//           className="text-lg px-8 py-4 cursor-pointer">
//             Explore Collection
//           </Button>
//           <Button
//             variant="outline"
//             size="lg"
//             onClick={handleContactClick}
//             className="text-lg px-8 py-4 bg-white/10 border-white text-white hover:bg-[#fbfafa49] cursor-pointer"
//           >
//             Contact Us
//           </Button>
//           <Button
//             variant="outline"
//             size="lg"
//             onClick={AboutClick}
//             className="text-lg px-8 py-4 bg-white/10 border-white text-white hover:bg-[#fbfafa49] cursor-pointer"
//           >
//             About Us
//           </Button>


//         </motion.div>

//         {/* Scroll Indicator */}
//         <motion.div
//           variants={fadeInUp}
//           custom={4}
//           className="mt-10 text-white/70 animate-bounce"
//           aria-hidden="true"
//         >
//           <svg
//             className="w-6 h-6 mx-auto"
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M19 14l-7 7m0 0l-7-7m7 7V3"
//             />
//           </svg>
//         </motion.div>
//       </motion.div>
//     </section>
//   );
// };

// export default HeroSection;
"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import heroBackground from "@/public/assets/fback.webp";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.25,
      duration: 0.8,
      ease: [0.4, 0, 0.2, 1] as const,
    },
  }),
};

const HeroSection = () => {
  const router = useRouter();

  const handleContactClick = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden text-white">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <Image
          src={heroBackground}
          alt="Handcrafted Indian carpet"
          fill
          className="object-cover object-center"
          priority
        />
        {/* Gradient: dark at bottom where text sits, subtle at top */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/40 to-black/20" />
      </div>

      {/* Content */}
      <motion.div
        initial="hidden"
        animate="visible"
        className="relative z-10 container mx-auto px-6 text-center max-w-4xl"
      >
        {/* Eyebrow */}
        <motion.p
          variants={fadeInUp}
          custom={0}
          className="text-xs md:text-sm uppercase font-bold tracking-[0.35em] text-[#ffffff] mb-5 font-medium"
        >
          Bhadohi, Uttar Pradesh · Est. 45+ Years
        </motion.p>

        {/* Main heading */}
        <motion.h1
          variants={fadeInUp}
          custom={1}
          className="text-4xl md:text-5xl lg:text-6xl font-bold uppercase tracking-widest text-white leading-none mb-6"
        >
          Indian Tufted<br className="hidden md:block" /> Carpets
        </motion.h1>

        {/* Tagline */}
        <motion.p
          variants={fadeInUp}
          custom={2}
          className="text-base md:text-lg text-white/95 mb-3 font-medium tracking-wide"
        >
          A mark for quality — weaving the magic of creativity
        </motion.p>

        {/* Sub-tagline */}
        <motion.p
          variants={fadeInUp}
          custom={3}
          className="text-sm md:text-base text-white/95 max-w-2xl mx-auto mb-12 leading-relaxed"
        >
          Masterfully woven in Bhadohi, India delivering exquisite hand tufted,
          woven, and knotted carpets to the world for over 45 years.
        </motion.p>

        {/* CTAs */}
        <motion.div
          variants={fadeInUp}
          custom={4}
          className="flex flex-col sm:flex-row justify-center items-center gap-4"
        >
          <Button
            size="lg"
            onClick={() => router.push("/catalog")}
            className="text-sm uppercase tracking-widest px-10 py-5 bg-[#b08d57] hover:bg-[#c69c5d] text-white border-0 rounded-full shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer"
          >
            Explore Collection
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={handleContactClick}
            className="text-sm uppercase tracking-widest px-10 py-5 bg-white/10 border border-white/40 text-white hover:bg-white/20 rounded-full transition-all duration-300 cursor-pointer"
          >
            Get In Touch
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => router.push("/about")}
            className="text-sm uppercase tracking-widest px-10 py-5 bg-white/10 border border-white/40 text-white hover:bg-white/20 rounded-full transition-all duration-300 cursor-pointer"
          >
            Our Story
          </Button>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          variants={fadeInUp}
          custom={5}
          className="mt-16 flex flex-col items-center gap-2 text-white/40"
          aria-hidden="true"
        >
          <span className="text-[10px] uppercase tracking-[0.3em]">Scroll</span>
          <motion.svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            animate={{ y: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </motion.svg>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;