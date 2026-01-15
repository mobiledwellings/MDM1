import { Link } from "react-router-dom";
import { HiExternalLink, HiArrowRight } from "react-icons/hi";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useDeals, Product, ProductCategory } from "../contexts/DealsContext";

const categoryLabels: Record<ProductCategory, string> = {
  featured: "Featured",
  batteries: "Batteries",
  inverters: "Inverters",
  "charge-controllers": "Charge Controllers",
  "solar-panels": "Solar Panels",
  "solar-racks": "Solar Racks",
  "mini-splits": "Mini Splits",
  "solar-generators": "Solar Generators",
  "water-heaters": "Water Heaters",
};

// Helper to render text with **bold** markdown support
function FormattedText({ text, className }: { text: string; className?: string }) {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return (
    <p className={className}>
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={i} className="font-semibold text-neutral-800 dark:text-neutral-200">{part.slice(2, -2)}</strong>;
        }
        return <span key={i}>{part}</span>;
      })}
    </p>
  );
}

function ProductCard({ product }: { product: Product }) {
  return (
    <article 
      className="bg-white dark:bg-neutral-900 rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-700 transition-all duration-300 hover:shadow-lg"
    >
      <div className="relative aspect-square overflow-hidden bg-neutral-100 dark:bg-neutral-800">
        <ImageWithFallback 
          src={product.thumbnail}
          alt={product.name}
          className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
        />
      </div>
      
      <div className="p-4">
        <div className="text-neutral-500 dark:text-neutral-400 text-xs uppercase tracking-wider mb-2 font-bold">
          {categoryLabels[product.category]}
        </div>
        <h3 className="text-lg font-bold mb-2 dark:text-white transition-colors line-clamp-2">
          {product.name}
        </h3>
        <div className="text-sm mb-3">
          <span className="font-semibold text-neutral-900 dark:text-white">{product.price}</span>
          {product.discount && product.couponCode && (
            <span className="text-neutral-600 dark:text-neutral-400">
              {" "}but use code <span className="font-mono font-semibold text-green-600 dark:text-green-400">{product.couponCode}</span> for <span className="text-green-600 dark:text-green-400 font-semibold">{product.discount}</span> at checkout
            </span>
          )}
        </div>

        {/* Shop Now Button */}
        <a
          href={product.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 w-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 px-4 py-2.5 rounded-lg font-bold hover:bg-neutral-700 dark:hover:bg-neutral-200 transition-colors text-sm"
        >
          Shop Now <HiExternalLink className="w-4 h-4" />
        </a>
      </div>

      {/* Product Details - Below CTA */}
      {product.description && (
        <div className="px-4 pb-4 border-t border-neutral-200 dark:border-neutral-700 pt-4">
          <FormattedText 
            text={product.description} 
            className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed whitespace-pre-line"
          />
        </div>
      )}
    </article>
  );
}

export function GearShop() {
  const { products, loading } = useDeals();

  // Get featured products sorted by sortOrder
  const featuredProducts = products
    .filter(p => p && p.featured)
    .sort((a, b) => (a.sortOrder ?? 999) - (b.sortOrder ?? 999))
    .slice(0, 6); // Show up to 6 featured products on homepage

  if (loading) {
    return (
      <section id="gear" className="bg-neutral-50 dark:bg-neutral-800 border-y border-neutral-200 dark:border-neutral-700">
        <div className="max-w-7xl mx-auto px-6 py-12 md:py-20">
          <p className="text-center text-neutral-600 dark:text-neutral-400">Loading gear...</p>
        </div>
      </section>
    );
  }

  if (featuredProducts.length === 0) {
    return null; // Don't show section if no featured products
  }

  return (
    <section id="gear" className="bg-neutral-50 dark:bg-neutral-800 border-y border-neutral-200 dark:border-neutral-700">
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-20">
        <div className="mb-12">
          <h2 className="text-center mb-4 dark:text-white text-3xl font-bold text-neutral-800">
            The Mobile Dwellings Gear Shop
          </h2>
          <p className="text-center text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
            Gear I actually use and recommend for your conversion. Affiliate links support the channel at no extra cost to you.
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 items-start">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* View All Link */}
        <div className="mt-12 text-center">
          <Link
            to="/deals"
            className="inline-flex items-center gap-2 px-6 py-3 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-full font-bold hover:bg-neutral-700 dark:hover:bg-neutral-200 transition-colors"
          >
            View All Gear & Deals <HiArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
