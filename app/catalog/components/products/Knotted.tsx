// components/Woven.tsx
"use client"
import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const knottedProducts = [
  {
    name: "Golden Geometry Knot",
    image: "/productImg/knottedFull.jpg",
    imagehover: "/productImg/knottedText.webp",
    description: "Inspired by modern architecture, this rug features a striking grid of golden ochre and cream, a true statement piece."
  },
  {
    name: "Sunburst Knot",
    image: "/productImg/knottedFull1.jpg",
    imagehover: "/productImg/knottedText1.jpg",
    description: "A dramatic centerpiece with a powerful sunburst motif, featuring metallic hues that capture and reflect light."
  },
  {
    name: "Canopy Knot",
    image: "/productImg/knottedFull2.jpg",
    imagehover: "/productImg/knottedFull2.jpg",
    description: "An intricate, nature-inspired design that mimics the delicate canopy of a winter forest, hand-knotted to perfection."
  },
];

const Knotted = () => {
  return (
    <section className="bg-cover bg-center py-12 px-4 md:px-16 bg-gradient-to-b from-[#181d20] via-[#373b3c] to-[#1b2121]" // Added padding for smaller screens
     >
      <h2 className="text-4xl font-bold text-center text-[#f9f9f9] uppercase mb-10 tracking-wider">
        Hand Knotted Collection
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {knottedProducts.map((product, idx) => (
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

export default Knotted;
