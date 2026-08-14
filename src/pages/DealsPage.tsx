import { Link, useSearchParams } from "react-router-dom";
import { SEO } from "../components/SEO";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { HiExternalLink, HiPencil, HiTrash, HiStar, HiUpload, HiX, HiCheck, HiClipboardCopy } from "react-icons/hi";
import { useState } from "react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useDeals, Product, ProductCategory } from "../contexts/DealsContext";
import { useAdmin } from "../contexts/AdminContext";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { toast } from "sonner";

// Products are now managed via DealsContext

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

const categoryOptions: { value: ProductCategory; label: string }[] = [
  { value: "batteries", label: "Batteries" },
  { value: "inverters", label: "Inverters" },
  { value: "charge-controllers", label: "Charge Controllers" },
  { value: "solar-panels", label: "Solar Panels" },
  { value: "solar-racks", label: "Solar Racks" },
  { value: "mini-splits", label: "Mini Splits" },
  { value: "solar-generators", label: "Solar Generators" },
  { value: "water-heaters", label: "Water Heaters" },
];

// src/index.css is a pre-compiled Tailwind build, so only the utilities already
// in that file exist — an arbitrary value like `bg-[#ffde5a]` silently renders
// as nothing. Every brand color below is therefore applied inline.
const BRAND_INK = "#171717"; // Dark ink for text sitting on a light brand color.

type CouponOffer = {
  /** Partner name shown as the card heading. */
  brand: string;
  /** Short positioning line under the brand name. */
  kicker: string;
  code: string;
  /** Affiliate URL — the primary CTA target. */
  url: string;
  ctaLabel: string;
  /** Sentence describing the discount and what it covers. */
  blurb: string;
  /** Fine print under the CTAs. */
  finePrint: string;
  /** Optional internal link to a full details page. Omitted for partners
   *  without a published page (WattCycle is still in DRAFT_PARTNERS). */
  detailsHref?: string;
  /** Ticket background. Kept dark/saturated in both themes so the brand color
   *  can run at full strength instead of being muted for light mode. */
  ticketBg: string;
  /** Code text on the ticket — must contrast against ticketBg. */
  codeColor: string;
  /** Primary (copy) button fill and its text color. */
  buttonBg: string;
  buttonInk: string;
  /** DOM id for the code text, used by the clipboard selection fallback. */
  elementId: string;
};

const SIGNATURE_SOLAR_OFFER: CouponOffer = {
  brand: "Signature Solar",
  kicker: "Our pick for inverters, batteries and solar panels",
  code: "MD50OFF",
  url: "https://signaturesolar.com/?ref=mobiledwellings",
  ctaLabel: "Shop Signature Solar →",
  blurb:
    "$50 off orders over $500 on EG4 inverters, lithium batteries, solar panels, and mini splits. Our go to source for off-grid gear.",
  finePrint: "Apply at checkout on signaturesolar.com. Works on most products sitewide.",
  detailsHref: "/signature-solar-coupon",
  ticketBg: BRAND_INK,
  codeColor: "#ffde5a", // Mobile Dwellings logo yellow (Header.tsx)
  buttonBg: "#ffde5a",
  buttonInk: BRAND_INK,
  elementId: "signature-solar-coupon-code",
};

const WATTCYCLE_OFFER: CouponOffer = {
  brand: "WattCycle",
  kicker: "Our budget choice for batteries",
  code: "DWELLINGS",
  url: "https://www.wattcycle.com/?ref=mobiledwellings",
  ctaLabel: "Shop WattCycle →",
  blurb:
    "8% off WattCycle LiFePO4 batteries: budget-friendly 12V, 24V, and 48V packs with built-in BMS for skoolie, van, and RV builds.",
  finePrint: "Apply at checkout on wattcycle.com.",
  // WattCycle brand blue, sampled from wattcycle.com (#033ACD). White code text
  // keeps contrast on the saturated blue ticket.
  ticketBg: "#033ACD",
  codeColor: "#ffffff",
  buttonBg: "#033ACD",
  buttonInk: "#ffffff",
  elementId: "wattcycle-coupon-code",
};

const COUPON_OFFERS: CouponOffer[] = [SIGNATURE_SOLAR_OFFER, WATTCYCLE_OFFER];

/**
 * Copy state for one coupon code, shared by that card's ticket and its copy
 * button so clicking either surface copies and both show "Copied!".
 */
