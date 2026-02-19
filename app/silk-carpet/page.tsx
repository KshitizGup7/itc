import Link from "next/link"
import heroB1 from "@/public/silk/silkIn.webp";
import heroB2 from "@/public/silk/silk yarn.webp";
import main from "@/public/silk/silk looming.webp";
import Image from "next/image";
import Footer from "@/components/Footer";
import { Metadata } from "next";


export const metadata: Metadata = {
  title: 'What is a Silk Carpet?',
  description: 'Discover the history, durability, and texture of pure silk carpets. Learn how to identify real silk and why it is the crown jewel of Indian craftsmanship.',
  keywords: ['silk carpet', 'Indian silk rugs', 'Bhadohi carpets', 'luxury floor covering'],
}

const page = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-md px-6 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800 uppercase tracking-wider">
          Indian Tufted Carpets
        </h1>
        <Link
          href="/#hero"
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
      {/* Top Hero Images */}
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="relative h-[80vh]">
          <Image
            src={heroB1}
            alt="Luxury handmade silk carpet close up"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="relative h-[80vh]">
          <Image
            src={heroB2}
            alt="Elegant silk rug interior setting"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>

      {/* Blog Content */}
      <article className="max-w-4xl mx-auto px-6 py-16 text-gray-800 leading-relaxed">

        <h1 className="text-4xl font-bold mb-6">
          What Is a Silk Carpet? (And Is It Better Than Wool?)
        </h1>

        <p className="mb-6 text-lg">
          Silk carpets have long been associated with royalty, craftsmanship,
          and timeless elegance. Made from natural silk fibers derived from
          silkworm cocoons, these rugs are known for their fine detailing,
          luminous sheen, and luxurious feel.
        </p>

        <h2 className="text-2xl font-semibold mt-10 mb-4">
          The Origin of Silk Carpets
        </h2>

        <p className="mb-6">
          The origins of silk are often debated, with early production traced to
          ancient China and later flourishing in India and Persia. One of the
          oldest known pile carpets ever discovered, the Pazyryk carpet,
          reflects how advanced weaving techniques were even centuries ago.
          Today, silk continues to symbolize refinement and exclusivity.
        </p>

        <h2 className="text-2xl font-semibold mt-10 mb-4">
          What Exactly Is a Silk Carpet?
        </h2>

        <p className="mb-6">
          A silk carpet is a handmade rug woven using natural silk fibers, 
          usually derived from silkworm cocoons. 
          Because silk fibers are extremely fine and strong, 
          they allow weavers to create:<br/>
          <span className="font-semibold mt-2 tracking-wide">Intricate patterns</span><br/>
          <span className="font-semibold mt-2 tracking-wide">High Knott density</span><br/>
          <span className="font-semibold mt-2 tracking-wide">Sharp detailing</span><br/>
          <span className="font-semibold mt-2 tracking-wide">A natural luminous sheen</span><br/>
          The result? A carpet that doesn’t just cover a floor it becomes a statement piece.
          Due to its shine and detail, many people even hang silk carpets on walls like art instead of placing them in heavy-traffic areas.
        </p>

        {/* Main Aesthetic Image */}
        

        <h2 className="text-2xl font-semibold mt-10 mb-4">
          Why Silk Carpets Look So Luxurious
        </h2>

        <p className="mb-6">
          Silk fibers have a prism-like structure that reflects light
          beautifully. This gives silk carpets their signature shimmer and
          depth of color. Because silk threads are extremely fine, artisans can
          achieve very high knot density, resulting in intricate and precise
          patterns that are difficult to replicate in other materials.
        </p>

        <h2 className="text-2xl font-semibold mt-10 mb-4">
          Are Silk Carpets Durable?
        </h2>

        <p className="mb-6">
          Silk is surprisingly strong for such a delicate looking fiber. A
          well maintained handmade silk carpet can last decades. However, it is
          best suited for low-traffic areas like formal living rooms or bedrooms.
          Heavy foot traffic may reduce its lifespan compared to wool rugs.
        </p>

        <h2 className="text-2xl font-semibold mt-10 mb-4">
          Type Of Silk rugs
        </h2>
        <h3 className="mb-6 font-bold">Pure Silk</h3>
        <p className="mt-6">Natural silk, popularly known as Chinas white gold, 
          is widely famous for being delightfully soft and has a distinctive gloss.
           Moreover, it is resilient and sturdy. Pure silk bears all the excellent 
           characteristics to make high-quality carpets. Because silk threads are very thin, 
           artisans can create highly intricate floral, Persian, or contemporary patterns.
            These carpets are often considered collectible art pieces rather than everyday floor coverings.</p><br/>
        <h3 className="mb-6 font-bold">Bamboo Silk</h3>
        <p className="mt-6">Rugs made of bamboo silk are incredibly beautiful and ornamental 
          and add warmth and beauty to any area.
            Because bamboo silk is created from bamboo fibre rather than wood or other materials, 
            it is a better sort of viscose. Moreover, it is antibacterial and hypoallergenic. 
            These silk rugs are beneficial for the environment and hold color nicely.</p>

        <h2 className="text-2xl font-semibold mt-10 mb-4">
          Silk vs Wool Carpet: What’s the Difference?
        </h2>

        <p className="mb-4">
          <strong>Silk</strong> offers unmatched sheen, elegance, and detailed
          patterns. It is ideal for luxury interiors and statement pieces.
        </p>

        <p className="mb-4">
          <strong>Wool</strong> is naturally resilient, more resistant to stains,
          and better suited for high-traffic family spaces.
        </p>

        <p className="mb-6">
          If you want glamour and artistic detail, silk is the superior choice.
          If you prioritize durability and everyday comfort, wool may be more
          practical. Many homeowners opt for wool-silk blends for a balance of
          beauty and strength.
        </p>

        <h2 className="text-2xl font-semibold mt-10 mb-4">
          Is a Silk Carpet Right for You?
        </h2>

        <p>
          A silk carpet is not just a floor covering — it is a statement of
          craftsmanship and heritage. If maintained properly, it can remain a
          treasured decorative piece for decades while elevating the entire
          atmosphere of your home.
        </p>

      </article>
      <Footer/>
    </div>
    
  )
  
}

  export default page;