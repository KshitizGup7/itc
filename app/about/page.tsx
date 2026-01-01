import React from "react";
import Link from "next/link";

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-md px-6 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800 uppercase tracking-wider">
          Indian Tufted Carpets
        </h1>
        <Link
          href="/#footer"
          className="flex items-center text-gray-600 hover:text-gray-900 transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back
        </Link>
      </nav>

      {/* About Content */}
      <section className="max-w-4xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">About Us</h2>
        <p className="text-lg text-gray-700 leading-relaxed mb-4">
          <span className="font-semibold">Indian Tufted Carpets</span> is a
          mark of quality, weaving the magic of creativity and serving as an
          expert source of inspiration for producing magnificent carpets. Based
          in <span className="font-semibold">Bhadohi, Uttar Pradesh, India </span>
            the heart of the carpet industry we proudly stand among the leading
          manufacturers and exporters of{" "}
          <span className="italic">hand-tufted</span> and{" "}
          <span className="italic">hand-woven</span> carpets, rugs, and mats.
        </p>
        <p className="text-lg text-gray-700 leading-relaxed mb-4">
          For us, product quality and customer satisfaction are inseparable
          values, guaranteed in every creation. Our collective experience,
          spanning many years from yarn manufacturing to carpet weaving 
          inspires us to push the boundaries of fibre, weave, and colour
          palettes, delivering products that combine tradition with innovation.
        </p>
        <p className="text-lg text-gray-700 leading-relaxed">
          Whether for a boutique retailer, a global wholesaler, or a custom
          design project, we bring craftsmanship, precision, and timeless
          elegance to every piece we make.
        </p>
      </section>
    </div>
  );
};

export default About;
