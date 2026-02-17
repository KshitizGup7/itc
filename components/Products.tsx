"use client";

import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";

const Products = () => {
  useEffect(() => {
    AOS.init({ duration: 800, once: false });
  }, []);
  const CatalogClick = () => {
       redirect('/catalog')
    }

  const services = [
    {
      title: "Hand Tufted Carpets",
      image: "/assets/products/tufted.webp",
      hover: "/assets/products/folded1.webp",
      description: "High-quality hand-tufted carpets manufactured with precision and consistency to meet international standards.",
      features: ["Custom Designs", "Premium Wool & Blends", "Various Sizes"],
    },
    {
      title: "Silk & Jute Carpets",
      image: "/assets/products/silk.webp",
      hover: "/assets/products/folded4.webp",
      description: "Silk and jute carpets combining natural fibres with durable construction for commercial and residential applications.",
      features: ["Natural Fibre Compositions", "Durable Construction", "Custom Colour Matching"],
    },
    {
      title: "Hand Knotted Rugs",
      image: "/assets/products/knotted.webp",
      hover: "/assets/products/folded2.webp",
      description: "Hand-knotted rugs crafted using traditional techniques with strict quality control and detailed finishing.",
      features: ["High Knot Density", "Intricate Patterns", "Heirloom Quality"],
    },
    {
      title: "Custom Rugs",
      image: "/assets/products/cumstom mat.webp",
      hover: "/assets/products/folded3.webp",
      description: "Made-to-order rugs developed according to client specifications, suitable for small-scale orders.",
      features: ["Tailored Solutions", "Quality Assurance", "Private Label"],
    },
  ];

  return (
    <section className="py-28 relative overflow-hidden">
  {/* Luxury gradient base */}
  <div className="absolute inset-0 bg-gradient-to-b from-[#f6f1e8] via-[#f1e5d1] to-[#f8f3ea] -z-20" />

  {/* Subtle texture overlay */}
  <div
    className="absolute inset-0 -z-10"
    style={{
      backgroundImage: `url("/assets/paper.jpg")`,
      backgroundRepeat: "repeat",
      backgroundSize: "300px",
    }}
  />
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16" data-aos="fade-up">
          <h2 className="text-5xl md:text-6xl font-semibold tracking-wide text-[#644d26] mb-6">
            Our Product Range
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-[#b08d57] to-[#e5c07b] mx-auto mt-6 rounded-full" />
          <p className="text-lg text-[#a4834f] max-w-3xl mx-auto">
            From hand-tufted carpets to hand-woven rugs and custom mats, we offer a comprehensive 
            range of premium textile products that embody excellence and tradition.
          </p>
        </div>

        {/* Products */}
        <div className="space-y-24 mb-16">
          {services.map((service, index) => (
            <div
              key={index}
              className="grid md:grid-cols-2 gap-x-12 gap-y-10 items-center"
              data-aos={index % 2 === 0 ? "fade-right" : "fade-left"}
            >
              {/* Image */}
              <div className={`relative group overflow-hidden rounded-2xl mx-auto
    w-full
    max-w-[90%]
    sm:max-w-[420px]
    md:max-w-[460px]
    lg:max-w-[500px]
    xl:max-w-[540px] ${index % 2 === 1 ? "md:order-2" : ""}`}>
                
                <Image
                  src={service.image}
                  alt={service.title}
                  className="rounded-2xl shadow-2xl object-cover transition-opacity duration-500 group-hover:opacity-0"
                  width={500}
                  height={400}
                />
                <Image
                  src={service.hover}
                  alt={service.title}
                  fill
                  className="absolute inset-0 rounded-2xl shadow-2xl object-cover opacity-0 transition-all duration-500 group-hover:opacity-100"
                />
              </div>

              {/* Content */}
              <div className={`${index % 2 === 1 ? "md:order-1" : ""}`}>
                <Card className="bg-white/90 backdrop-blur-md border border-[#e8dcc7] rounded-2xl shadow-xl p-2 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">
                  <CardHeader>
                    <CardTitle className="text-[#644d26] text-2xl">{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-[#a4834f] mb-4 text-base">{service.description}</p>
                    <ul className="space-y-2 mt-4">
                      {service.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start text-sm text-muted-foreground">
                          <div className="w-2 h-2 mt-2 bg-gradient-to-r from-[#b08d57] to-[#e5c07b] rounded-full mr-3"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="relative bg-gradient-to-r from-[#4b3621] to-[#644d26] rounded-3xl p-16 text-center text-white overflow-hidden">
          <h3 className="text-2xl font-bold mb-4">Export Excellence</h3>
          <p className="text-lg max-w-2xl mx-auto">
            We proudly export our premium carpets and rugs worldwide, bringing the finest Indian 
            craftsmanship to international markets with assured quality and timely delivery. We support international wholesalers, buying houses, and retail brands with scalable production, strict quality control, and timely delivery.
          </p>
          <Button size="lg"  onClick={CatalogClick}
          className="mt-8 text-lg px-10 py-5 bg-[#b08d57] hover:bg-[#c69c5d] text-white rounded-full shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer">
            Explore Collection
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Products;
