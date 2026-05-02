// "use client"
// import Image from "next/image";
// import Link from "next/link";
// import { motion } from "framer-motion";

// export default function Catalog() {
//   return (
//     <div
//       className="min-h-screen bg-cover bg-center flex items-center justify-center p-4" // Added padding for smaller screens
//       style={{ backgroundImage: "url('/catalog/potBg.webp')" }}
//     >
//       <motion.div
//         initial={{ opacity: 0, scale: 0.95 }}
//         animate={{ opacity: 1, scale: 1 }}
//         transition={{ duration: 0.8 }}
//         className="relative w-full max-w-screen-xl h-[min(75vh,900px)] flex items-stretch overflow-hidden rounded-lg shadow-xl" // Responsive height
//       >
//         {/* Background Carpet Image (Updated) */}
//         <Image
//           src="/catalog/cataheader.webp"
//           alt="A close-up of a richly textured, traditional Indian carpet" // More descriptive alt text
//           fill // ✅ Modern 'fill' prop
//           className="z-0 object-fill" // ✅ Modern 'object-cover' class
//             priority

//         />

//         {/* Left Overlay with Text */}
//         <motion.div
//           initial={{ x: -100, opacity: 0 }}
//           animate={{ x: 0, opacity: 1 }}
//           transition={{ duration: 0.8, delay: 0.3 }}
//           // Cleaned up background classes: uses background color with opacity
//           className="w-full md:w-1/2 relative z-10 bg-[#1c1b1b82] bg-opacity-70 text-white flex flex-col justify-center p-6 md:p-10"
//         >
//           <Link
//             href="/"
//             className="absolute top-6 left-6 text-white hover:text-gray-300 transition"
//             aria-label="Back to Home" // Added aria-label for accessibility
//           >
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="h-6 w-6"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//               strokeWidth={2}
//             >
//               <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
//             </svg>
//           </Link>

//           {/* ✅ Correct semantic structure for headings */}
//           <h1 className="text-4xl md:text-5xl font-bold uppercase tracking-widest">
//             Indian Tufted Carpets
//           </h1>
//           <h2 className="mt-4 text-2xl font-bold uppercase tracking-wide">
//             Catalog
//           </h2>
//           <p className="mt-4 text-base md:text-lg text-gray-300">
//             Because true luxury starts from the floor. Explore our handcrafted
//             collection.
//           </p>
//         </motion.div>

//         {/* Right Half: hidden on mobile, visible on medium screens and up */}
//         <div className="w-1/2 z-10 hidden md:block" />
//       </motion.div>
//     </div>
//   );
// }

"use client"
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function CatalogHeader() {
  return (
    <div className="relative w-full" style={{ aspectRatio: "16/7" }}>
      {/* Full-bleed background image */}
      <Image
        src="/catalog/cataheader.webp"
        alt="Indian hand-tufted carpet in a luxury interior"
        fill
        className="object-cover object-center"
        priority
      />

      {/* Gradient scrim — stronger on left for text, fades to transparent right */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to right, rgba(10,8,6,0.82) 0%, rgba(10,8,6,0.55) 45%, rgba(10,8,6,0.08) 100%)",
        }}
      />

      {/* Subtle bottom fade for page blending */}
      <div
        className="absolute inset-x-0 bottom-0 h-24"
        style={{
          background: "linear-gradient(to bottom, transparent, rgba(10,8,6,0.35))",
        }}
      />

      {/* Back button */}
      <Link
        href="/"
        aria-label="Back to Home"
        className="absolute top-6 left-6 z-20 flex items-center gap-2 text-white/70 hover:text-white transition-colors duration-200 group"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        <span className="text-sm tracking-widest uppercase">Home</span>
      </Link>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
        className="absolute inset-0 z-10 flex flex-col justify-center px-10 md:px-16 lg:px-24 max-w-2xl"
      >
        {/* Eyebrow */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-xs md:text-sm tracking-[0.3em] uppercase text-[#e5c07b] mb-4 font-medium"
        >
          Indian Tufted Carpets
        </motion.p>

        {/* Main heading */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35 }}
          className="text-5xl md:text-6xl lg:text-7xl font-bold uppercase tracking-widest text-white leading-none mb-5"
        >
          Catalog
        </motion.h1>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="w-14 h-[2px] bg-[#b08d57] mb-6 origin-left"
        />

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="text-base md:text-lg text-white/65 leading-relaxed max-w-sm"
        >
          Because true luxury starts from the floor. Explore our handcrafted collection.
        </motion.p>
      </motion.div>
    </div>
  );
}