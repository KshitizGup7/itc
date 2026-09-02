
"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

/* ─── Data ─────────────────────────────────────────────────────────────── */
const tuftedProducts = [
  {
    name: "Geometric Floral Sage",
    code: "ITC-HT-001",
    image: "/final/prod10.webp",
    imagehover: "/final/prod10fold.webp",
    quality: "Hand Tufted",
    description:
      "A contemporary take on traditional motifs, this rug uses a soft sage green palette. The high-low carving adds subtle texture, making the floral details pop against the angular lines.",
  },
  {
    name: "Pebble Flow Black & Ivory",
    code: "ITC-HT-002",
    image: "/final/prod5.webp",
    imagehover: "/final/prod5In.webp",
    quality: "Hand Tufted",
    description:
      "Contemporary abstract pattern featuring fluid pebble motifs with high contrast, ideal for modern retail and urban interior collections.",
  },
  {
    name: "Heritage Bloom Beige",
    code: "ITC-HW-001",
    image: "/final/prod6.webp",
    imagehover: "/final/prod6.webp",
    quality: "Hand Woven",
    description:
      "Timeless floral layout with refined detailing and neutral colour palette, designed for classic and transitional interior ranges.",
  },
  {
    name: "Linear Foliage",
    code: "ITC-HK-001",
    image: "/final/prod0.webp",
    imagehover: "/final/prod0In.webp",
    quality: "Hand Knotted",
    description:
      "Minimal leaf-outline pattern in monochrome tones, developed for contemporary and high-contrast interior programs.",
  },
  {
    name: "Brushed Leaves",
    code: "ITC-HK-002",
    image: "/final/prod4.webp",
    imagehover: "/final/prod4Fold.webp",
    quality: "Hand Knotted",
    description:
      "Bold botanical-inspired design with warm accent tones, suitable for statement collections and design-led retail segments.",
  },
  {
    name: "Ivy Noir",
    code: "ITC-HK-003",
    image: "/final/prod3.webp",
    imagehover: "/final/prod3Fold.webp",
    quality: "Hand Knotted",
    description:
      "Subtle vine pattern on a dark base with textured detailing, suited for premium and boutique interior offerings.",
  },
  {
    name: "Abstract Terra Expressionist",
    code: "ITC-HT-003",
    image: "/final/prod11.webp",
    imagehover: "/final/prod11fold.webp",
    quality: "Hand Tufted",
    description:
      "This vibrant piece acts as floor art, utilizing an abstract, painterly design. The irregular, organic shapes mimic the look of a weathered mineral deposit or a modern impressionist canvas.",
  },
  {
    name: "Tuscan Floral",
    code: "ITC-HT-004",
    image: "/final/motif2.webp",
    imagehover: "/final/motif2in.webp",
    quality: "Hand Tufted",
    description:
      "Structured geometric layout in muted neutral tones, designed for modern interior collections and large-scale export programs.",
  },
  {
    name: "Silk Texture",
    code: "ITC-HK-004",
    image: "/final/prod9.webp",
    imagehover: "/final/prod9Fold.webp",
    quality: "Hand Knotted Silk",
    description: "A modern twist on timeless weaving techniques.",
  },
  {
    name: "Bubble",
    code: "ITC-HW-002",
    image: "/final/bubble.webp",
    imagehover: "/final/bubblefold.webp",
    quality: "Hand Woven",
    description: "A modern twist on timeless weaving techniques.",
  },
  {
    name: "Abstract Carved",
    code: "ITC-HT-101",
    image: "/final/PURPLE.webp",
    imagehover: "/final/PURPLE.webp",
    quality: "Hand Tufted",
    description: "Inspired by modern art and natural movement, the design creates a dynamic three-dimensional effect that adds depth and character to any room. The soft pastel tones bring a calming, sophisticated ambiance while the textured finish delivers a truly luxurious feel.",
  },
  {
    name: "Smoked Earth",
    code: "ITC-HK-006",
    image: "/final/mix3.webp",
    imagehover: "/final/mix3fold.webp",
    quality: "Hand Knotted",
    description: "Different pile height for different colors giving it a Bold and moody, it brings an industrial-artistic edge to any space.",
  },
  {
    name: "Ashen Drif",
    code: "ITC-HK-007",
    image: "/final/silk2.webp",
    imagehover: "/final/silk2In.webp",
    quality: "Hand Knotted Silk",
    description: "Mde with silk which gives it a faded ghostly texture. Quiet and atmospheric, ideal for minimalist or Scandinavian aesthetics.",
  },
  {
    name: "High-Pile Shag Rug",
    code: "ITC-HT-005",
    image: "/final/HIGH PILE IN.webp",
    imagehover: "/final/HIGH PILE.webp",
    quality: "Hand Tufted",
    description: "Designed to create a cozy and inviting atmosphere, its plush texture adds warmth, depth, and sophistication to any room. Perfect for modern interiors",
  },
  {
    name: "Classic Persian Motifs",
    code: "ITC-HK-1001",
    image: "/final/FLORAL.webp",
    imagehover: "/final/FLORAL IN.webp",
    quality: "Hand Knotted",
    description: "Crafted by skilled artisans, the design blends traditional craftsmanship with a soft, neutral palette, making it a versatile addition to both classic and contemporary spaces.",
  },
  {
    name: "Distorted Grid",
    code: "ITC-HT-1002",
    image: "/final/distorted.webp",
    imagehover: "/final/distorted.webp",
    quality: "Hand Tufted",
    description: "The contrasting textures and neutral color palette create visual interest while maintaining a sophisticated, understated look. Its versatile design complements modern, Scandinavian, and minimalist interiors.",
  },
  {
    name: "Labyrinth",
    code: "ITC-HK-1002",
    image: "/final/Labyrinth.webp",
    imagehover: "/final/Labyrinth.webp",
    quality: "Hand Knotted",
    description: "Inspired by abstract line art and organic pathways, this contemporary rug transforms simple forms into an eye-catching visual composition. The flowing ivory lines contrast beautifully against the deep background",
  },
  {
    name: "Botanical Silhouette",
    code: "ITC-HK-1003",
    image: "/final/silk3.webp",
    imagehover: "/final/silk3.webp",
    quality: "Hand Knotted",
    description: "This elegant rug showcases oversized botanical forms rendered through flowing linear detailing. The sculptural leaf-inspired composition creates a sense of movement and refinement, while the rich contrast between light and dark tones delivers a sophisticated artistic presence.",
  },
  {
    name: "Auric Geometric",
    code: "ITC-HT-1003",
    image: "/final/auric.webp",
    imagehover: "/final/auric.webp",
    quality: "Hand Tufted Viscose",
    description: "Combining soft curves, architectural forms, and warm metallic-inspired accents, this contemporary rug offers a perfect balance of elegance and modernity. The carefully arranged geometric shapes create a sophisticated composition that elevates any interior.",
  },
    {
    name: "Whisper Organic Flow",
    code: "ITC-HT-1004",
    image: "/final/wishper.webp",
    imagehover: "/final/wishper.webp",
    quality: "Hand Tufted Viscose",
    description: "Combining soft curves, architectural forms, and warm metallic-inspired accents, this contemporary rug offers a perfect balance of elegance and modernity. The carefully arranged geometric shapes create a sophisticated composition that elevates any interior.",
  },
   {
    name: "Copper Vein Marble",
    code: "ITC-HT-1005",
    image: "/final/viscose.jpg",
    imagehover: "/final/viscose.jpg",
    quality: "Hand Tufted Viscose",
    description: "Bring a sense of refined luxury to your interiors with this striking marble-inspired rug. Featuring intricate vein-like patterns flowing across a rich copper-toned background, the design captures the elegance of rare natural stone while adding warmth and character to any space.",
  },
];

