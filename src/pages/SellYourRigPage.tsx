import { Header } from "../components/Header";
import { SellYourRig } from "../components/SellYourRig";
import { Footer } from "../components/Footer";
import { SEO } from "../components/SEO";
import { HiLightningBolt, HiGlobeAlt, HiCurrencyDollar } from "react-icons/hi";

export function SellYourRigPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-neutral-900">
      <SEO 
        title="Sell Your Rig | List Your Skoolie, Van, or Tiny Home"
        description="Reach thousands of buyers in the mobile dwelling community. List your school bus conversion, camper van, or tiny home on Mobile Dwellings today."
      />

      <Header />

      <main>
        {/* Value Proposition Header */}
        <section className="bg-neutral-50 dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700 py-16 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold text-neutral-900 dark:text-white mb-6">
              Sell Your Build to the <span className="text-blue-600">Right Audience</span>
            </h1>
            <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-10">
              Don't get lost in generic marketplaces. List your rig where enthusiasts look for quality conversions.
            </p>

            {/* Quick Stats/Features for SEO */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <HiLightningBolt className="text-blue-600 w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold dark:text-white">Fast Listing</h3>
                  <p className="text-sm text-neutral-500">Upload photos and specs in under 5 minutes.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                  <HiGlobeAlt className="text-green-600 w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold dark:text-white">Huge Reach</h3>
                  <p className="text-sm text-neutral-500">Your rig seen by thousands of active buyers.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
                  <HiCurrencyDollar className="text-yellow-600 w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold dark:text-white">0% Commission</h3>
                  <p className="text-sm text-neutral-500">We don't take a cut. You handle the sale directly.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* The Form Component */}
        <div className="py-12">
          <SellYourRig />
        </div>
      </main>

      <Footer />
    </div>
  );
}