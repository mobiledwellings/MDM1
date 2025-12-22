import { SEO } from "../components/SEO";
import { Header } from "../components/Header";
import { VideoMasonry } from "../components/VideoMasonry";
import { SubmitBanner } from "../components/SubmitBanner";
import { RigsForSale } from "../components/RigsForSale";
import { SkoolieSupport } from "../components/SkoolieSupport";
import { About } from "../components/About";
import { ClosingBanner } from "../components/ClosingBanner";
import { Footer } from "../components/Footer";

export function HomePage() {
  return (
    <>
      <SEO 
        // Optimized for keywords people actually search for
        title="Mobile Dwellings | Buy & Sell Skoolies, Van Conversions & Tiny Homes"
        description="The ultimate marketplace for nomadic living. Browse skoolies for sale, converted vans, and off-road rigs. Watch expert video tours and find your home on wheels."
        url="https://mobiledwellings.media"
      />
      
      <div className="min-h-screen bg-white dark:bg-neutral-900 transition-colors">
        <Header />
        {/* Wrapping the core content in <main> is a major SEO & Accessibility win */}
        <main id="main-content">
          <VideoMasonry />
          <SubmitBanner />
          <RigsForSale />
          <SkoolieSupport />
          <About />
          <ClosingBanner />
        </main>
        <Footer />
      </div>
    </>
  );
}