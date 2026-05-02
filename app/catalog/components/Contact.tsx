import ContactForm from "@/components/Form";

const ContactSection = () => {
  return (
    <section className="min-h-screen bg-cover bg-center" // Added padding for smaller screens
      style={{ backgroundImage: "url('/catalog/potBg.webp')" }}>
      <ContactForm/>
    </section>
  );
};

export default ContactSection;