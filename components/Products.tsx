
// "use client";

// import { useEffect } from "react";
// import AOS from "aos";

// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import Image from "next/image";
// import { redirect } from "next/navigation";
// import { Button } from "@/components/ui/button";

// const Products = () => {
//   useEffect(() => {
//     AOS.init({ duration: 800, once: false });
//   }, []);

//   const CatalogClick = () => {
//     redirect("/catalog");
//   };

//   const services = [
//     {
//       title: "Hand Tufted Carpets",
//       image: "/assets/products/BLUE.webp",
//       hover: "/assets/products/BLUEFOLD.webp",
//       bgLifestyle: "/catalog/handtufted.webp", // ← swap to your actual path
//       description:
//         "High-quality hand-tufted carpets manufactured with precision and consistency to meet international standards.",
//       features: ["Custom Designs", "Premium Wool & Blends", "Various Sizes"],
//       hasHeroBg: true,
//     },
//     {
//       title: "Silk & Jute Carpets",
//       image: "/assets/products/DAMSILK.webp",
//       hover: "/assets/products/SILKFOLD.webp",
//       bgLifestyle: "/catalog/DAMBLUEROOM.webp",
//       description:
//         "Silk and jute carpets combining natural fibres with durable construction for commercial and residential applications.",
//       features: [
//         "Natural Fibre Compositions",
//         "Durable Construction",
//         "Custom Colour Matching",
//       ],
//       hasHeroBg: true,
//     },
//     {
//       title: "Hand Knotted Rugs",
//       image: "/assets/products/DAMSAK.webp",
//       hover: "/assets/products/DAMSAKFOLD.webp",
//       bgLifestyle: "/catalog/handknotted.webp", // ← swap to your actual path
//       description:
//         "Hand-knotted rugs crafted using traditional techniques with strict quality control and detailed finishing.",
//       features: ["High Knot Density", "Intricate Patterns", "Heirloom Quality"],
//       hasHeroBg: true,
//     },
//     {
//       title: "Custom Rugs",
//       image: "/assets/products/FLORAL.webp",
//       hover: "/assets/products/FLORAL.webp",
//       bgLifestyle: "/catalog/FLORALROOM.webp",
//       description:
//         "Made-to-order rugs developed according to client specifications, suitable for small-scale orders.",
//       features: ["Tailored Solutions", "Quality Assurance", "Private Label"],
//       hasHeroBg: true,
//     },
//   ];

//   return (
//     <section className="py-28 relative overflow-hidden">
//       {/* Luxury gradient base */}
//       <div className="absolute inset-0 bg-gradient-to-b from-[#f6f1e8] via-[#f1e5d1] to-[#f8f3ea] -z-20" />
//       {/* Subtle texture overlay */}
//       <div
//         className="absolute inset-0 -z-10"
//         style={{
//           backgroundImage: `url("/assets/paper.jpg")`,
//           backgroundRepeat: "repeat",
//           backgroundSize: "300px",
//         }}
//       />

//       <div className="container mx-auto px-6">
//         {/* Header */}
//         <div className="text-center mb-16" data-aos="fade-up">
//           <h2 className="text-5xl md:text-6xl font-semibold tracking-wide text-[#644d26] mb-6">
//             Our Product Range
//           </h2>
//           <div className="w-24 h-1 bg-gradient-to-r from-[#b08d57] to-[#e5c07b] mx-auto mt-6 rounded-full" />
//           <p className="text-lg text-[#a4834f] max-w-3xl mx-auto">
//             From hand-tufted carpets to hand-woven rugs and custom mats, we
//             offer a comprehensive range of premium textile products that embody
//             excellence and tradition.
//           </p>
//         </div>

//         {/* Products */}
//         <div className="space-y-24 mb-16">
//           {services.map((service, index) =>
//             service.hasHeroBg ? (
//               // ── HERO-BG CARD (Tufted & Hand Knotted) ──
//               <div
//                 key={index}
//                 className="relative w-full rounded-3xl overflow-hidden shadow-2xl"
//                 style={{ minHeight: "480px" }}
//                 data-aos={index % 2 === 0 ? "fade-right" : "fade-left"}
//               >
//                 {/* Full-bleed lifestyle background */}
//                 <div className="absolute inset-0">
//                   <Image
//                     src={service.bgLifestyle!}
//                     alt={`${service.title} lifestyle`}
//                     fill
//                     className="object-cover"
//                   />
//                   {/* Dark scrim so text stays readable */}
//                   <div className="absolute inset-0 bg-black/45" />
//                 </div>

