import { useState } from "react";
import { HiMenu, HiX, HiMoon, HiSun, HiLockClosed, HiLogout } from "react-icons/hi";
import { FaYoutube, FaInstagram, FaFacebook } from "react-icons/fa";
import { HiMail } from "react-icons/hi";
import { useTheme } from "../contexts/ThemeContext";
import { useAdmin } from "../contexts/AdminContext";
import { AdminPasswordModal } from "./AdminPasswordModal";
import { AdminDashboard } from "./AdminDashboard";
import { Rig } from "../contexts/RigsContext";
import { RigDetail } from "./RigDetail";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);
  const [selectedRig, setSelectedRig] = useState<Rig | null>(null);

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    
    setMobileMenuOpen(false);
  };

  const { theme, toggleTheme } = useTheme();
  const { isAdmin, logout } = useAdmin();

  return (
    <>
      <header className="border-b border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 sticky top-0 z-50 transition-colors">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
              {/* SEO UPDATE: We wrapped your logo in an <h1> so Google knows this is the main topic of the page */}
              <h1>
                <a 
                  href="#videos" 
                  onClick={(e) => handleSmoothScroll(e, 'videos')}
                  className="tracking-tight text-2xl" 
                  style={{ fontFamily: "'Neue Haas Grotesk Display Pro', 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif", color: "#ffde5a", fontWeight: 700 }}
                >
                  MOBILE DWELLINGS
                </a>
              </h1>

              {/* SEO UPDATE: Added aria-label so search bots understand this is your primary navigation menu */}
              <nav className="hidden md:flex items-center gap-8" aria-label="Main Navigation">
                <a 
                  href="#submit" 
                  onClick={(e) => handleSmoothScroll(e, 'submit')}
                  className="text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors" 
                  style={{ fontFamily: "'Morl', 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif", fontWeight: 700, textTransform: 'uppercase', fontSize: '1rem', textAlign: 'center' }}
                >
                  Get Featured
                </a>
                <a 
                  href="#rigs" 
                  onClick={(e) => handleSmoothScroll(e, 'rigs')}
                  className="text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors" 
                  style={{ fontFamily: "'Morl', 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif", fontWeight: 700, textTransform: 'uppercase', fontSize: '1rem', textAlign: 'center' }}
                >
                  Rigs For Sale
                </a>
                <a 
                  href="#sell-your-rig" 
                  onClick={(e) => handleSmoothScroll(e, 'sell-your-rig')}
                  className="text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors" 
                  style={{ fontFamily: "'Morl', 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif", fontWeight: 700, textTransform: 'uppercase', fontSize: '1rem', textAlign: 'center' }}
                >
                  Sell your Rig
                </a>
                <a 
                  href="#skoolie-support" 
                  onClick={(e) => handleSmoothScroll(e, 'skoolie-support')}
                  className="text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors" 
                  style={{ fontFamily: "'Morl', 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif", fontWeight: 700, textTransform: 'uppercase', fontSize: '1rem', textAlign: 'center' }}
                >
                  Skoolie Support
                </a>
              </nav>
            
            <div className="flex items-center gap-2">
              {/* Social Media Links */}
              <div className="hidden md:flex items-center gap-3">
                <a 
                  href="https://youtube.com/@mobiledwellings" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors"
                  aria-label="YouTube Channel"
                >
                  <FaYoutube className="w-[25.5px] h-[25.5px]" />
                </a>
                <a 
                  href="https://www.instagram.com/mobile.dwellings/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors"
                  aria-label="Instagram Profile"
                >
                  <FaInstagram className="w-5 h-5" />
                </a>
                <a 
                  href="https://www.facebook.com/mobiledwellings" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors"
                  aria-label="Facebook Page"
                >
                  <FaFacebook className="w-5 h-5" />
                </a>
                <a 
                  href="mailto:gilliganphantom@gmail.com" 
                  className="text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors"
                  aria-label="Send Email"
                >
                  <HiMail className="w-5 h-5" />
                </a>
              </div>
              
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors p-2"
                aria-label="Toggle Dark/Light Mode"
              >
                {theme === 'light' ? <HiMoon className="w-5 h-5" /> : <HiSun className="w-5 h-5" />}
              </button>
              
              <button 
                className="md:hidden text-neutral-600 dark:text-neutral-300"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Open Mobile Menu"
              >
                {mobileMenuOpen ? <HiX className="w-7 h-7" /> : <HiMenu className="w-7 h-7" />}
              </button>
            </div>
          </div>

          {mobileMenuOpen && (
            <nav className="md:hidden pt-4 pb-2 flex flex-col gap-3" aria-label="Mobile Navigation">
              <a 
                href="#submit" 
                onClick={(e) => handleSmoothScroll(e, 'submit')}
                className="text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors" 
                style={{ fontFamily: "'Neue Haas Grotesk Display Pro', 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif", fontWeight: 700, textTransform: 'uppercase' }}
              >
                Get Featured
              </a>
              <a 
                href="#rigs" 
                onClick={(e) => handleSmoothScroll(e, 'rigs')}
                className="text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors" 
                style={{ fontFamily: "'Neue Haas Grotesk Display Pro', 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif", fontWeight: 700, textTransform: 'uppercase' }}
              >
                Rigs For Sale
              </a>
              <a 
                href="#sell-your-rig" 
                onClick={(e) => handleSmoothScroll(e, 'sell-your-rig')}
                className="text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors" 
                style={{ fontFamily: "'Neue Haas Grotesk Display Pro', 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif", fontWeight: 700, textTransform: 'uppercase' }}
              >
                Sell your Rig
              </a>
              <a 
                href="#skoolie-support" 
                onClick={(e) => handleSmoothScroll(e, 'skoolie-support')}
                className="text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors" 
                style={{ fontFamily: "'Neue Haas Grotesk Display Pro', 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif", fontWeight: 700, textTransform: 'uppercase' }}
              >
                Skoolie Support
              </a>
              <a 
                href="#about" 
                onClick={(e) => handleSmoothScroll(e, 'about')}
                className="text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors" 
                style={{ fontFamily: "'Neue Haas Grotesk Display Pro', 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif", fontWeight: 700, textTransform: 'uppercase' }}
              >
                About
              </a>
              {isAdmin && (
                <button
                  onClick={() => {
                    setShowAdminDashboard(true);
                    setMobileMenuOpen(false);
                  }}
                  className="text-left text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors" 
                  style={{ fontFamily: "'Neue Haas Grotesk Display Pro', 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif", fontWeight: 700, textTransform: 'uppercase' }}
                >
                  Admin Dashboard
                </button>
              )}
            </nav>
          )}
        </div>
      </header>

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