/* Derive unique filter tags */
const ALL = "All";
const filterTags = [
  ALL,
  ...Array.from(new Set(tuftedProducts.map((p) => p.quality))),
];

/* Quality badge colour map */
const badgeColor: Record<string, string> = {
  "Hand Tufted": "bg-[#A67C52]/20 text-[#D8B98A] border-[#A67C52]/40",

"Hand Knotted": "bg-[#536B5B]/20 text-[#A9BCA8] border-[#536B5B]/40",

"Hand Woven": "bg-[#62556F]/20 text-[#B9A9C9] border-[#62556F]/40",

"Hand Knotted Silk": "bg-[#7A4E5D]/20 text-[#C9A0AA] border-[#7A4E5D]/40",
};

/* ─── Card ──────────────────────────────────────────────────────────────── */
function ProductCard({
  product,
  index,
}: {
  product: (typeof tuftedProducts)[number];
  index: number;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.45, delay: (index % 9) * 0.06, ease: "easeOut" }}
      className="group flex flex-col"
    >
      {/* ── Image panel ── */}
      <div className="relative overflow-hidden rounded-2xl aspect-[3/4] shadow-lg shadow-black/40">
        {/* Default image */}
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-opacity duration-500 group-hover:opacity-0"
        />

        {/* Hover image */}
        <Image
          src={product.imagehover}
          alt={`${product.name} — folded`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="absolute inset-0 object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        />

        {/* Hover overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/90 via-black/50 to-transparent px-6 pb-8 pt-16"
        >
          {/* Quality badge */}
          <span
            className={`self-start mb-3 px-3 py-1 text-[10px] uppercase tracking-[0.2em] rounded-full border font-medium ${
              badgeColor[product.quality] ??
              "bg-white/10 text-white/80 border-white/20"
            }`}
          >
            {product.quality}
          </span>

          <h3 className="text-white text-lg font-semibold tracking-wide leading-snug mb-2">
            {product.name}
          </h3>

          <p className="text-white/75 text-sm leading-relaxed line-clamp-4">
            {product.description}
          </p>
        </motion.div>

        {/* Corner accent — top right */}
        <div className="absolute top-0 right-0 w-12 h-12 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-0 h-0 border-t-[48px] border-t-[#c69c5d]/25 border-l-[48px] border-l-transparent" />
        </div>
      </div>

      {/* ── Below-card info ── */}
      <div className="mt-4 flex items-center justify-between px-1">
        <p className="text-[#e0c080] text-sm tracking-[0.15em] font-mono">
          {product.code}
        </p>
        <span
          className={`px-2.5 py-0.5 text-[10px] uppercase tracking-widest rounded-full border ${
            badgeColor[product.quality] ??
            "bg-white/10 text-white/70 border-white/20"
          }`}
        >
          {product.quality}
        </span>
      </div>
    </motion.div>
  );
}

