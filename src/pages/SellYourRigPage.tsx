import { Header } from "../components/Header";
import { SellYourRig } from "../components/SellYourRig";
import { Footer } from "../components/Footer";

export function SellYourRigPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <SellYourRig />
      <Footer />
    </div>
  );
}