//                 {/* Foreground layout: floating carpet card + text */}
//                 <div className="relative z-10 flex flex-col md:flex-row items-center justify-center gap-10 px-8 py-16 md:py-20">
                  
//                   {/* Floating foreground carpet image */}
//                   <div
//                     className={`relative group flex-shrink-0 w-[260px] md:w-[320px] lg:w-[360px] rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.5)] ${
//                       index % 2 === 1 ? "md:order-2" : ""
//                     }`}
//                     style={{ aspectRatio: "4/5" }}
//                   >
//                     <Image
//                       src={service.image}
//                       alt={service.title}
//                       fill
//                       className="object-cover transition-opacity duration-500 group-hover:opacity-0"
//                     />
//                     <Image
//                       src={service.hover}
//                       alt={`${service.title} hover`}
//                       fill
//                       className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
//                     />
//                   </div>

//                   {/* Text block */}
//                   <div
//                     className={`max-w-md text-white ${
//                       index % 2 === 1 ? "md:order-1" : ""
//                     }`}
//                   >
//                     <h3 className="text-3xl md:text-4xl font-bold uppercase tracking-widest mb-4 drop-shadow-lg">
//                       {service.title}
//                     </h3>
//                     <div className="w-16 h-0.5 bg-[#e5c07b] mb-5 rounded-full" />
//                     <p className="text-gray-200 text-base md:text-lg leading-relaxed mb-6">
//                       {service.description}
//                     </p>
//                     <ul className="space-y-3">
//                       {service.features.map((feature, fi) => (
//                         <li key={fi} className="flex items-center gap-3 text-sm text-gray-100">
//                           <span className="w-2 h-2 rounded-full bg-gradient-to-r from-[#b08d57] to-[#e5c07b] flex-shrink-0" />
//                           {feature}
//                         </li>
//                       ))}
//                     </ul>
//                   </div>
//                 </div>
//               </div>
//             ) : (
//               // ── STANDARD CARD (Silk & Custom) — unchanged ──
//               <div
//                 key={index}
//                 className="grid md:grid-cols-2 gap-x-12 gap-y-10 items-center"
//                 data-aos={index % 2 === 0 ? "fade-right" : "fade-left"}
//               >
//                 <div
//                   className={`relative group overflow-hidden rounded-2xl mx-auto
//                     w-full max-w-[90%] sm:max-w-[420px] md:max-w-[460px]
//                     lg:max-w-[500px] xl:max-w-[540px]
//                     ${index % 2 === 1 ? "md:order-2" : ""}`}
//                 >
//                   <Image
//                     src={service.image}
//                     alt={service.title}
//                     className="rounded-2xl shadow-2xl object-cover transition-opacity duration-500 group-hover:opacity-0"
//                     width={500}
//                     height={400}
//                   />
//                   <Image
//                     src={service.hover}
//                     alt={service.title}
//                     fill
//                     className="absolute inset-0 rounded-2xl shadow-2xl object-cover opacity-0 transition-all duration-500 group-hover:opacity-100"
//                   />
//                 </div>

//                 <div className={`${index % 2 === 1 ? "md:order-1" : ""}`}>
//                   <Card className="bg-white/90 backdrop-blur-md border border-[#e8dcc7] rounded-2xl shadow-xl p-2 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">
//                     <CardHeader>
//                       <CardTitle className="text-[#644d26] text-2xl">
//                         {service.title}
//                       </CardTitle>
//                     </CardHeader>
//                     <CardContent>
//                       <p className="text-[#a4834f] mb-4 text-base">
//                         {service.description}
//                       </p>
//                       <ul className="space-y-2 mt-4">
//                         {service.features.map((feature, fi) => (
//                           <li
//                             key={fi}
//                             className="flex items-start text-sm text-muted-foreground"
//                           >
//                             <div className="w-2 h-2 mt-2 bg-gradient-to-r from-[#b08d57] to-[#e5c07b] rounded-full mr-3" />
//                             {feature}
//                           </li>
//                         ))}
//                       </ul>
//                     </CardContent>
//                   </Card>
//                 </div>
//               </div>
//             )
//           )}
//         </div>

