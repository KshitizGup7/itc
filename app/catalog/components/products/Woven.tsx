"use client"
import React from "react";
import Image from "next/image";

const wovenProducts = [
  {
    name: "Elegant Woven Carpet",
    image: "/productImg/arevikaFull.jpeg",
    imagehover: "/productImg/arevikaText.jpeg",
    description: "Handcrafted with premium wool and intricate patterns."
  },
  {
    name: "Classic Heritage Woven",
    image: "/productImg/gasogaFull.jpeg",
    imagehover: "/productImg/gasogaText.jpeg",
    description: "Inspired by traditional designs, perfect for cozy spaces."
  },
  {
    name: "Contemporary Woven",
    image: "/productImg/riveraFull.jpeg",
    imagehover: "/productImg/riveraText.jpeg",
    description: "A modern twist on timeless weaving techniques."
  },
];

const Woven = () => {
  return (
    <section className="bg-cover bg-center py-12 px-4 md:px-16 bg-gradient-to-b from-[#181d20] via-[#373b3c] to-[#1b2121]">
      <h2 className="text-4xl font-bold text-center text-[#f9f9f9] uppercase mb-10 tracking-wider">
        Woven Collection
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {wovenProducts.map((product, idx) => (
          <div
            key={idx}
            className="relative group overflow-hidden rounded-lg shadow-lg"
          >
            {/* Default Image */}
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

            {/* Text Overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-black/40">
              <h3 className="text-xl font-semibold">{product.name}</h3>
              <p className="mt-2 text-sm">{product.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Woven;
