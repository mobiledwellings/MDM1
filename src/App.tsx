import { HashRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { RigsProvider } from "./contexts/RigsContext";
import { AdminProvider } from "./contexts/AdminContext";
import { HomePage } from "./pages/HomePage";
import { RigsForSalePage } from "./pages/RigsForSalePage";
import { SellYourRigPage } from "./pages/SellYourRigPage";
import { AboutPage } from "./pages/AboutPage";
import { SkoolieSupportPage } from "./pages/SkoolieSupportPage";
import { RigDetailPage } from "./pages/RigDetailPage";
import { Toaster } from "sonner";

export default function App() {
  return (
    <ThemeProvider>
      <AdminProvider>
        <RigsProvider>
          <Toaster position="top-center" />
          <HashRouter>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/rigs-for-sale" element={<RigsForSalePage />} />
              <Route path="/rigs/:id" element={<RigDetailPage />} />
              <Route path="/sell-your-rig" element={<SellYourRigPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/skoolie-support" element={<SkoolieSupportPage />} />
            </Routes>
          </HashRouter>
        </RigsProvider>
      </AdminProvider>
    </ThemeProvider>
  );
}