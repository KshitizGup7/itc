// components/Woven.tsx
"use client"
import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const tuftedProducts = [
  {
    name: "Riverstone Path Tufted",
    image: "/productImg/1988.png",
    imagehover: "/productImg/tufted1Text.jpg",
    description: "A bold, graphic statement featuring organic, riverstone-like shapes that create a stunning visual contrast."
  },
  {
    name: "Deco Dream Tufted",
    image: "/productImg/tufted1.jpg",
    imagehover: "/productImg/tufted1Text.jpg",
    description: "Subtle elegance with a carved, high-low pile that accentuates its art deco-inspired geometric pattern."
  },
  {
    name: "Terra Block Tufted",
    image: "/productImg/tufted2.jpeg",
    imagehover: "/productImg/tufted1Text.jpg",
    description: "A minimalist design of interlocking blocks in serene, earthy tones, perfect for modern living spaces."
  },
];

const Tufted = () => {
  return (
    <section className="bg-cover bg-center py-20 px-4 md:px-16 bg-gradient-to-b from-[#1b2121] via-[#373b3c] to-[#181d20]" // Added padding for smaller screens
     >
      <h2 className="text-4xl font-bold text-center text-[#f9f9f9] uppercase mb-10 tracking-wider">
        Hand Tufted Collection
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {tuftedProducts.map((product, idx) => (
          <div key={idx} className="relative group overflow-hidden rounded-lg shadow-lg">
            <Image
                          src={product.image}
                          alt={product.name}
                          width={500}
                          height={500}
                          className="object-cover w-full transition-opacity duration-500 group-hover:opacity-0"
                        />
                        {/* Hover Image */}
                        <Image
                          src={product.imagehover}
                          alt={product.name}
                          width={500}
                          height={500}
                          className="object-cover w-full h-full absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 object-center"
                        />
            <motion.div
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 bg-[#0000008a] bg-opacity-60 flex flex-col items-center justify-center text-white p-6 text-center"
            >
              <h3 className="text-xl font-semibold">{product.name}</h3>
              <p className="mt-2 text-sm">{product.description}</p>
            </motion.div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Tufted;
