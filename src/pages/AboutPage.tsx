import { Header } from "../components/Header";
import { About } from "../components/About";
import { Footer } from "../components/Footer";
import { SEO } from "../components/SEO";

export function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="About | Skoolie & Van Life Documentary Series"
        description="Mobile Dwellings is a documentary video series featuring converted school buses, overland rigs, van conversions, tiny homes, and liveaboard sailboats. Meet the people behind the builds and the stories that drive alternative mobile living."
        keywords="mobile dwellings, skoolie documentary, van life videos, bus conversion tours, overland rig tours, tiny home videos, alternative living, mobile living stories"
        url="https://mobiledwellings.media/about"
      />
      <Header />
      <About />
      <Footer />
    </div>
  );
}
