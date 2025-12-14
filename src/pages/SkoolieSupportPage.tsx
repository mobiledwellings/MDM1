import { Header } from "../components/Header";
import { SkoolieSupport } from "../components/SkoolieSupport";
import { Footer } from "../components/Footer";

export function SkoolieSupportPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <SkoolieSupport />
      <Footer />
    </div>
  );
}
