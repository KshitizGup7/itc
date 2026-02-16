"use client"
import React from "react";
import Image from "next/image";

const wovenProducts = [
  {
    name: "Elegant Woven Carpet",
    image: "/final/prod7.webp",
    imagehover: "/final/prod7In.webp",
    description: "Handcrafted with premium wool and intricate patterns."
  },
  {
    name: "Classic Heritage Woven",
    image: "/final/prod8.webp",
    imagehover: "/final/prod8Fold.webp",
    description: "Inspired by traditional designs, perfect for cozy spaces."
  },
  {
    name: "Contemporary Woven",
    image: "/final/prod9.webp",
    imagehover: "/final/prod9Fold.webp",
    description: "A modern twist on timeless weaving techniques."
  },
];

const Woven = () => {
  return (
    <section className="bg-cover bg-center py-12 px-4 md:px-16 bg-gradient-to-b from-[#181d20] via-[#373b3c] to-[#1b2121]">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {wovenProducts.map((product, idx) => (
          <div
            key={idx}
            className="relative group overflow-hidden rounded-xl shadow-2xl hover:shadow-[0_20px_60px_rgba(0,0,0,0.4)] transition-all duration-500 aspect-[3/4]"
          >
            {/* Default Image */}
            <Image
              src={product.image}
              alt={product.name}
              fill
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
