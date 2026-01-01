// import React from 'react'
// import { Button } from './ui/button'

// const Footer = () => {
//   return (
//         <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-luxury p-8">
//           <div className="grid md:grid-cols-2 gap-8">
//             <div>
//               <h3 className="text-2xl font-bold text-burgundy mb-4">
//                 Indian Tufted Carpets (ITC)
//               </h3>
//               <p className="text-warm-brown mb-6 leading-relaxed">
//                 We welcome inquiries from retailers, wholesalers, and international buyers. 
//                 Our team is ready to assist you with custom orders, bulk purchases, and 
//                 detailed product specifications.
//               </p>
//               <div className="space-y-3 text-sm text-warm-brown">
//                 <div className="flex items-center">
//                   <div className="w-2 h-2 bg-gold rounded-full mr-3"></div>
//                   Custom design consultations
//                 </div>
//                 <div className="flex items-center">
//                   <div className="w-2 h-2 bg-gold rounded-full mr-3"></div>
//                   Bulk order discounts
//                 </div>
//                 <div className="flex items-center">
//                   <div className="w-2 h-2 bg-gold rounded-full mr-3"></div>
//                   International shipping
//                 </div>
//                 <div className="flex items-center">
//                   <div className="w-2 h-2 bg-gold rounded-full mr-3"></div>
//                   Quality guarantee
//                 </div>
//               </div>
//             </div>
//           </div> 
//         </div>
//   )
// }

// export default Footer

import React from 'react';
import { Button } from './ui/button';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-10" id="footer">
      <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-4 gap-8">
        
        {/* Company Info */}
        <div>
          <h3 className="text-xl font-bold mb-4">Indian Tufted Carpet</h3>
          <p>Bhadohi, Varanasi, India</p>
          <p>Phone: +91 9452345878</p>
          <p>Email: <a href="https://mail.google.com/mail/?view=cm&fs=1&to=indiantuftedcarpets.com" target="_blank"
                    rel="noopener noreferrer" className="text-gold">
                    indiantuftedcarpets@gmail.com</a></p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-lg font-semibold mb-3">Quick Links</h4>
          <ul className="space-y-2">
            <li><a href="/about" className="hover:text-gold">About Us</a></li>
            <li><a href="/privacy-policy" className="hover:text-gold">Privacy Policy</a></li>
            <li><a href="/terms" className="hover:text-gold">Terms & Conditions</a></li>
          </ul>
        </div>

        {/* Services */}
        <div>
          <h4 className="text-lg font-semibold mb-3">Our Services</h4>
          <ul className="space-y-2">
            <li>Custom Design Consultation</li>
            <li>Bulk Order Discounts</li>
            <li>International Shipping</li>
            <li>Quality Guarantee</li>
          </ul>
        </div>

        {/* Call to Action */}
        <div>
          <h4 className="text-lg font-semibold mb-3">Work With Us</h4>
          <p className="mb-4">We welcome inquiries from retailers, wholesalers, and international buyers. 
                 Our team is ready to assist you with custom orders, bulk purchases, and 
                 detailed product specifications.</p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700 mt-8 pt-4 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} Indian Tufted Carpet. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
