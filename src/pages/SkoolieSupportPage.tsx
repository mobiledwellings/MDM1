import { Header } from "../components/Header";
import { SkoolieSupport } from "../components/SkoolieSupport";
import { Footer } from "../components/Footer";
import { SEO } from "../components/SEO";

export function SkoolieSupportPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Skoolie Support - Bus Conversion Consulting",
    "description": "Get expert help with your school bus conversion. One-on-one consultations for skoolie electrical systems, layout planning, plumbing, and mechanical issues.",
    "url": "https://mobiledwellings.media/skoolie-support",
    "provider": {
      "@type": "Organization",
      "name": "Mobile Dwellings"
    },
    "serviceType": "Bus Conversion Consulting",
    "areaServed": "US"
  };

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="Skoolie Support | Bus Conversion Help & Build Consulting"
        description="Need help with your skoolie build? Get one-on-one consulting from professional and amateur bus conversion builders. Expert advice on electrical, plumbing, layout planning, and mechanical issues for school bus conversions."
        keywords="skoolie help, bus conversion help, skoolie builder, school bus conversion advice, skoolie electrical, skoolie plumbing, skoolie layout, bus conversion consulting, DIY skoolie, skoolie build guide"
        url="https://mobiledwellings.media/skoolie-support"
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Header />
      <SkoolieSupport />
      <Footer />
    </div>
  );
}
