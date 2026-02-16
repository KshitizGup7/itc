"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import vibe1 from "@/public/assets/yarn.webp";
import vibe2 from "@/public/assets/color choose.webp";
import vibe3 from "@/public/assets/dying.webp";
import vibe4 from "@/public/assets/tufting.webp";
import vibe5 from "@/public/assets/looming.webp";
import vibe6 from "@/public/assets/final0.webp";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const features = [
  {
    title: "Heritage Craftsmanship",
    description:
      "Collective experience of many years, spanning from yarn manufacturing to carpet weaving",
  },
  {
    title: "Premium Quality",
    description:
      "Product quality and customer satisfaction are inseparable assets guaranteed by our company",
  },
  {
    title: "Expert Innovation",
    description:
      "An expert source of ideas for producing magnificent carpets with creativity and precision",
  },
  {
    title: "Not Carpet But Art",
    description:
      "We bring craftsmanship, precision, and timeless elegance to every piece we make.",
  },
];

const slides = [
  {
    image: vibe1,
    title: "The Foundation of Every Creation YARN",
  },
  {
    image: vibe2,
    title: "Curating the Palette of Tradition POMBOX",
  },
  {
    image: vibe3,
    title: "Colour, Crafted With Care DYING",
  },
  {
    image: vibe4,
    title: "Hands That Weave Generations of Skill TUFTING",
  },
  {
    image: vibe5,
    title: "Precision Woven Into Every Pattern LOOMING",
  },
  {
    image: vibe6,
    title: "From Bhadohi to the World",
  },
];

const WhyChooseUs = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-24 relative overflow-hidden">
  {/* Soft gradient layer */}
  <div className="absolute inset-0 bg-gradient-to-b from-[#f5f1e8] via-[#f0e3cb] to-[#f5f1e8] -z-20" />

  {/* Subtle texture overlay */}
  <div
    className="absolute inset-0 opacity-10 -z-10"
    style={{
      backgroundImage: `url("/assets/paper.jpg")`,
      backgroundRepeat: "repeat",
      backgroundSize: "300px",
    }}
  />
      <div className="container mx-auto text-center max-w-5xl">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-[#4b3621]">
          Weaving Magic of Creativity
        </h2>
        <div className="w-24 h-1 bg-gradient-to-r from-[#b08d57] to-[#e5c07b] mx-auto rounded-full mb-8" />
        <p className="text-lg md:text-xl text-[#4b3621] mb-16">
          At Indian Tufted Carpets, we are driven to explore the rich realm of fibre, weave, and colour. Nestled in the heart of Indias carpet-making centre, we masterfully blend timeless techniques with modern innovation to create magnificent carpets that tell stories of heritage and artistry.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-[#e8dcc7] p-8 text-left transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
            >
              <h3 className="text-xl font-semibold text-[#644d26] mb-2">
                {feature.title}
              </h3>
              <p className="text-[#4b3621]">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      

      <Carousel className="mt-20 relative max-w-[700px] mx-auto" opts={{ loop: true }}>
        <p className="text-[#7a6645] italic tracking-wide mb-10 text-center">
        A Journey Through Craftsmanship
        </p>
        <CarouselContent
          style={{
            transform: `translateX(-${activeIndex * 100}%)`,
            transition: "transform 0.5s ease-in-out",
            display: "flex",
          }}
        >
          {slides.map((slide, index) => (
            <CarouselItem key={index} className="flex justify-center w-full shrink-0 grow-0 basis-full">
              <div className="relative w-full max-w-[400px] h-[400px] overflow-hidden">
          <Image 
            src={slide.image} // Replace with your array of image sources if different
            alt={slide.title}
            className="rounded-lg shadow-luxury object-cover w-full h-full"
            width={400} // Optional: Set explicit width for Next.js Image
            height={500} // Optional: Set explicit height for Next.js Image
          />
          <div className="absolute bottom-6 left-6 bg-black/10 backdrop-blur-sm px-6 py-3 rounded-lg font-semibold text-white tracking-wide">
            {slide.title}
          </div>
        </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex"/>
        <CarouselNext className="hidden md:flex" />
      </Carousel>
    </section>
  );
};

export default WhyChooseUs;
