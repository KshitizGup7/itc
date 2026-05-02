// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { MapPin, Phone, Mail, Globe } from "lucide-react";
// import ContactForm from "./Form";

// const ContactSection = () => {
//   const contactInfo = [
//     {
//       icon: MapPin,
//       title: "Location",
//       details: "Bhadohi, Uttar Pradesh, India",
//       subtitle: "Heart of Carpet Centre"
//     },
//     {
//       icon: Phone,
//       title: "Phone",
//       details: "+91 9452345878",
//       subtitle: "WhatsApp for inquiries"
//     },
//     // {
//     //   icon: Mail,
//     //   title: "Email",
//     //   details: "indiantuftedcarpet@gmail.com",
//     //   subtitle: "Send us a message"
//     // },
//     {
//       icon: Globe,
//       title: "Export",
//       details: "Worldwide Shipping",
//       subtitle: "Global delivery available"
//     }
//   ];

//   return (
//     <section className="pt-5 bg-[#f3d8aa]" id="contact">
//       <div className="container mx-auto px-6">
//         <div className="text-center mb-16">
//           <h2 className="text-4xl md:text-5xl font-bold text-burgundy mb-6">
//             Get In Touch
//           </h2>
//           <p className="text-lg text-warm-brown max-w-2xl mx-auto">
//             Connect with us to discuss your carpet requirements, custom orders, 
//             or to learn more about our export services.
//           </p>
//         </div>

//         <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
//           {contactInfo.map((info, index) => {
//             const IconComponent = info.icon;
//             return (
//               <Card key={index} className="text-center hover:shadow-luxury transition-all duration-300 border-0">
//                 <CardHeader>
//                   <div className="mx-auto w-20 h-16 bg-gradient-gold rounded-full flex items-center justify-center mb-4">
//                     <IconComponent className="w-8 h-8 text-burgundy" />
//                   </div>
//                   <CardTitle className="text-burgundy">{info.title}</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <p className="font-semibold text-warm-brown mb-1">{info.details}</p>
//                   <p className="text-sm text-muted-foreground">{info.subtitle}</p>
//                 </CardContent>
//               </Card>
//             );
//           })}
//         </div>
        
//       </div>
//       <ContactForm/>
//     </section>
//   );
// };

// export default ContactSection;

import { MapPin, Phone, Globe } from "lucide-react";
import ContactForm from "./Form";

const ContactSection = () => {
  const contactInfo = [
    {
      icon: MapPin,
      title: "Location",
      details: "Bhadohi, Uttar Pradesh, India",
      subtitle: "Heart of Carpet Centre",
    },
    {
      icon: Phone,
      title: "Phone",
      details: "+91 9452345878",
      subtitle: "WhatsApp for inquiries",
    },
    {
      icon: Globe,
      title: "Export",
      details: "Worldwide Shipping",
      subtitle: "Global delivery available",
    },
  ];

  return (
    <section className="pt-16 pb-0 bg-[#f6f1e8]" id="contact">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-14">
          <h2 className="text-4xl md:text-5xl font-bold text-[#4b3621] mb-4">
            Get In Touch
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-[#b08d57] to-[#e5c07b] mx-auto mb-6 rounded-full" />
          <p className="text-lg text-[#a4834f] max-w-2xl mx-auto">
            Connect with us to discuss your carpet requirements, custom orders,
            or to learn more about our export services.
          </p>
        </div>

        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {contactInfo.map((info, index) => {
            const Icon = info.icon;
            return (
              <div
                key={index}
                className="bg-white border border-[#e8dcc7] rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className="w-14 h-14 bg-[#f6f1e8] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#e8dcc7]">
                  <Icon className="w-6 h-6 text-[#b08d57]" />
                </div>
                <p className="text-xs tracking-widest uppercase text-[#b08d57] mb-1">
                  {info.title}
                </p>
                <p className="font-semibold text-[#4b3621] text-base mb-1">
                  {info.details}
                </p>
                <p className="text-sm text-[#a4834f]">{info.subtitle}</p>
              </div>
            );
          })}
        </div>
      </div>

      <ContactForm />
    </section>
  );
};

export default ContactSection;