//         {/* CTA Section */}
//         <div className="relative bg-gradient-to-r from-[#4b3621] to-[#644d26] rounded-3xl p-16 text-center text-white overflow-hidden">
//           <h3 className="text-2xl font-bold mb-4">Export Excellence</h3>
//           <p className="text-lg max-w-2xl mx-auto">
//             We proudly export our premium carpets and rugs worldwide, bringing
//             the finest Indian craftsmanship to international markets with assured
//             quality and timely delivery. We support international wholesalers,
//             buying houses, and retail brands with scalable production, strict
//             quality control, and timely delivery.
//           </p>
//           <Button
//             size="lg"
//             onClick={CatalogClick}
//             className="mt-8 text-lg px-10 py-5 bg-[#b08d57] hover:bg-[#c69c5d] text-white rounded-full shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer"
//           >
//             Explore Collection
//           </Button>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default Products;

"use client";

import { useEffect } from "react";
import AOS from "aos";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

/* ─────────────────────────────────────────────
   Tiny base-64 blur placeholder (1×1 warm beige)
   Generate per-image with `plaiceholder` in prod
───────────────────────────────────────────── */
const BLUR_PLACEHOLDER =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwADhQGAWjR9awAAAABJRU5ErkJggg==";

const services = [
  {
    title: "Hand Tufted Carpets",
    image: "/assets/products/BLUE.webp",
    hover: "/assets/products/BLUEFOLD.webp",
    bgLifestyle: "/catalog/handtufted.webp",
    description:
      "High-quality hand-tufted carpets manufactured with precision and consistency to meet international standards.",
    features: ["Custom Designs", "Premium Wool & Blends", "Various Sizes"],
  },
  {
    title: "Silk & Jute Carpets",
    image: "/assets/products/DAMSILK.webp",
    hover: "/assets/products/SILKFOLD.webp",
    bgLifestyle: "/catalog/DAMBLUEROOM.webp",
    description:
      "Silk and jute carpets combining natural fibres with durable construction for commercial and residential applications.",
    features: [
      "Natural Fibre Compositions",
      "Durable Construction",
      "Custom Colour Matching",
    ],
  },
  {
    title: "Hand Knotted Rugs",
    image: "/assets/products/DAMSAK.webp",
    hover: "/assets/products/DAMSAKFOLD.webp",
    bgLifestyle: "/catalog/handknotted.webp",
    description:
      "Hand-knotted rugs crafted using traditional techniques with strict quality control and detailed finishing.",
    features: ["High Knot Density", "Intricate Patterns", "Heirloom Quality"],
  },
  {
    title: "Custom Rugs",
    image: "/assets/products/FLORAL.webp",
    hover: "/assets/products/FLORAL.webp",
    bgLifestyle: "/catalog/FLORALROOM.webp",
    description:
      "Made-to-order rugs developed according to client specifications, suitable for small-scale orders.",
    features: ["Tailored Solutions", "Quality Assurance", "Private Label"],
  },
];

