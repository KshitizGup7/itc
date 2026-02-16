// components/Woven.tsx
"use client"
import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const tuftedProducts = [
  {
    name: "Ornate Vine",
    code: "ITC-HK-001",
    image: "/final/prod4.webp",
    imagehover: "/final/prod4Fold.webp",
    quality: "Hand Knotted",
    description: "Traditional floral vine pattern in soft grey tones on an ivory base, suitable for hospitality and residential programs requiring neutral, versatile designs."
  },
  {
    name: "Pebble Flow Black & Ivory",
    code:"ITC-HK-002",
    image: "/final/prod5.webp",
    imagehover: "/final/prod5In.webp",
    quality: "Hand Knotted",
    description: "Contemporary abstract pattern featuring fluid pebble motifs with high contrast, ideal for modern retail and urban interior collections."
  },
  {
    name: "Heritage Bloom Beige",
    code: "ITC-HW-001",
    image: "/final/prod6.webp",
    imagehover: "/final/prod6.webp",
    quality: "Hand Woven",
    description: "Timeless floral layout with refined detailing and neutral colour palette, designed for classic and transitional interior ranges."
  },
  {
    name: "Linear Foliage",
    code: "ITC-HK-003",
    image: "/final/prod0.webp",
    imagehover: "/final/prod0In.webp",
    quality: "Hand Knotted",
    description: "Minimal leaf-outline pattern in monochrome tones, developed for contemporary and high-contrast interior programs."
  },
  {
    name: "Tropical Crest",
    code: "ITC-HT-001",
    image: "/final/prod1.webp",
    imagehover: "/final/prod1In.webp",
    quality: "Hand Tufted",
    description: "Bold botanical-inspired design with warm accent tones, suitable for statement collections and design-led retail segments."
  },
  {
    name: "Ivy Noir",
    code: "ITC-HK-004",
    image: "/final/prod3.webp",
    imagehover: "/final/prod3Fold.webp",
    quality: "Hand Knotted",
    description: "Subtle vine pattern on a dark base with textured detailing, suited for premium and boutique interior offerings."
  },
  {
    name: "Abstract Bark",
    code: "ITC-HT-002",
    image: "/final/prod7.webp",
    imagehover: "/final/prod7In.webp",
    quality: "Hand Tufted",
    description: "Nature-inspired abstract pattern with layered tonal depth, developed for contemporary contract and residential use."
  },
  {
    name: "Urban Frame",
    code: "ITC-HT-003",
    image: "/final/prod8.webp",
    imagehover: "/final/prod8Fold.webp",
    quality: "Hand Tufted",
    description: "Structured geometric layout in muted neutral tones, designed for modern interior collections and large-scale export programs."
  },
  {
    name: "Silk Texture",
    code: "ITC-HT-004",
    image: "/final/prod9.webp",
    imagehover: "/final/prod9Fold.webp",
    quality: "Hand Tufted Silk",
    description: "A modern twist on timeless weaving techniques."
  },
];

const Tufted = () => {
  return (
    <section className="bg-cover bg-center py-20 px-4 md:px-16 bg-gradient-to-b from-[#1b2121] via-[#373b3c] to-[#181d20]">
      <div className="text-center mb-16">
      <h2 className="text-4xl md:text-5xl font-semibold tracking-wider text-[#f0d1a2]">
        Hand Crafted Collection Overview
      </h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-16">
        
        {tuftedProducts.map((product, idx) => (
          <div key={idx} className="group">

            {/* Image Container */}
            <div className="relative overflow-hidden rounded-xl shadow-xl transition-all duration-500 aspect-[3/4] hover:shadow-2xl">

              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover transition-opacity duration-500 group-hover:opacity-0"
              />

              <Image
                src={product.imagehover}
                alt={product.name}
                fill
                className="absolute inset-0 object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              />

              {/* Hover Overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-white px-6 text-center space-y-3"
              >
                <h3 className="text-xl font-semibold tracking-wide">
                  {product.name}
                </h3>

                <p className="text-sm opacity-90">
                  {product.description}
                </p>

                <p className="text-xs uppercase tracking-widest text-[#d4b06a] mt-2">
                  {product.quality}
                </p>
              </motion.div>

            </div>

            {/* Bottom Code Section */}
            <div className="mt-5 text-center space-y-2">

              <p className="text-[#b08d57] text-lg md:text-xl tracking-wider">
                {product.code}
              </p>
            </div>

          </div>
        ))}

      </div>

    </section>
  );
};

export default Tufted;