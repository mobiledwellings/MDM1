import { Link } from "react-router-dom";
import { SEO } from "../components/SEO";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { HiExternalLink } from "react-icons/hi";

interface Product {
  name: string;
  price: string;
  couponCode?: string;
  link: string;
}

interface ProductSection {
  title: string;
  products: Product[];
}

const productSections: ProductSection[] = [
  {
    title: "Server Rack Batteries",
    products: [
      {
        name: "48V 100Ah Server Rack Battery",
        price: "~$600",
        couponCode: "MOBILEDWELLINGS",
        link: "https://example.com/48v-battery"
      },
      {
        name: "24V 100Ah Server Rack Battery",
        price: "~$400",
        couponCode: "MOBILEDWELLINGS",
        link: "https://example.com/24v-battery"
      }
    ]
  },
  {
    title: "Mini Split AC",
    products: [
      {
        name: "12,000 BTU Mini Split Air Conditioner",
        price: "~$800",
        couponCode: "MD10",
        link: "https://example.com/mini-split"
      }
    ]
  },
  {
    title: "Solar Panels",
    products: [
      {
        name: "200W Monocrystalline Solar Panel",
        price: "~$150",
        link: "https://example.com/solar-panel"
      }
    ]
  }
];

function ProductCard({ product }: { product: Product }) {
  return (
    <div className="py-4 border-b border-neutral-200 dark:border-neutral-700 last:border-b-0">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h4 className="font-medium text-neutral-900 dark:text-white">{product.name}</h4>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">{product.price}</p>
        </div>
        <div className="flex items-center gap-4">
          {product.couponCode && (
            <span className="text-sm font-mono bg-neutral-100 dark:bg-neutral-800 px-3 py-1 rounded text-neutral-700 dark:text-neutral-300">
              {product.couponCode}
            </span>
          )}
          <a
            href={product.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white flex items-center gap-1 transition-colors"
          >
            View <HiExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}

export function DealsPage() {
  return (
    <>
      <SEO
        title="Gear I Actually Use & Recommend"
        description="Coupon codes and recommended gear from Mobile Dwellings. Server rack batteries, mini split AC, solar panels, and more."
        url="https://mobiledwellings.media/deals"
      />

      <div className="min-h-screen bg-white dark:bg-neutral-900 transition-colors">
        <Header />

        <main className="max-w-3xl mx-auto px-6 py-16 md:py-24">
          <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white mb-4">
            Gear I Actually Use & Recommend
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 mb-12">
            Updated when prices or codes change. No spam. No fillers.
          </p>

          <div className="space-y-12">
            {productSections.map((section) => (
              <div key={section.title}>
                <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-4">
                  {section.title}
                </h2>
                <div className="bg-neutral-50 dark:bg-neutral-800 rounded-lg px-6">
                  {section.products.map((product) => (
                    <ProductCard key={product.name} product={product} />
                  ))}
                </div>
              </div>
            ))}
          </div>

          <p className="text-sm text-neutral-500 dark:text-neutral-500 mt-16 mb-8">
            These are the same systems featured in Mobile Dwellings tours.
          </p>

          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <Link
              to="/#videos"
              className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
            >
              Watch full rig tours
            </Link>
            <Link
              to="/#submit"
              className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
            >
              Apply to be featured
            </Link>
            <Link
              to="/#rigs"
              className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
            >
              Browse rigs for sale
            </Link>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
