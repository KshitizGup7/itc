import type { Metadata } from "next";
import CatalogGallery from "./cataloggallery";
import manifest from "./catalog-manifest.json";
import Footer from "@/components/Footer";
import Form from "@/components/Form";

export const metadata: Metadata = {
  title: "Collections & Company Profile | Indian Tufted Carpet",
  description:
    "Manufacturing capabilities and wholesale collections from Indian Tufted Carpet — for interior designers, importers, and retailers.",
};

// Keep the master PDF on Supabase — it's only used for the explicit
// "Download PDF" action now, never for on-page rendering.
const PDF_URL =
  "https://ggwsrhgojaifjdpxlcot.supabase.co/storage/v1/object/public/catalog/FINALCATALOG.pdf";

const CatalogPage = () => {
  return (
    <div>
      <CatalogGallery pages={manifest.pages} pdfUrl={PDF_URL} />
      <Form/>
      <Footer/>
    </div>
  )
}

export default CatalogPage