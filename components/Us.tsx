// "use client";

// import Image from "next/image";
// import { useEffect, useState } from "react";
// import vibe1 from "@/public/assets/yarn.webp";
// import vibe2 from "@/public/assets/color choose.webp";
// import vibe3 from "@/public/assets/dying.webp";
// import vibe4 from "@/public/assets/tufting.webp";
// import vibe5 from "@/public/assets/looming.webp";
// import vibe6 from "@/public/assets/final0.webp";
// import {
//   Carousel,
//   CarouselContent,
//   CarouselItem,
//   CarouselNext,
//   CarouselPrevious,
// } from "@/components/ui/carousel";

// const features = [
//   {
//     title: "Heritage Craftsmanship",
//     description:
//       "Collective experience of many years, spanning from yarn manufacturing to carpet weaving",
//   },
//   {
//     title: "Premium Quality",
//     description:
//       "Product quality and customer satisfaction are inseparable assets guaranteed by our company",
//   },
//   {
//     title: "Expert Innovation",
//     description:
//       "An expert source of ideas for producing magnificent carpets with creativity and precision",
//   },
//   {
//     title: "Not Carpet But Art",
//     description:
//       "We bring craftsmanship, precision, and timeless elegance to every piece we make.",
//   },
// ];

// const slides = [
//   {
//     image: vibe1,
//     title: "The Foundation of Every Creation YARN",
//   },
//   {
//     image: vibe2,
//     title: "Curating the Palette of Tradition POMBOX",
//   },
//   {
//     image: vibe3,
//     title: "Colour, Crafted With Care DYING",
//   },
//   {
//     image: vibe4,
//     title: "Hands That Weave Generations of Skill TUFTING",
//   },
//   {
//     image: vibe5,
//     title: "Precision Woven Into Every Pattern LOOMING",
//   },
//   {
//     image: vibe6,
//     title: "From Bhadohi to the World",
//   },
// ];

// const WhyChooseUs = () => {
//   const [activeIndex, setActiveIndex] = useState(0);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setActiveIndex((prev) => (prev + 1) % slides.length);
//     }, 3000); // Change slide every 3 seconds

//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <section className="py-24 relative overflow-hidden">
//   {/* Soft gradient layer */}
//   <div className="absolute inset-0 bg-gradient-to-b from-[#f5f1e8] via-[#f0e3cb] to-[#f5f1e8] -z-20" />

//   {/* Subtle texture overlay */}
//   <div
//     className="absolute inset-0 opacity-10 -z-10"
//     style={{
//       backgroundImage: `url("/assets/paper.jpg")`,
//       backgroundRepeat: "repeat",
//       backgroundSize: "300px",
//     }}
//   />
//       <div className="container mx-auto text-center max-w-5xl">
//         <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-[#4b3621]">
//           Weaving Magic of Creativity
//         </h2>
//         <div className="w-24 h-1 bg-gradient-to-r from-[#b08d57] to-[#e5c07b] mx-auto rounded-full mb-8" />
//         <p className="text-lg md:text-xl text-[#4b3621] mb-16">
//           At Indian Tufted Carpets, we are driven to explore the rich realm of fibre, weave, and colour. Nestled in the heart of Indias carpet-making centre, we masterfully blend timeless techniques with modern innovation to create magnificent carpets that tell stories of heritage and artistry.
//         </p>

//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 max-w-5xl mx-auto">
//           {features.map((feature, index) => (
//             <div
//               key={index}
//               className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-[#e8dcc7] p-8 text-left transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
//             >
//               <h3 className="text-xl font-semibold text-[#644d26] mb-2">
//                 {feature.title}
//               </h3>
//               <p className="text-[#4b3621]">{feature.description}</p>
//             </div>
//           ))}
//         </div>
//       </div>

      

//       <Carousel className="mt-20 relative max-w-[700px] mx-auto" opts={{ loop: true }}>
//         <p className="text-[#7a6645] italic tracking-wide mb-10 text-center">
//         A Journey Through Craftsmanship
//         </p>
//         <CarouselContent
//           style={{
//             transform: `translateX(-${activeIndex * 100}%)`,
//             transition: "transform 0.5s ease-in-out",
//             display: "flex",
//           }}
//         >
//           {slides.map((slide, index) => (
//             <CarouselItem key={index} className="flex justify-center w-full shrink-0 grow-0 basis-full">
//               <div className="relative w-full max-w-[400px] h-[400px] overflow-hidden">
//           <Image 
//             src={slide.image} // Replace with your array of image sources if different
//             alt={slide.title}
//             className="rounded-lg shadow-luxury object-cover w-full h-full"
//             width={400} // Optional: Set explicit width for Next.js Image
//             height={500} // Optional: Set explicit height for Next.js Image
//           />
//           <div className="absolute bottom-6 left-6 bg-black/10 backdrop-blur-sm px-6 py-3 rounded-lg font-semibold text-white tracking-wide">
//             {slide.title}
//           </div>
//         </div>
//             </CarouselItem>
//           ))}
//         </CarouselContent>
//         <CarouselPrevious className="hidden md:flex"/>
//         <CarouselNext className="hidden md:flex" />
//       </Carousel>
//     </section>
//   );
// };

// export default WhyChooseUs;
"use client";

