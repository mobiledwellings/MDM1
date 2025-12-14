import { Header } from "../components/Header";
import { About } from "../components/About";
import { Footer } from "../components/Footer";

export function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <About />
      <Footer />
    </div>
  );
}
