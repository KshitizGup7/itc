import Link from "next/link"
import heroB1 from "@/public/silk/silkIn.webp";
import heroB2 from "@/public/silk/silk yarn.webp";
import main from "@/public/silk/silk looming.webp";
import Image from "next/image";
import Footer from "@/components/Footer";
import { Metadata } from "next";


export const metadata: Metadata = {
  title: 'Hand Tufted vs Hand Knotted',
  description: 'Learn the real difference between hand-tufted and hand-knotted carpets. Discover how to spot a fake, compare durability, and decide which rug is right for your home.',
  keywords: [
    'hand tufted vs hand knotted', 
    'rug manufacturing process', 
    'Bhadohi carpet guide', 
    'wool rug durability', 
    'how to identify handmade rugs', 
    'tufted carpet', 
    'knotted carpet'
  ],
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
      <article className="max-w-4xl mx-auto px-6 py-16 text-gray-800 leading-relaxed">

  <h1 className="text-4xl font-bold mb-6">
    Hand-Tufted vs Hand-Knotted Carpets: What’s the Real Difference?
  </h1>

  <p className="mb-8 text-lg">
    At first glance, hand-tufted and hand-knotted carpets can look identical.
    The same design. The same colors. Sometimes even the same material.
    But the method of construction makes a massive difference in durability,
    value, and price.
  </p>

  {/* Core Difference */}
  <h2 className="text-2xl font-semibold mt-10 mb-4">
    1. The Core Difference
  </h2>

  <p className="mb-4">
    <strong>Hand-Knotted:</strong> The ancient and traditional method.
    An artisan sits at a loom and ties individual knots by hand —
    sometimes millions of them. There is no glue, no backing.
    The rug is entirely constructed from interwoven threads.
  </p>

  <p className="mb-8">
    <strong>Hand-Tufted:</strong> A modern technique. A worker uses a
    handheld tufting gun to punch yarn into a pre-made canvas.
    The yarn is then secured with a heavy layer of latex glue and
    covered with a cloth backing.
  </p>

  {/* Comparison Table */}
  <h2 className="text-2xl font-semibold mt-10 mb-6">
    2. Detailed Comparison
  </h2>

  <div className="overflow-x-auto mb-10">
    <table className="w-full border border-gray-300 text-left">
      <thead className="bg-gray-100">
        <tr>
          <th className="p-3 border">Feature</th>
          <th className="p-3 border">Hand-Knotted</th>
          <th className="p-3 border">Hand-Tufted</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="p-3 border">Production Time</td>
          <td className="p-3 border">2-4 months</td>
          <td className="p-3 border">3-4 weeks</td>
        </tr>
        <tr>
          <td className="p-3 border">Backing</td>
          <td className="p-3 border">
            No backing. Back mirrors the front.
          </td>
          <td className="p-3 border">
            Canvas + latex glue + cloth backing.
          </td>
        </tr>
        <tr>
          <td className="p-3 border">Durability</td>
          <td className="p-3 border">
            25+ years
          </td>
          <td className="p-3 border">
            5–10 years
          </td>
        </tr>
        <tr>
          <td className="p-3 border">Texture</td>
          <td className="p-3 border">
            Dense, flexible, foldable
          </td>
          <td className="p-3 border">
            Thicker, stiffer (due to glue)
          </td>
        </tr>
        <tr>
          <td className="p-3 border">Value</td>
          <td className="p-3 border">
            Holds or increases in value
          </td>
          <td className="p-3 border">
            Depreciates over time
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  {/* Insider Tests */}
  <h2 className="text-2xl font-semibold mt-10 mb-4">
    3. How to Identify 
  </h2>

  <p className="mb-4 font-semibold">Test 1: The Flip Test (Most Important)</p>
  <p className="mb-6">
    Flip the rug over.
    If you see the pattern clearly on the back and can count tiny knots,
    it is hand-knotted. If you see plain canvas or cloth backing,
    it is hand-tufted — that cloth hides the glue layer.
  </p>

  <p className="mb-4 font-semibold">Test 2: The Fringe Test</p>
  <p className="mb-6">
    On hand-knotted rugs, the fringe is part of the rug’s structure —
    the warp threads extend naturally from the body.
    On hand-tufted rugs, the fringe is often stitched or glued on separately.
  </p>

  <p className="mb-4 font-semibold">Test 3: The Smell Test</p>
  <p className="mb-10">
    New hand-tufted rugs often have a faint chemical smell due to latex glue.
    Hand-knotted rugs smell only like wool or natural fiber.
  </p>

  {/* Price Explanation Section */}
  <h2 className="text-2xl font-semibold mt-10 mb-4">
    Why Is One $200 and the Other $1000 — Even for the Same Design?
  </h2>

  <p className="mb-6">
    This is the most common question buyers ask.
    If the design looks identical, why is the price so different?
  </p>

  <p className="mb-6">
    The answer lies in <strong>labor and construction time</strong>.
    A hand-knotted carpet may require months of skilled craftsmanship,
    sometimes involving thousands of hours of knotting.
    Each knot is tied individually by an artisan.
  </p>

  <p className="mb-6">
    A hand-tufted rug, however, can be completed in weeks.
    The tufting gun speeds up production significantly.
    Glue replaces thousands of hand-tied knots,
    which reduces labor cost dramatically.
  </p>

  <p className="mb-6">
    In simple terms:
  </p>

  <ul className="list-disc pl-6 mb-8 space-y-2">
    <li>Hand-Knotted = Labor-intensive art + time + skill = Higher cost</li>
    <li>Hand-Tufted = Faster production + glue backing = Lower cost</li>
  </ul>

  <p className="mb-10">
    You are not just paying for design —
    you are paying for time, craftsmanship, and longevity.
  </p>

  {/* Consumer Advice */}
  <h2 className="text-2xl font-semibold mt-10 mb-4">
    Which One Should You Buy?
  </h2>

  <p className="mb-4 font-semibold">Choose Hand-Tufted If:</p>
  <ul className="list-disc pl-6 mb-8 space-y-2">
    <li>You are on a lower budget</li>
    <li>You like changing decor every 5–7 years</li>
    <li>You want a plush, thick rug for comfort-focused areas</li>
  </ul>

  <p className="mb-4 font-semibold">Choose Hand-Knotted If:</p>
  <ul className="list-disc pl-6 mb-8 space-y-2">
    <li>You want a rug that lasts generations</li>
    <li>You need durability in high-traffic areas</li>
    <li>You see the rug as an art investment</li>
  </ul>

  <p>
    Both have their place. The right choice depends on your purpose,
    budget, and long-term expectations.
  </p>

</article>
</div>
  )
}

  export default page;