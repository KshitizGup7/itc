"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import vibe from "@/public/assets/torekov.jpeg";
import vibe1 from "@/public/assets/fagestra.jpeg";
import vibe2 from "@/public/assets/Gasoga.jpeg";
import vibe3 from "@/public/assets/1c.jpg";
import vibe4 from "@/public/assets/2c.jpg";
import vibe5 from "@/public/assets/3c.jpeg";
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
    title: "Global Reach",
    description:
      "Leading manufacturers and exporters serving customers worldwide from the heart of India",
  },
];

const images = [vibe5, vibe4, vibe3, vibe2, vibe1, vibe];

const WhyChooseUs = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % images.length);
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <section
      className="py-16"
      style={{
        backgroundImage: `url("/assets/paper.jpg")`,
        backgroundRepeat: "repeat",
        backgroundSize: "cover",
      }}
    >
      <div className="container mx-auto text-center max-w-5xl">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-[#644d26]">
          Weaving Magic of Creativity
        </h2>
        <p className="text-lg md:text-xl text-[#a4834f] mb-16">
          At Indian Tufted Carpets, we are driven to explore the rich realm of fibre, weave, and colour. Nestled in the heart of India's carpet-making centre, we masterfully blend timeless techniques with modern innovation to create magnificent carpets that tell stories of heritage and artistry.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md p-6 text-left transition-all hover:shadow-xl duration-300"
            >
              <h3 className="text-xl font-semibold text-[#644d26] mb-2">
                {feature.title}
              </h3>
              <p className="text-[#a4834f]">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      <Carousel className="mt-12 relative max-w-[600px] mx-auto" opts={{ loop: true }}>
        <CarouselContent
          style={{
            transform: `translateX(-${activeIndex * 100}%)`,
            transition: "transform 0.5s ease-in-out",
            display: "flex",
          }}
        >
          {images.map((image, index) => (
            <CarouselItem key={index} className="flex justify-center w-full shrink-0 grow-0 basis-full">
              <div className="relative w-full max-w-[400px] h-[400px] overflow-hidden">
          <Image 
            src={image} // Replace with your array of image sources if different
            alt="Traditional carpet weaving craftsmanship"
            className="rounded-lg shadow-luxury object-cover w-full h-full"
            width={400} // Optional: Set explicit width for Next.js Image
            height={500} // Optional: Set explicit height for Next.js Image
          />
          <div className="absolute -top-6 -left-6 w-24 h-24 bg-gradient-gold rounded-full opacity-20"></div>
          <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gradient-hero rounded-full opacity-20"></div>
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