function useCopyCode(code: string, elementId: string) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      // The Clipboard API rejects on non-secure origins, when permission is
      // denied, and in some in-app browsers. Select the code instead so the
      // buyer can still copy it manually rather than getting no response.
      // The ticket is `select-none` so ordinary clicks never leave text
      // highlighted; re-enable selection on this element for the fallback only.
      const el = document.getElementById(elementId);
      const selection = window.getSelection();
      if (el && selection) {
        el.style.userSelect = "text";
        const range = document.createRange();
        range.selectNodeContents(el);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return { copied, copy };
}

/**
 * One partner coupon card: click-to-copy ticket, copy button, and a direct
 * affiliate CTA. Rendered side by side on desktop, stacked on mobile.
 */
function CouponCard({ offer }: { offer: CouponOffer }) {
  const { copied, copy } = useCopyCode(offer.code, offer.elementId);

  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg p-8 text-center flex flex-col">
      <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-1">{offer.brand}</h3>
      <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-4">{offer.kicker}</p>

      <button
        type="button"
        onClick={copy}
        aria-label={`Copy ${offer.brand} coupon code ${offer.code}`}
        title="Click to copy"
        className="flex flex-wrap items-center justify-center gap-3 border-2 border-dashed rounded-lg px-4 py-4 mb-6 select-none transition-opacity hover:opacity-90"
        style={{ backgroundColor: offer.ticketBg, borderColor: offer.codeColor }}
      >
        <span
          className="text-xs uppercase"
          style={{ letterSpacing: "0.18em", color: offer.codeColor, opacity: 0.7 }}
        >
          {copied ? "Copied" : "Code"}
        </span>
        <span
          id={offer.elementId}
          className="font-mono font-bold leading-none"
          style={{
            color: offer.codeColor,
            fontSize: "clamp(1.5rem, 5vw, 2.25rem)",
            letterSpacing: "0.06em",
          }}
        >
          {offer.code}
        </span>
      </button>

      <div className="flex flex-wrap gap-4 justify-center mb-6">
        <button
          onClick={copy}
          aria-label={`Copy coupon code ${offer.code}`}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm border-2 transition-opacity hover:opacity-90"
          // border-transparent is absent from the compiled stylesheet; the
          // inline color keeps this the same height as the outlined CTA.
          style={{ backgroundColor: offer.buttonBg, color: offer.buttonInk, borderColor: "transparent" }}
        >
          {copied ? (
            <>
              <HiCheck className="w-4 h-4" />
              Copied!
            </>
          ) : (
            <>
              <HiClipboardCopy className="w-4 h-4" />
              Copy Code
            </>
          )}
        </button>
        <a
          href={offer.url}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-semibold text-sm border-2 border-neutral-300 dark:border-neutral-600 text-neutral-900 dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
        >
          {offer.ctaLabel}
        </a>
      </div>

      <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-3">{offer.blurb}</p>
      <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-auto">
        {offer.finePrint}
        {offer.detailsHref && (
          <>
            {" "}
            <Link
              to={offer.detailsHref}
              className="underline hover:text-neutral-700 dark:hover:text-neutral-300"
            >
              Full details &amp; FAQ →
            </Link>
          </>
        )}
      </p>
    </div>
  );
}

function CopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="ml-2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors"
      title="Copy code"
    >
      {copied ? (
        <HiCheck className="w-4 h-4 text-green-500" />
      ) : (
        <HiClipboardCopy className="w-4 h-4" />
      )}
    </button>
  );
}

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

