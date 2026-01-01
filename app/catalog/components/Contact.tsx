import ContactForm from "@/components/Form";

const ContactSection = () => {
  return (
    <section className="min-h-screen bg-cover bg-center p-16" // Added padding for smaller screens
      style={{ backgroundImage: "url('/catalog/potBg.jpg')" }}>
      <ContactForm/>
    </section>
  );
};

export default ContactSection;