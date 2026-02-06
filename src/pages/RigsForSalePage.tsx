import { Header } from "../components/Header";
import { RigsForSale } from "../components/RigsForSale";
import { Footer } from "../components/Footer";
import { SEO } from "../components/SEO";
import { useRigs } from "../contexts/RigsContext";

export function RigsForSalePage() {
  const { rigs } = useRigs();
  const availableCount = rigs.filter(r => r.status !== 'sold' && !r.sold).length;
  const skoolieCount = rigs.filter(r => r.type?.toLowerCase().includes('skoolie') || r.type?.toLowerCase().includes('bus')).length;
  
  // Generate dynamic structured data for the marketplace
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Skoolies & Converted Buses For Sale",
    "description": "Browse converted school buses, skoolies, van conversions, and tiny homes for sale. Find your dream mobile dwelling.",
    "url": "https://mobiledwellings.media/rigs-for-sale",
    "numberOfItems": rigs.length,
    "itemListElement": rigs.slice(0, 10).map((rig, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Vehicle",
        "name": rig.title,
        "description": rig.buildDescription?.substring(0, 200),
        "image": rig.thumbnail,
        "url": `https://mobiledwellings.media/rigs/${rig.id}`,
        "vehicleConfiguration": rig.type,
        "mileageFromOdometer": rig.mileage ? {
          "@type": "QuantitativeValue",
          "value": rig.mileage.replace(/[^0-9]/g, ''),
          "unitCode": "SMI"
        } : undefined,
        "offers": {
          "@type": "Offer",
          "price": rig.price?.replace(/[^0-9]/g, ''),
          "priceCurrency": "USD",
          "availability": rig.status === 'sold' ? "https://schema.org/SoldOut" : "https://schema.org/InStock",
          "itemCondition": "https://schema.org/UsedCondition"
        }
      }
    }))
  };

  return (
    <div className="min-h-screen bg-white">
      <SEO 
        title="Skoolies For Sale | Converted Buses, Vans & Tiny Homes"
        description={`Browse ${availableCount}+ skoolies, converted school buses, camper vans, and tiny homes for sale. Find your perfect mobile dwelling from verified sellers. New listings added weekly.`}
        keywords="skoolies for sale, school bus conversion for sale, converted bus for sale, skoolie marketplace, buy skoolie, camper van for sale, van conversion for sale, tiny home on wheels, mobile home for sale, RV for sale, bus conversion, skoolie bus, finished skoolie for sale"
        url="https://mobiledwellings.media/rigs-for-sale"
        type="website"
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Header />
      <RigsForSale />
      <Footer />
    </div>
  );
}