import Image from "next/image";
import { useEffect, useState, useCallback } from "react";
import vibe1 from "@/public/assets/yarn.webp";
import vibe2 from "@/public/assets/color choose.webp";
import vibe3 from "@/public/assets/dying.webp";
import vibe4 from "@/public/assets/tufting.webp";
import vibe5 from "@/public/assets/looming.webp";
import vibe6 from "@/public/assets/final0.webp";

const features = [
  {
    number: "01",
    title: "Heritage Craftsmanship",
    description:
      "Collective experience spanning many years, from yarn manufacturing to carpet weaving — rooted in Bhadohi's legacy.",
  },
  {
    number: "02",
    title: "Premium Quality",
    description:
      "Product quality and customer satisfaction are inseparable assets guaranteed by our company at every step.",
  },
  {
    number: "03",
    title: "Expert Innovation",
    description:
      "An expert source of ideas for producing magnificent carpets, blending creativity with precision techniques.",
  },
  {
    number: "04",
    title: "Not Carpet, But Art",
    description:
      "We bring craftsmanship, precision, and timeless elegance to every piece — each rug tells its own story.",
  },
];

const slides = [
  { image: vibe1, label: "YARN", title: "The Foundation of Every Creation" },
  { image: vibe2, label: "POMBOX", title: "Curating the Palette of Tradition" },
  { image: vibe3, label: "DYING", title: "Colour, Crafted With Care" },
  { image: vibe4, label: "TUFTING", title: "Hands That Weave Generations of Skill" },
  { image: vibe5, label: "LOOMING", title: "Precision Woven Into Every Pattern" },
  { image: vibe6, label: "FINISHING", title: "From Bhadohi to the World" },
];

const WhyChooseUs = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % slides.length);
  }, []);

  const prev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    if (paused) return;
    const interval = setInterval(next, 3500);
    return () => clearInterval(interval);
  }, [paused, next]);

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#f5f1e8] via-[#f0e3cb] to-[#f5f1e8] -z-20" />
      <div
        className="absolute inset-0 opacity-10 -z-10"
        style={{
          backgroundImage: `url("/assets/paper.jpg")`,
          backgroundRepeat: "repeat",
          backgroundSize: "300px",
        }}
      />

      <div className="container mx-auto px-6 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-[#4b3621]">
            Weaving Magic of Creativity
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-[#b08d57] to-[#e5c07b] mx-auto rounded-full mb-8" />
          <p className="text-base md:text-lg text-[#7a6645] max-w-3xl mx-auto leading-relaxed">
            At Indian Tufted Carpets, we are driven to explore the rich realm of
            fibre, weave, and colour. Nestled in the heart of Indias
            carpet-making centre, we masterfully blend timeless techniques with
            modern innovation to create magnificent carpets that tell stories of
            heritage and artistry.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-24">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group bg-white/80 backdrop-blur-md rounded-2xl border border-[#e8dcc7] p-8 flex gap-6 items-start transition-all duration-400 hover:-translate-y-1 hover:shadow-xl hover:border-[#b08d57]"
            >
              <span className="text-3xl font-bold text-[#e5c07b] leading-none mt-1 select-none">
                {feature.number}
              </span>
              <div>
                <h3 className="text-lg font-semibold text-[#4b3621] mb-2">
                  {feature.title}
                </h3>
                <p className="text-[#7a6645] text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Carousel */}
        <div className="text-center mb-10">
          <p className="text-xs uppercase tracking-[0.3em] text-[#b08d57] mb-2">
            Our Process
          </p>
          <h3 className="text-2xl md:text-3xl font-bold text-[#4b3621]">
            A Journey Through Craftsmanship
          </h3>
        </div>

        <div
          className="relative max-w-[480px] mx-auto"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* Slide */}
          <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl"
            style={{ aspectRatio: "4/5" }}>
            {slides.map((slide, index) => (
              <div
                key={index}
                className="absolute inset-0 transition-opacity duration-700"
                style={{ opacity: index === activeIndex ? 1 : 0 }}
              >
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  className="object-cover"
                  priority={index === 0}
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                {/* Text */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <p className="text-xs uppercase tracking-[0.3em] text-[#e5c07b] mb-1">
                    {slide.label}
                  </p>
                  <p className="text-white text-lg font-semibold leading-snug">
                    {slide.title}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between mt-6 px-1">
            {/* Prev / Next */}
            <div className="flex gap-3">
              <button
                onClick={prev}
                className="w-10 h-10 rounded-full border border-[#e8dcc7] bg-white/80 flex items-center justify-center text-[#4b3621] hover:bg-[#4b3621] hover:text-white hover:border-[#4b3621] transition-all duration-200"
                aria-label="Previous slide"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={next}
                className="w-10 h-10 rounded-full border border-[#e8dcc7] bg-white/80 flex items-center justify-center text-[#4b3621] hover:bg-[#4b3621] hover:text-white hover:border-[#4b3621] transition-all duration-200"
                aria-label="Next slide"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Dot indicators */}
            <div className="flex gap-2">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  className="transition-all duration-300 rounded-full"
                  style={{
                    width: i === activeIndex ? "24px" : "8px",
                    height: "8px",
                    background: i === activeIndex ? "#b08d57" : "#e8dcc7",
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;