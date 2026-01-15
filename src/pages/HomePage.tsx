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
        // Optimized for keywords people actually search for
        title="If you Build it You can Go"
        description="If You Build It You Can Go - Mobile Dwellings is a documentary series exploring alternative ways of living. Join a community of people embracing mobile lifestyles through conversions, builds, and real stories."
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