/* ─── Section ───────────────────────────────────────────────────────────── */
const Tufted = () => {
  const [activeFilter, setActiveFilter] = useState(ALL);

  const filtered =
    activeFilter === ALL
      ? tuftedProducts
      : tuftedProducts.filter((p) => p.quality === activeFilter);

  return (
    <section
  className="
    relative
    min-h-screen
    py-14
    sm:py-18
    md:py-24
    px-4
    sm:px-6
    md:px-10
    lg:px-16
    overflow-hidden
  "
>
      {/* ── Background ── */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#141918] via-[#1e2422] to-[#111615] -z-20" />

      {/* Subtle grain overlay */}
      <div
        className="absolute inset-0 -z-10 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "180px",
        }}
      />

      {/* Ambient glow top-center */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#b08d57]/8 blur-[100px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-6"
        >
          {/* Eyebrow */}
          <p className="text-[#eee9e2] text-xs uppercase tracking-[0.35em] mb-4 font-medium">
  Handcrafted in India · Export Ready
</p>

{/* Decorative rule */}
<div className="flex items-center justify-center gap-4 mt-6 mb-4">
  <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#756F66]" />
  <div className="w-1.5 h-1.5 rounded-full bg-[#A69F94]" />
  <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#756F66]" />
</div>

<p className="text-[#9A948B] text-sm md:text-base max-w-xl mx-auto leading-relaxed">
  Each piece is individually crafted — no two rugs are identical.
  Browse by technique or explore the full range.
</p>
        </motion.div>

        {/* ── Filter tabs ── */}
        <motion.div
  initial={{ opacity: 0, y: 12 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, delay: 0.2 }}
  className="hidden md:flex flex-wrap justify-center gap-2 mb-14"
>
  {filterTags.map((tag) => (
    <button
      key={tag}
      onClick={() => setActiveFilter(tag)}
      className={`px-5 py-2 text-xs uppercase tracking-[0.18em] rounded-full border transition-all duration-300 cursor-pointer ${
        activeFilter === tag
          ? "bg-[#E8E3DA] border-[#E8E3DA] text-[#1C1B19] font-semibold"
          : "bg-transparent border-[#625E58] text-[#A7A198] hover:border-[#9A948B] hover:text-[#D0CAC0]"
      }`}
    >
      {tag}
    </button>
  ))}
</motion.div>

        {/* ── Count indicator ── */}
        <div className="text-right mb-6 pr-1">
          <span className="text-[#5a4a38] text-xs tracking-widest uppercase">
            {filtered.length} piece{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* ── Grid ── */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-7 gap-y-14">
          <AnimatePresence mode="popLayout">
            {filtered.map((product, idx) => (
              <ProductCard key={product.code} product={product} index={idx} />
            ))}
          </AnimatePresence>
        </motion.div>

      </div>
    </section>
  );
};

export default Tufted;