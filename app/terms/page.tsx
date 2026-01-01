import React from "react";
import Link from "next/link";

const Terms = () => {
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
      <section className="max-w-4xl mx-auto px-6 py-12 tracking-wide">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Terms & Conditions</h2>
        <p className="text-lg text-gray-700 leading-relaxed mb-4">
          This document outlines the Terms & Conditions governing the business relationship, 
          including the supply and purchase of products, between you (“The Partner,” “You”) and Indian Tufted Carpets (“The Company,” “We,” “Us”). 
          By engaging in business and placing an order with Indian Tufted Carpets, you agree to these terms.
        </p>
        <p className=" text-gray-700 leading-relaxed mb-4">
          1. Intellectual Property & Use of Materials

            All materials and content provided by Indian Tufted Carpets, including but not limited to images, logos, product designs, 
            illustrations, and marketing materials, are protected by copyrights, trademarks, and other intellectual property rights owned and controlled by The Company or licensed to us.

            <br></br>
            <span className="text-gray-900 font-semibold">Restrictions: You must not copy, reproduce, or distribute our materials for any other purpose without prior written consent. 
            You may not modify, adapt, or claim ownership of our intellectual property. This license does not permit the use of our materials to represent products not manufactured by Indian Tufted Carpets.
         </span></p>
        <p className=" text-gray-700 leading-relaxed">
         2. Orders & Production<br/>

        Production Lead Time: Production timelines vary based on the complexity and type of order. Standard lead times can range from 2 weeks to 2 months.
        An estimated completion date will be provided upon order confirmation.

        Lead Time Exclusion: The quoted production lead time does not include the shipping and transit duration.
        </p>
        <br/>
        <p className=" text-gray-700 leading-relaxed">3. Payment Terms<br/>

<span className="text-gray-900 font-semibold">Invoicing:</span> An invoice for the order will be issued to the Partner. The specific payment terms will be detailed on the proforma invoice or order confirmation for each order.
<br/>
<span className="text-gray-900 font-semibold">Standard Terms:</span> Unless otherwise agreed in writing by The Company for trusted Partners with established relationships, full payment is due within fifteen (15) days of the product delivery date.
<br/>
<span className="text-gray-900 font-semibold">Alternative Payment Structures:</span> The Company reserves the right, at its sole discretion, to require alternative payment terms, including but not limited to:
<br/>
<span className="text-gray-900 font-semibold">Advance Payment:</span> A partial or full advance payment may be required prior to the start of production, particularly for large-volume or highly customized orders.
<br/>
<span className="text-gray-900 font-semibold">Payment on Dispatch:</span> Full payment may be required once the shipment has been dispatched from our facility in India.
<br/>
<span className="text-gray-900 font-semibold">Late Payments:</span> Failure to make payment within the agreed-upon timeframe may result in a delay of the shipment or the application of late payment interest on the outstanding amount.</p>
        <br/><p className=" text-gray-700 leading-relaxed">
            4. Shipping & Delivery<br/>

            <span className="text-gray-900 font-semibold">Courier Services:</span> Delivery time is dependent on the selected courier service (e.g., FedEx, DHL, or other freight forwarders).
            <br/>
            <span className="text-gray-900 font-semibold">International Shipments:</span> We facilitate sales and shipping globally. Product prices include standard courier charges for insured door-to-door delivery.
            <br/>
            <span className="text-gray-900 font-semibold">Customs and Duties:</span> The Partner is solely responsible for all customs duties, import taxes, tariffs, and other local charges or fees levied by the destination country.
            <br/>
            <span className="text-gray-900 font-semibold">Risk of Loss:</span> The risk of loss or damage to products during transit transfers to the Partner as soon as the shipment is handed over to the designated courier, unless an alternative arrangement is agreed upon in writing.
        </p>
        <br/>
        <p className=" text-gray-700 leading-relaxed">
            5. Defective Products: Any claims for manufacturing defects or incorrect products must be submitted in writing, accompanied by evidence, within seven (7) days of receiving the goods.
        </p>
        <br/>
        <p className=" text-gray-700 leading-relaxed">
            6. Force Majeure

            Indian Tufted Carpets shall not be held liable for any failure or delay in performing our obligations if such failure is the result of a Force Majeure Event. A “Force Majeure Event” 
            includes any cause beyond our reasonable control, such as acts of God, fire, flood, civil commotion, strikes, governmental restrictions, war, insurrection, or breakdown of communication and transportation systems that prevents the timely fulfillment of our obligations.
        </p>
        <br/>
        <p className=" text-gray-700 leading-relaxed">7. Governing Law & Jurisdiction<br/>
These Terms & Conditions and any dispute arising from the business relationship with the Partner shall be governed by and construed in accordance with the laws of the Republic of India. The Partner irrevocably agrees that the competent courts located in Bhadohi, Uttar Pradesh, India, shall have exclusive jurisdiction to settle any dispute or claim that arises out of or in connection with this agreement.</p>
      </section>
    </div>
  );
};

export default Terms;