/* ─────────────────────────────────────────────
   Preload hidden hover images so first-hover
   doesn't flash a blank frame
───────────────────────────────────────────── */
function HoverPreloader() {
  return (
    <div aria-hidden className="sr-only pointer-events-none select-none">
      {services.map((s) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img key={s.hover} src={s.hover} alt="" />
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────
   HERO-BG card — lifestyle bg + floating carpet
   The carpet image uses object-contain so the
   full rug is always visible, no cropping.
───────────────────────────────────────────── */
function HeroBgCard({
  service,
  index,
}: {
  service: (typeof services)[number];
  index: number;
}) {
  const isOdd = index % 2 === 1;

  return (
    <div
      className="relative w-full rounded-3xl overflow-hidden shadow-2xl"
      style={{ minHeight: 520 }}
      data-aos={isOdd ? "fade-left" : "fade-right"}
    >
      {/* ── Full-bleed lifestyle background ── */}
      <div className="absolute inset-0">
        <Image
          src={service.bgLifestyle}
          alt={`${service.title} lifestyle setting`}
          fill
          sizes="100vw"
          className="object-cover"
          placeholder="blur"
          blurDataURL={BLUR_PLACEHOLDER}
          /* First two cards are likely above-the-fold */
          priority={index < 2}
        />
        {/* Dark scrim */}
        <div className="absolute inset-0 bg-black/45" />
      </div>

      {/* ── Foreground layout ── */}
      <div
        className={`relative z-10 flex flex-col md:flex-row items-center justify-center gap-10 px-8 py-16 md:py-20 ${
          isOdd ? "md:flex-row-reverse" : ""
        }`}
      >
        {/* Floating carpet — object-contain keeps full image */}
        <div
          className="group flex-shrink-0 relative"
          style={{ width: "min(340px, 80vw)", height: "min(440px, 56vw)" }}
        >
          {/* Glow shadow behind the rug */}
          <div className="absolute inset-4 rounded-2xl bg-black/30 blur-2xl -z-10" />

          {/* Default image */}
          <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.55)]">
            <Image
              src={service.image}
              alt={service.title}
              fill
              sizes="(max-width: 640px) 80vw, (max-width: 1024px) 320px, 340px"
              className="object-contain transition-opacity duration-500 group-hover:opacity-0"
              placeholder="blur"
              blurDataURL={BLUR_PLACEHOLDER}
              priority={index < 2}
            />

            {/* Hover image */}
            <Image
              src={service.hover}
              alt={`${service.title} — folded view`}
              fill
              sizes="(max-width: 640px) 80vw, (max-width: 1024px) 320px, 340px"
              className="object-cover absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              placeholder="blur"
              blurDataURL={BLUR_PLACEHOLDER}
            />
          </div>
        </div>

        {/* Text block */}
        <div className="max-w-md text-white">
          <h3 className="text-3xl md:text-4xl font-bold uppercase tracking-widest mb-4 drop-shadow-lg">
            {service.title}
          </h3>
          <div className="w-16 h-0.5 bg-[#e5c07b] mb-5 rounded-full" />
          <p className="text-gray-200 text-base md:text-lg leading-relaxed mb-6">
            {service.description}
          </p>
          <ul className="space-y-3">
            {service.features.map((feature, fi) => (
              <li
                key={fi}
                className="flex items-center gap-3 text-sm text-gray-100"
              >
                <span className="w-2 h-2 rounded-full bg-gradient-to-r from-[#b08d57] to-[#e5c07b] flex-shrink-0" />
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main component
───────────────────────────────────────────── */
const Products = () => {
  const router = useRouter();

  useEffect(() => {
    AOS.init({ duration: 800, once: false });
  }, []);

  return (
    <section className="py-28 relative overflow-hidden">
      {/* Preload all hover images silently */}
      <HoverPreloader />

      {/* Luxury gradient base */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#f6f1e8] via-[#f1e5d1] to-[#f8f3ea] -z-20" />

      {/* Paper texture — next/image can't handle CSS bg, but we keep this
          as a purely decorative overlay. For real perf, convert paper.jpg
          to a webp and reference it here. */}
      <div
        className="absolute inset-0 -z-10 opacity-60"
        style={{
          backgroundImage: `url("/assets/paper.webp")`,
          backgroundRepeat: "repeat",
          backgroundSize: "300px",
        }}
      />

      <div className="container mx-auto px-6">
        {/* ── Header ── */}
        <div className="text-center mb-16" data-aos="fade-up">
          <h2 className="text-5xl md:text-6xl font-semibold tracking-wide text-[#644d26] mb-6">
            Our Product Range
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-[#b08d57] to-[#e5c07b] mx-auto mt-6 rounded-full" />
          <p className="text-lg text-[#a4834f] max-w-3xl mx-auto mt-4">
            From hand-tufted carpets to hand-woven rugs and custom mats, we
            offer a comprehensive range of premium textile products that embody
            excellence and tradition.
          </p>
        </div>

        {/* ── Product cards ── */}
        <div className="space-y-24 mb-16">
          {services.map((service, index) => (
            <HeroBgCard key={service.title} service={service} index={index} />
          ))}
        </div>

        {/* ── CTA ── */}
        <div className="relative bg-gradient-to-r from-[#4b3621] to-[#644d26] rounded-3xl p-16 text-center text-white overflow-hidden">
          <h3 className="text-2xl font-bold mb-4">Export Excellence</h3>
          <p className="text-lg max-w-2xl mx-auto">
            We proudly export our premium carpets and rugs worldwide, bringing
            the finest Indian craftsmanship to international markets with assured
            quality and timely delivery. We support international wholesalers,
            buying houses, and retail brands with scalable production, strict
            quality control, and timely delivery.
          </p>
          <Button
            size="lg"
            onClick={() => router.push("/catalog")}
            className="mt-8 text-lg px-10 py-5 bg-[#b08d57] hover:bg-[#c69c5d] text-white rounded-full shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer"
          >
            Explore Collection
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Products;