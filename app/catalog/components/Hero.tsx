"use client"
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Catalog() {
  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center p-4" // Added padding for smaller screens
      style={{ backgroundImage: "url('/catalog/potBg.jpg')" }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="relative w-full max-w-screen-xl h-[min(75vh,900px)] flex items-stretch overflow-hidden rounded-lg shadow-xl" // Responsive height
      >
        {/* Background Carpet Image (Updated) */}
        <Image
          src="/catalog/cata2.jpeg"
          alt="A close-up of a richly textured, traditional Indian carpet" // More descriptive alt text
          fill // ✅ Modern 'fill' prop
          className="z-0 object-cover" // ✅ Modern 'object-cover' class
        />

        {/* Left Overlay with Text */}
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          // Cleaned up background classes: uses background color with opacity
          className="w-full md:w-1/2 relative z-10 bg-[#1c1b1b82] bg-opacity-70 text-white flex flex-col justify-center p-6 md:p-10"
        >
          <Link
            href="/"
            className="absolute top-6 left-6 text-white hover:text-gray-300 transition"
            aria-label="Back to Home" // Added aria-label for accessibility
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </Link>

          {/* ✅ Correct semantic structure for headings */}
          <h1 className="text-4xl md:text-5xl font-bold uppercase tracking-widest">
            Indian Tufted Carpets
          </h1>
          <h2 className="mt-4 text-2xl font-bold uppercase tracking-wide">
            Catalog
          </h2>
          <p className="mt-4 text-base md:text-lg text-gray-300">
            Traditional artistry meets modern aesthetics. Explore our handcrafted
            collection.
          </p>
        </motion.div>

        {/* Right Half: hidden on mobile, visible on medium screens and up */}
        <div className="w-1/2 z-10 hidden md:block" />
      </motion.div>
    </div>
  );
}