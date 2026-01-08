import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { ThemeProvider } from "./contexts/ThemeContext";
import { RigsProvider } from "./contexts/RigsContext";
import { AdminProvider } from "./contexts/AdminContext";
import { HomePage } from "./pages/HomePage";
import { RigsForSalePage } from "./pages/RigsForSalePage";
import { SellYourRigPage } from "./pages/SellYourRigPage";
import { AboutPage } from "./pages/AboutPage";
import { SkoolieSupportPage } from "./pages/SkoolieSupportPage";
import { RigDetailPage } from "./pages/RigDetailPage";
import { DealsPage } from "./pages/DealsPage";
import { Toaster } from "sonner";

export default function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <AdminProvider>
          <RigsProvider>
            <Toaster position="top-center" />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/rigs-for-sale" element={<RigsForSalePage />} />
                <Route path="/rigs/:id" element={<RigDetailPage />} />
                <Route path="/sell-your-rig" element={<SellYourRigPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/skoolie-support" element={<SkoolieSupportPage />} />
                <Route path="/deals" element={<DealsPage />} />
              </Routes>
            </BrowserRouter>
          </RigsProvider>
        </AdminProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}