function ProductCard({ product, isAdmin, onEdit, onDelete, onToggleFeatured }: { 
  product: Product; 
  isAdmin?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  onToggleFeatured?: () => void;
}) {
  return (
    <article 
      className="bg-white dark:bg-neutral-900 rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-700 transition-all duration-300 hover:shadow-lg relative"
    >
      {/* Admin Controls */}
      {isAdmin && (
        <div className="absolute top-2 right-2 z-10 flex gap-1">
          <button
            onClick={onToggleFeatured}
            className={`p-1.5 rounded-full transition-colors ${product.featured ? 'bg-amber-500 text-white' : 'bg-white/80 dark:bg-neutral-800/80 text-neutral-600 dark:text-neutral-400 hover:bg-amber-100'}`}
            title={product.featured ? "Remove from featured" : "Add to featured"}
          >
            <HiStar className="w-4 h-4" />
          </button>
          <button
            onClick={onEdit}
            className="p-1.5 bg-white/80 dark:bg-neutral-800/80 rounded-full text-neutral-600 dark:text-neutral-400 hover:bg-blue-100 hover:text-blue-600 transition-colors"
            title="Edit product"
          >
            <HiPencil className="w-4 h-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-1.5 bg-white/80 dark:bg-neutral-800/80 rounded-full text-neutral-600 dark:text-neutral-400 hover:bg-red-100 hover:text-red-600 transition-colors"
            title="Delete product"
          >
            <HiTrash className="w-4 h-4" />
          </button>
        </div>
      )}
      
      <div className="relative aspect-[3/4] overflow-hidden bg-white dark:bg-neutral-800 p-6">
        <ImageWithFallback 
          src={product.thumbnail}
          alt={product.name}
          className="w-full h-full object-contain transition-all duration-500 group-hover:scale-105"
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
              {" "}but use code <span className="font-mono font-semibold text-green-800 dark:text-green-400">{product.couponCode}</span> for <span className="text-green-800 dark:text-green-400 font-semibold">{product.discount}</span> at checkout
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

// Valid filter values — used to validate the ?filter=... URL param so an
// arbitrary string in the URL can't poison state.
const VALID_FILTERS: readonly (ProductCategory | "featured")[] = [
  "featured",
  "batteries",
  "inverters",
  "charge-controllers",
  "solar-panels",
  "solar-racks",
  "mini-splits",
  "solar-generators",
  "water-heaters",
] as const;

function parseFilterParam(raw: string | null): ProductCategory | "featured" {
  return raw && (VALID_FILTERS as readonly string[]).includes(raw)
    ? (raw as ProductCategory | "featured")
    : "featured";
}

export function DealsPage() {
  const { products, addProduct, updateProduct, deleteProduct, toggleFeatured, loading, uploadImage } = useDeals();
  const { isAdmin } = useAdmin();

  // URL is the source of truth for the active filter. Reading via useSearchParams
  // lets the coupon page (and anyone) deep-link to e.g. /deals?filter=batteries.
  const [searchParams, setSearchParams] = useSearchParams();
  const filter = parseFilterParam(searchParams.get("filter"));
  const setFilter = (next: ProductCategory | "featured") => {
    const params = new URLSearchParams(searchParams);
    if (next === "featured") {
      params.delete("filter");
    } else {
      params.set("filter", next);
    }
    setSearchParams(params);
  };
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [formCategory, setFormCategory] = useState<ProductCategory>("batteries");
  const [thumbnailPreview, setThumbnailPreview] = useState<string>("");
  const [highlightsInput, setHighlightsInput] = useState("");

  const filteredProducts = (filter === "featured"
    ? products.filter(p => p && p.featured)
    : products.filter(p => p && p.category === filter)
  ).sort((a, b) => (a.sortOrder ?? 999) - (b.sortOrder ?? 999));

  const categories: { key: ProductCategory | "featured"; label: string }[] = [
    { key: "featured", label: "Featured" },
    { key: "batteries", label: "Batteries" },
    { key: "inverters", label: "Inverters" },
    { key: "charge-controllers", label: "Charge Controllers" },
    { key: "solar-panels", label: "Solar Panels" },
    { key: "solar-racks", label: "Solar Racks" },
    { key: "mini-splits", label: "Mini Splits" },
    { key: "solar-generators", label: "Solar Generators" },
    { key: "water-heaters", label: "Water Heaters" },
  ];

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        // Keep original aspect ratio, max dimension 800px
        const maxSize = 800;
        let width = img.width;
        let height = img.height;
        
        if (width > height) {
          if (width > maxSize) {
            height = (height * maxSize) / width;
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = (width * maxSize) / height;
            height = maxSize;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        
        if (ctx) {
          // Fill with white background for transparent images
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, width, height);
          ctx.drawImage(img, 0, 0, width, height);
        }
        setThumbnailPreview(canvas.toDataURL('image/jpeg', 0.85));
      };
      img.onerror = () => {
        console.error('Failed to load image');
      };
      img.src = event.target?.result as string;
    };
    reader.onerror = () => {
      console.error('Failed to read file');
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      // Upload image to Supabase if there's a new base64 image
      let thumbnailUrl = editingProduct?.thumbnail || "";
      if (thumbnailPreview && thumbnailPreview.startsWith('data:')) {
        toast.loading('Uploading image...', { id: 'upload-toast' });
        const uploadedUrl = await uploadImage(thumbnailPreview, editingProduct?.id);
        if (uploadedUrl) {
          thumbnailUrl = uploadedUrl;
        } else {
          toast.dismiss('upload-toast');
          toast.error('Failed to upload image. Please try again.');
          setIsSubmitting(false);
          return;
        }
        toast.dismiss('upload-toast');
      }

      const sortOrderValue = formData.get('sortOrder') as string;
      const productData: Omit<Product, 'id'> = {
        name: formData.get('name') as string,
        shortDescription: formData.get('shortDescription') as string || undefined,
        description: formData.get('description') as string,
        price: formData.get('price') as string,
        originalPrice: formData.get('originalPrice') as string || undefined,
        couponCode: formData.get('couponCode') as string || undefined,
        discount: formData.get('discount') as string || undefined,
        link: formData.get('link') as string,
        thumbnail: thumbnailUrl,
        category: formCategory,
        featured: formData.get('featured') === 'on',
        highlights: highlightsInput.split(',').map(h => h.trim()).filter(h => h),
        sortOrder: sortOrderValue ? parseInt(sortOrderValue, 10) : undefined,
      };

      if (editingProduct) {
        await updateProduct(editingProduct.id, productData);
        toast.success('Product updated!');
      } else {
        await addProduct(productData);
        toast.success('Product added!');
      }

      // Reset form
      form.reset();
      setThumbnailPreview("");
      setHighlightsInput("");
      setFormCategory("batteries");
      setEditingProduct(null);
      setIsFormOpen(false);
    } catch (error) {
      console.error('Error submitting product:', error);
      toast.error('Failed to save product. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormCategory(product.category);
    setThumbnailPreview(product.thumbnail || "");
    setHighlightsInput(product.highlights?.join(', ') || "");
    setIsFormOpen(true);
  };

  const handleDelete = async (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      await deleteProduct(productId);
      toast.success('Product deleted');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-neutral-900 flex items-center justify-center">
        <p className="text-neutral-600 dark:text-neutral-400">Loading...</p>
      </div>
    );
  }

  return (
    <>
      <SEO
        title="Signature Solar Coupon Code MD50OFF – Best Gear for Skoolies & Overland Rigs"
        description="Exclusive Signature Solar coupon code: MD50OFF. Save on EG4 inverters, lithium batteries, solar panels, and more. Best gear for skoolies, bus conversions, and overland rigs — tested in real builds."
        keywords="Signature Solar coupon code, Signature Solar discount code, Signature Solar promo code, EG4 coupon code, Signature Solar deals, best inverter for skoolie, best lithium battery for bus conversion, skoolie solar panels, best mini split for skoolie, overland rig solar setup, bus conversion electrical, skoolie gear, off-grid solar kit, best charge controller for skoolie, overland rig battery, EG4 inverter coupon, Signature Solar skoolie"
        url="https://mobiledwellings.media/deals"
      />
      {/* FAQ structured data targets question-based searches that AI models love */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "What is the Signature Solar coupon code?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Use coupon code MD50OFF at signaturesolar.com for an exclusive discount on EG4 inverters, lithium batteries, solar panels, and more. This Signature Solar promo code is provided through our partnership and works on most products sitewide."
              }
            },
            {
              "@type": "Question",
              "name": "Does Signature Solar offer discount codes?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes. Signature Solar partners with creators and builders in the skoolie and overland community. Mobile Dwellings has an exclusive Signature Solar coupon code: MD50OFF. Enter it at checkout on signaturesolar.com to save."
              }
            },
            {
              "@type": "Question",
              "name": "What is the best inverter for a skoolie?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "For most skoolie builds, a 3000W pure sine wave inverter is ideal. The EG4 6000XP from Signature Solar is one of the most popular choices in the skoolie community. Use code MD50OFF at signaturesolar.com to save."
              }
            },
            {
              "@type": "Question",
              "name": "What are the best lithium batteries for a bus conversion?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "LiFePO4 (lithium iron phosphate) batteries are the gold standard for bus conversions and skoolies. They offer longer lifespan, lighter weight, and deeper discharge than AGM. See our recommended batteries, all tested in real builds."
              }
            },
            {
              "@type": "Question",
              "name": "What solar panels should I use for a van conversion?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Rigid monocrystalline panels (200W-400W) are the most efficient for van roofs. For curved skoolie roofs, flexible panels work well. We list our top picks with real-world test data and exclusive discount codes."
              }
            },
            {
              "@type": "Question",
              "name": "What is the best mini split for a skoolie or camper van?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "A 12V or 24V DC mini split is the most efficient climate control for skoolies and large van conversions. They run directly off your battery bank without needing an inverter. Browse our tested recommendations."
              }
            },
            {
              "@type": "Question",
              "name": "How much solar do I need for an overland rig?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Most overland rigs need 400W-800W of solar depending on power usage. Pair with a quality MPPT charge controller and lithium batteries for reliable off-grid power. See our full solar setup recommendations."
              }
            }
          ]
        }) }}
      />

      <div className="min-h-screen bg-white dark:bg-neutral-900 transition-colors">
        <Header />

        <main>
          <section className="bg-neutral-50 dark:bg-neutral-800 border-y border-neutral-200 dark:border-neutral-700">
            <div className="max-w-7xl mx-auto px-6 py-12 md:py-20">
              <div className="mb-12">
                {/* Search-intent header: buyers arriving from "signature solar
                    coupon code" see the code itself as the largest text on the
                    page, above the fold, before any other copy. */}
                {/* The H1 names the page; the ticket below carries the code at
                    a larger size. Repeating the code in both put two competing
                    focal points ~120px apart. The code still appears in the
                    <title>, meta description, ticket, and product cards. */}
                <h1 className="text-center mb-8 dark:text-white text-3xl md:text-4xl font-bold text-neutral-800">
                  Signature Solar Coupon Code + WattCycle Discount
                </h1>

                {/* Partner coupons — side by side on desktop, stacked on
                    mobile. Grid items stretch to equal height by default, so no
                    items-stretch/h-full needed (neither exists in the compiled
                    stylesheet anyway). */}
                <div className="max-w-6xl mx-auto mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                  {COUPON_OFFERS.map((offer) => (
                    <CouponCard key={offer.code} offer={offer} />
                  ))}
                </div>

                <h2 className="text-center mb-4 dark:text-white text-2xl font-bold text-neutral-800">
                  The Mobile Dwellings Gear Shop
                </h2>
                <p className="text-center text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto mb-4">
                  Inverters, batteries, solar, and more — tested in real skoolie and overland builds.
                </p>
                <p className="text-center text-sm text-neutral-500 dark:text-neutral-500 max-w-2xl mx-auto mb-8">
                  Affiliate links support the channel at no extra cost to you. Updated regularly with new deals.
                </p>

                {/* Category Filters */}
                <div className="flex flex-wrap gap-2 justify-center" role="group" aria-label="Filter products by category">
                  {categories.map(({ key, label }) => (
                    <button
                      key={key}
                      aria-pressed={filter === key}
                      onClick={() => setFilter(key)}
                      className={`px-4 py-2 rounded transition-colors font-medium ${
                        filter === key
                          ? "bg-neutral-900 dark:bg-neutral-700 text-white"
                          : "bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-700"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Product Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 items-start">
                {filteredProducts.length === 0 ? (
                  <div className="col-span-full text-center py-12">
                    <p className="text-neutral-500 dark:text-neutral-400">No products found in this category.</p>
                  </div>
                ) : (
                  filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      isAdmin={isAdmin}
                      onEdit={() => handleEdit(product)}
                      onDelete={() => handleDelete(product.id)}
                      onToggleFeatured={() => toggleFeatured(product.id)}
                    />
                  ))
                )}
              </div>

              {/* Admin: Add Product Button & Form */}
              {isAdmin && (
                <div className="mt-16">
                  <div className="flex justify-center mb-8">
                    <button
                      onClick={() => {
                        setEditingProduct(null);
                        setThumbnailPreview("");
                        setHighlightsInput("");
                        setFormCategory("batteries");
                        setIsFormOpen(!isFormOpen);
                      }}
                      className="px-8 py-3 bg-neutral-900 dark:bg-neutral-800 text-white hover:bg-neutral-700 dark:hover:bg-neutral-700 transition-colors rounded-full font-bold flex items-center gap-2 shadow-md"
                    >
                      {isFormOpen ? "Close Form" : "Add New Product"}
                    </button>
                  </div>

                  {isFormOpen && (
                    <div className="max-w-2xl mx-auto bg-white dark:bg-neutral-900 p-8 rounded-lg border border-neutral-200 dark:border-neutral-700 shadow-xl">
                      <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-6 text-center">
                        {editingProduct ? 'Edit Product' : 'Add New Product'}
                      </h3>
                      
                      <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Basic Info */}
                        <div className="space-y-4">
                          <Input 
                            name="name" 
                            placeholder="Product Name *" 
                            required 
                            defaultValue={editingProduct?.name}
                          />
                          <Input 
                            name="shortDescription" 
                            placeholder="Short Description (shows on card)" 
                            defaultValue={editingProduct?.shortDescription}
                          />
                          <Textarea 
                            name="description" 
                            placeholder="Full Description *" 
                            required 
                            rows={4}
                            defaultValue={editingProduct?.description}
                          />
                        </div>

                        {/* Category */}
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Category *</label>
                          <Select value={formCategory} onValueChange={(val) => setFormCategory(val as ProductCategory)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select Category" />
                            </SelectTrigger>
                            <SelectContent>
                              {categoryOptions.map(opt => (
                                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Pricing */}
                        <div className="grid grid-cols-2 gap-4">
                          <Input 
                            name="price" 
                            placeholder="Price (e.g. $299) *" 
                            required 
                            defaultValue={editingProduct?.price}
                          />
                          <Input 
                            name="originalPrice" 
                            placeholder="Original Price (optional)" 
                            defaultValue={editingProduct?.originalPrice}
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <Input 
                            name="couponCode" 
                            placeholder="Coupon Code (optional)" 
                            defaultValue={editingProduct?.couponCode}
                          />
                          <Input 
                            name="discount" 
                            placeholder="Discount (e.g. 20% off)" 
                            defaultValue={editingProduct?.discount}
                          />
                        </div>

                        {/* Link */}
                        <Input 
                          name="link" 
                          type="url" 
                          placeholder="Product Link (URL) *" 
                          required 
                          defaultValue={editingProduct?.link}
                        />

                        {/* Sort Order */}
                        <Input 
                          name="sortOrder" 
                          type="number" 
                          placeholder="Sort Order (lower = first, e.g. 1, 2, 3)" 
                          defaultValue={editingProduct?.sortOrder?.toString() || ''}
                        />

                        {/* Highlights */}
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                            Highlights (comma-separated)
                          </label>
                          <Input 
                            value={highlightsInput}
                            onChange={(e) => setHighlightsInput(e.target.value)}
                            placeholder="e.g. 4.8kWh capacity, Built-in BMS, 10-year warranty"
                          />
                        </div>

                        {/* Image Upload */}
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Product Image</label>
                          <div 
                            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                              thumbnailPreview ? 'border-green-500' : 'border-neutral-300 dark:border-neutral-600'
                            }`}
                          >
                            {thumbnailPreview ? (
                              <div className="relative">
                                <img src={thumbnailPreview} alt="Preview" className="max-h-48 mx-auto rounded" />
                                <button
                                  type="button"
                                  onClick={() => setThumbnailPreview("")}
                                  className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
                                >
                                  <HiX className="w-4 h-4" />
                                </button>
                              </div>
                            ) : (
                              <label className="cursor-pointer">
                                <HiUpload className="w-8 h-8 mx-auto text-neutral-400 mb-2" />
                                <span className="text-sm text-neutral-600 dark:text-neutral-400">Click to upload image</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={handleImageUpload}
                                />
                              </label>
                            )}
                          </div>
                        </div>

                        {/* Featured checkbox */}
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input 
                            type="checkbox" 
                            name="featured" 
                            defaultChecked={editingProduct?.featured}
                            className="w-4 h-4 rounded border-neutral-300"
                          />
                          <span className="text-sm text-neutral-700 dark:text-neutral-300">Featured product (shows on main page)</span>
                        </label>

                        {/* Submit */}
                        <button
                          type="submit"
                          className="w-full py-3 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-lg font-bold hover:bg-neutral-700 dark:hover:bg-neutral-200 transition-colors"
                        >
                          {editingProduct ? 'Update Product' : 'Add Product'}
                        </button>
                      </form>
                    </div>
                  )}
                </div>
              )}


            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}

