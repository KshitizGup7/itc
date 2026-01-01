"use client";

import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { redirect } from "next/navigation";
import { Button } from "./ui/button";

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
      image: "/assets/products/tufted.jpg",
      description: "Luxurious hand-tufted carpets with intricate designs and superior quality craftsmanship",
      features: ["Custom Designs", "Premium Materials", "Various Sizes"],
    },
    {
      title: "Hand Woven Rugs",
      image: "/assets/products/fagestra1.jpeg",
      description: "Traditional hand-woven rugs that showcase the finest artistry and timeless appeal",
      features: ["Traditional Techniques", "Durable Construction", "Unique Patterns"],
    },
    {
      title: "Hand Knotted Rugs",
      image: "/assets/products/knotted.jpg",
      description: "Exquisite hand-knotted rugs crafted with meticulous attention to detail and traditional artistry",
      features: ["Master Craftsmanship", "Intricate Patterns", "Heirloom Quality"],
    },
    {
      title: "Custom Mats",
      image: "/assets/products/custom.png",
      description: "Specialized mats designed for various applications with attention to detail",
      features: ["Tailored Solutions", "Quality Assurance", "Bulk Orders"],
    },
  ];

  return (
    <section
      className="py-16"
      style={{
        backgroundImage: `url("/assets/paper.jpg")`, // Use your subtle pattern
        backgroundRepeat: "repeat",
        backgroundSize: "cover",
        //backgroundBlendMode: "soft-light",
      }}
    >
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16" data-aos="fade-up">
          <h2 className="text-4xl md:text-5xl font-bold text-[#644d26] mb-6">
            Our Product Range
          </h2>
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
              <div className={`relative ${index % 2 === 1 ? "md:order-2" : ""}`}>
                <Image
                  src={service.image}
                  alt={service.title}
                  className="rounded-xl shadow-lg w-full h-full object-cover"
                  width={500}
                  height={400}
                />
              </div>

              {/* Content */}
              <div className={`${index % 2 === 1 ? "md:order-1" : ""}`}>
                <Card className="bg-white border-l-4 border-l-[#d48300] hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="text-[#644d26] text-2xl">{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-[#a4834f] mb-4 text-base">{service.description}</p>
                    <ul className="space-y-2 mt-4">
                      {service.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start text-sm text-muted-foreground">
                          <div className="w-2 h-2 mt-1 bg-[#46433d68] rounded-full mr-3"></div>
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
        <div className="bg-[#644d26] rounded-xl p-10 text-center text-white" data-aos="fade-up">
          <h3 className="text-2xl font-bold mb-4">Export Excellence</h3>
          <p className="text-lg max-w-2xl mx-auto">
            We proudly export our premium carpets and rugs worldwide, bringing the finest Indian 
            craftsmanship to international markets with assured quality and timely delivery.
          </p>
          <Button size="lg"  onClick={CatalogClick}
          className="text-lg px-8 py-4 cursor-pointer">
            Explore Collection
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Products;
