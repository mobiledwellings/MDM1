import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { SEO } from "../components/SEO";
import { Header } from "../components/Header";
import { VideoMasonry } from "../components/VideoMasonry";
import { SubmitBanner } from "../components/SubmitBanner";
import { RigsForSale } from "../components/RigsForSale";
import { GearShop } from "../components/GearShop";
import { SkoolieSupport } from "../components/SkoolieSupport";
import { About } from "../components/About";
import { ClosingBanner } from "../components/ClosingBanner";
import { Footer } from "../components/Footer";

export function HomePage() {
  const location = useLocation();

  // Handle scroll to hash when navigating from another page
  useEffect(() => {
    if (location.hash) {
      const targetId = location.hash.replace('#', '');
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, [location]);

  return (
    <>
      <SEO 
        title="Skoolies, Bus Conversions, Van Life & Overland Rigs"
        description="Browse skoolies for sale, watch bus conversion tours, and explore van life and overland rigs. Mobile Dwellings is the community marketplace for converted school buses, camper vans, tiny homes on wheels, and alternative mobile living."
        keywords="skoolie, skoolies for sale, bus conversion, school bus conversion, van life, overland rig, converted bus, camper van, tiny home on wheels, mobile living, skoolie marketplace, van conversion for sale, RV alternative, off-grid living"
        url="https://mobiledwellings.media"
      />
      
      <div className="min-h-screen bg-white dark:bg-neutral-900 transition-colors">
        <Header />
        {/* Wrapping the core content in <main> is a major SEO & Accessibility win */}
        <main id="main-content">
          <VideoMasonry />
          <SubmitBanner />
          <RigsForSale />
          <GearShop />
          <SkoolieSupport />
          <ClosingBanner />
        </main>
        <Footer />
      </div>
    </>
  );
}