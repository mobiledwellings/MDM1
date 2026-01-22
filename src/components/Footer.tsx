import { FaYoutube, FaInstagram, FaFacebook } from "react-icons/fa";
import { HiMail, HiLockClosed, HiArrowRight } from "react-icons/hi";
import { useState } from "react";
import { useAdmin } from "../contexts/AdminContext";
import { AdminPasswordModal } from "./AdminPasswordModal";
import { AdminDashboard } from "./AdminDashboard";
import { Rig } from "../contexts/RigsContext";
import { RigDetail } from "./RigDetail";

export function Footer() {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);
  const [selectedRig, setSelectedRig] = useState<Rig | null>(null);
  const { isAdmin } = useAdmin();

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <footer className="border-t border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 text-center md:text-left">
            <div className="md:col-span-2 flex justify-center md:justify-start">
              <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">
                <span className="font-semibold">Mobile Dwellings</span> is a small team of storytellers featuring{" "}
                <a href="https://www.instagram.com/gilliganphantom" target="_blank" rel="noopener noreferrer" className="hover:text-neutral-900 dark:hover:text-white transition-colors font-semibold">
                  Justin
                </a>{" "}
                (Founder, Videographer, and Creative Director),{" "}
                <a href="https://www.instagram.com/zia_thebus/" target="_blank" rel="noopener noreferrer" className="hover:text-neutral-900 dark:hover:text-white transition-colors font-semibold">
                  Felicia
                </a>{" "}
                (Videographer and Social Media Management),{" "}
                <a href="https://www.instagram.com/thepricefamadventures/" target="_blank" rel="noopener noreferrer" className="hover:text-neutral-900 dark:hover:text-white transition-colors font-semibold">
                  Landon
                </a>{" "}
                (Videographer) and{" "}
                <a href="mailto:justin@mobiledwellings.media" className="hover:text-neutral-900 dark:hover:text-white transition-colors font-semibold">
                  Medha
                </a>{" "}
                (Our Superstar Editor). We are always looking to expand our team with more videographers so if you're interested in telling stories with us too please email us{" "}
                <a href="mailto:justin@mobiledwellings.media" className="hover:text-neutral-900 dark:hover:text-white transition-colors font-semibold">
                  here!
                </a>
              </p>
            </div>
            
            <div className="flex flex-col items-center md:items-end gap-6">
              <ul className="space-y-2 text-sm text-center md:text-right">
                <li>
                  <a href="#rigs" className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors font-semibold" onClick={(e) => handleSmoothScroll(e, 'rigs')}>
                    Rigs For Sale
                  </a>
                </li>
                <li>
                  <a href="#sell-your-rig" className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors font-semibold" onClick={(e) => handleSmoothScroll(e, 'sell-your-rig')}>
                    Sell Your Rig
                  </a>
                </li>
                <li>
                  <a href="#submit" className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors font-semibold" onClick={(e) => handleSmoothScroll(e, 'submit')}>
                    Get Featured
                  </a>
                </li>
                <li>
                  <a href="/deals" className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors font-semibold">
                    Deals & Coupons
                  </a>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-neutral-200 dark:border-neutral-700 pt-8 text-neutral-500 dark:text-neutral-400 text-xs text-center md:text-left">
            <p>
              &copy; {new Date().getFullYear()} Mobile Dwellings. All rights{' '}
              {isAdmin ? (
                <button
                  onClick={() => setShowAdminDashboard(true)}
                  className="hover:text-neutral-900 dark:hover:text-white transition-colors underline"
                  title="Admin Dashboard"
                >
                  reserved
                </button>
              ) : (
                <button
                  onClick={() => setShowPasswordModal(true)}
                  className="hover:text-neutral-900 dark:hover:text-white transition-colors underline"
                  title="Admin login"
                >
                  reserved
                </button>
              )}.
            </p>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AdminPasswordModal 
        open={showPasswordModal} 
        onClose={() => setShowPasswordModal(false)} 
      />
      <AdminDashboard 
        open={showAdminDashboard} 
        onClose={() => setShowAdminDashboard(false)}
        onViewRig={(rig) => {
          setSelectedRig(rig);
          setShowAdminDashboard(false);
        }}
      />
      {selectedRig && (
        <RigDetail 
          rig={selectedRig} 
          onClose={() => {
            setSelectedRig(null);
            setShowAdminDashboard(true);
          }} 
        />
      )}
    </>
  );
}