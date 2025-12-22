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
        title="Home"
        description="Discover unique mobile dwellings, converted school buses, and overland rigs for sale. Watch video tours from our YouTube channel and find your perfect tiny home on wheels."
        url="https://mobiledwellings.media"
      />
      
      <div className="min-h-screen bg-white dark:bg-neutral-900 transition-colors">
        <Header />
        <VideoMasonry />
        <SubmitBanner />
        <RigsForSale />
        <SkoolieSupport />
        <About />
        <ClosingBanner />
        <Footer />
      </div>
    </>
  );
}