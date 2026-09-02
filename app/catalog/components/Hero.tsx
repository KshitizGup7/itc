// "use client"
// import Link from "next/link";
// import { motion } from "framer-motion";

// export default function CatalogHeader() {
//   return (
//     <div className="relative w-full" style={{ aspectRatio: "16/7" }}>
//       {/* Full-bleed background video */}
//       <video
//         autoPlay
//         loop
//         muted
//         playsInline
//         preload="auto"
//         className="absolute inset-0 w-full h-full object-cover object-center"
//       >
//         <source src="/catalog/finalcata.webm" type="video/webm" />
//         {/* <source src="/catalog/cataheader.mp4" type="video/mp4" /> */}
//       </video>

//       {/* Gradient scrim — stronger on left for text, fades to transparent right */}
//       <div
//         className="absolute inset-0"
//         style={{
//           background:
//             "linear-gradient(to right, rgba(10,8,6,0.82) 0%, rgba(10,8,6,0.55) 45%, rgba(10,8,6,0.08) 100%)",
//         }}
//       />

//       {/* Subtle bottom fade for page blending */}
//       <div
//         className="absolute inset-x-0 bottom-0 h-24"
//         style={{
//           background: "linear-gradient(to bottom, transparent, rgba(10,8,6,0.35))",
//         }}
//       />

//       {/* Back button */}
//       <Link
//         href="/"
//         aria-label="Back to Home"
//         className="absolute top-6 left-6 z-20 flex items-center gap-2 text-white/70 hover:text-white transition-colors duration-200 group"
//       >
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5"
//           fill="none"
//           viewBox="0 0 24 24"
//           stroke="currentColor"
//           strokeWidth={2}
//         >
//           <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
//         </svg>
//         <span className="text-sm tracking-widest uppercase">Home</span>
//       </Link>

//       {/* Content */}
//       <motion.div
//         initial={{ opacity: 0, x: -40 }}
//         animate={{ opacity: 1, x: 0 }}
//         transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
//         className="absolute inset-0 z-10 flex flex-col justify-center px-10 md:px-16 lg:px-24 max-w-2xl"
//       >
//         {/* Eyebrow */}
//         <motion.p
//           initial={{ opacity: 0, y: 10 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.7, delay: 0.2 }}
//           className="text-xs md:text-sm tracking-[0.3em] uppercase text-[#e5c07b] mb-4 font-medium"
//         >
//           Indian Tufted Carpets
//         </motion.p>

//         {/* Main heading */}
//         <motion.h1
//           initial={{ opacity: 0, y: 16 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.8, delay: 0.35 }}
//           className="text-5xl md:text-6xl lg:text-7xl font-bold uppercase tracking-widest text-white leading-none mb-5"
//         >
//           Catalog
//         </motion.h1>

//         {/* Divider */}
//         <motion.div
//           initial={{ scaleX: 0, opacity: 0 }}
//           animate={{ scaleX: 1, opacity: 1 }}
//           transition={{ duration: 0.6, delay: 0.5 }}
//           className="w-14 h-[2px] bg-[#b08d57] mb-6 origin-left"
//         />

//         {/* Tagline */}
//         <motion.p
//           initial={{ opacity: 0, y: 10 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.7, delay: 0.6 }}
//           className="text-base md:text-lg text-white/65 leading-relaxed max-w-sm"
//         >
//           Because true luxury starts from the floor. Explore our handcrafted collection.
//         </motion.p>
//       </motion.div>
//     </div>
//   );
// }

"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function CatalogHeader() {
  return (
    <div
      className="
        relative w-full overflow-hidden
        h-[360px]
        sm:h-[420px]
        md:h-auto md:aspect-[16/7]
      "
    >
      {/* Background video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="
          absolute inset-0
          w-full h-full
          object-cover
          object-[58%_center]
          md:object-center
        "
      >
        <source src="/catalog/finalcata.webm" type="video/webm" />
      </video>

      {/* Dark cinematic scrim */}
      <div
        className="
          absolute inset-0
          bg-gradient-to-r
          from-black/80
          via-black/45
          to-black/10
        "
      />

      {/* Bottom fade */}
      <div
        className="
          absolute inset-x-0 bottom-0
          h-24
          bg-gradient-to-b
          from-transparent
          to-[#141918]/60
        "
      />

      {/* Back */}
      <Link
        href="/"
        aria-label="Back to Home"
        className="
          absolute top-4 left-4
          sm:top-6 sm:left-6
          z-20
          flex items-center gap-2
          text-white/70
          hover:text-white
          transition-colors duration-200
          group
        "
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="
            h-3.5 w-3.5
            sm:h-4 sm:w-4
            transition-transform duration-200
            group-hover:-translate-x-0.5
          "
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.8}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 19l-7-7 7-7"
          />
        </svg>

        <span className="text-[10px] sm:text-xs tracking-[0.25em] uppercase">
          Home
        </span>
      </Link>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, x: -25 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
        className="
          absolute inset-0 z-10
          flex flex-col justify-center
          px-6
          sm:px-10
          md:px-16
          lg:px-24
          max-w-3xl
        "
      >
        {/* Eyebrow */}
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="
            text-[9px]
            sm:text-xs
            md:text-sm
            tracking-[0.28em]
            sm:tracking-[0.3em]
            uppercase
            text-[#C8BFB2]
            mb-3
            sm:mb-4
            font-medium
          "
        >
          Indian Tufted Carpets
        </motion.p>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35 }}
          className="
            text-[42px]
            leading-[0.9]
            sm:text-5xl
            md:text-6xl
            lg:text-7xl
            font-bold
            uppercase
            tracking-[0.08em]
            md:tracking-widest
            text-white
            mb-4
            sm:mb-5
          "
        >
          Catalog
        </motion.h1>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="
            w-10
            sm:w-14
            h-px
            bg-[#A69F94]
            mb-4
            sm:mb-6
            origin-left
          "
        />

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="
            text-sm
            sm:text-base
            md:text-lg
            text-white/65
            leading-relaxed
            max-w-[290px]
            sm:max-w-sm
          "
        >
          Because true luxury starts from the floor. Explore our handcrafted
          collection.
        </motion.p>
      </motion.div>
    </div>
  );
}