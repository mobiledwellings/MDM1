import { Header } from "../components/Header";
import { RigsForSale } from "../components/RigsForSale";
import { Footer } from "../components/Footer";

export function RigsForSalePage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <RigsForSale />
      <Footer />
    </div>
  );
}
