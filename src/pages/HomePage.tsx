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
  );
}