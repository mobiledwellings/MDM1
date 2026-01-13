import { Link } from "react-router-dom";
import { SEO } from "../components/SEO";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { HiExternalLink, HiClipboardCopy, HiCheck, HiTag, HiChevronDown, HiChevronUp, HiPencil, HiTrash, HiStar, HiUpload } from "react-icons/hi";
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

function ProductCard({ product, isAdmin, onEdit, onDelete, onToggleFeatured }: { 
  product: Product; 
  isAdmin?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  onToggleFeatured?: () => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyCode = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.couponCode) {
      await navigator.clipboard.writeText(product.couponCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <article 
      className={`bg-white dark:bg-neutral-900 rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-700 transition-all duration-300 ${isExpanded ? 'shadow-xl' : 'hover:shadow-lg'} cursor-pointer relative`}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      {/* Admin Controls */}
      {isAdmin && (
        <div className="absolute top-2 right-2 z-10 flex gap-1" onClick={(e) => e.stopPropagation()}>
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
      
      <div className="relative aspect-square overflow-hidden bg-neutral-100 dark:bg-neutral-800">
        <ImageWithFallback 
          src={product.thumbnail}
          alt={product.name}
          className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
        />
        <div className="absolute bottom-3 right-3 bg-neutral-900 dark:bg-neutral-700 text-white px-3 py-1 text-sm rounded font-semibold">
          {product.price}
        </div>
        {product.discount && (
          <div className="absolute bottom-3 left-3 bg-green-600 text-white px-2 py-1 text-xs rounded font-semibold">
            {product.discount}
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="text-neutral-500 dark:text-neutral-400 text-xs uppercase tracking-wider mb-2 font-bold">
          {categoryLabels[product.category]}
        </div>
        <h3 className="text-lg font-bold mb-2 dark:text-white transition-colors line-clamp-2">
          {product.name}
        </h3>
        {product.shortDescription && (
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3 line-clamp-2">
            {product.shortDescription}
          </p>
        )}
        {product.highlights && product.highlights.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {product.highlights.slice(0, 3).map((highlight, index) => (
              <span key={index} className="text-xs bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 px-2 py-0.5 rounded">
                {highlight}
              </span>
            ))}
          </div>
        )}
        {product.couponCode && !isExpanded && (
          <div className="flex items-center gap-2 text-sm">
            <span className="font-mono bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded text-xs font-semibold">
              {product.couponCode}
            </span>
          </div>
        )}
        
        {/* Expand indicator */}
        <div className="flex items-center justify-center mt-3 text-neutral-400">
          {isExpanded ? (
            <HiChevronUp className="w-5 h-5" />
          ) : (
            <HiChevronDown className="w-5 h-5" />
          )}
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="px-4 pb-4 border-t border-neutral-200 dark:border-neutral-700 pt-4 space-y-4" onClick={(e) => e.stopPropagation()}>
          {/* Full Description */}
          <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
            {product.description}
          </p>

          {/* Coupon Code */}
          {product.couponCode && (
            <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
              <div className="text-xs text-amber-700 dark:text-amber-400 mb-1 font-medium">Use code at checkout:</div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-base font-bold bg-white dark:bg-neutral-800 px-3 py-1.5 rounded border border-amber-300 dark:border-amber-700 text-neutral-900 dark:text-white">
                  {product.couponCode}
                </span>
                <button
                  onClick={handleCopyCode}
                  className="p-1.5 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors"
                  title="Copy code"
                >
                  {copied ? (
                    <HiCheck className="w-5 h-5 text-green-500" />
                  ) : (
                    <HiClipboardCopy className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          )}

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
      )}
    </article>
  );
}

export function DealsPage() {
  const { products, addProduct, updateProduct, deleteProduct, toggleFeatured, loading, uploadImage } = useDeals();
  const { isAdmin } = useAdmin();
  const [filter, setFilter] = useState<ProductCategory | "featured">("featured");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [formCategory, setFormCategory] = useState<ProductCategory>("batteries");
  const [thumbnailPreview, setThumbnailPreview] = useState<string>("");
  const [highlightsInput, setHighlightsInput] = useState("");

  const filteredProducts = filter === "featured"
    ? products.filter(p => p.featured)
    : products.filter(p => p.category === filter);

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
        // Now using Supabase storage, we can use larger images
        const maxSize = 800;
        let width = img.width;
        let height = img.height;
        
        if (width > height && width > maxSize) {
          height = (height * maxSize) / width;
          width = maxSize;
        } else if (height > maxSize) {
          width = (width * maxSize) / height;
          height = maxSize;
        }
        
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        setThumbnailPreview(canvas.toDataURL('image/jpeg', 0.8));
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
        title="Deals & Coupon Codes | Gear I Actually Use"
        description="Exclusive coupon codes and recommended gear from Mobile Dwellings. Save on batteries, solar panels, mini split AC, inverters, and everything you need for your van or bus conversion."
        url="https://mobiledwellings.media/deals"
      />

      <div className="min-h-screen bg-white dark:bg-neutral-900 transition-colors">
        <Header />

        <main>
          <section className="bg-neutral-50 dark:bg-neutral-800 border-y border-neutral-200 dark:border-neutral-700">
            <div className="max-w-7xl mx-auto px-6 py-12 md:py-20">
              <div className="mb-12">
                <h1 className="text-center mb-8 dark:text-white text-3xl font-bold text-neutral-800">
                  The Mobile Dwellings Gear Shop
                </h1>
                <p className="text-center text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto mb-4">
                  Gear I actually use and recommend for your conversion. These are the same products featured in our builds — tested in real-world conditions.
                </p>
                <p className="text-center text-sm text-neutral-500 dark:text-neutral-500 max-w-2xl mx-auto mb-12">
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
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
                      {isFormOpen ? <HiChevronUp className="w-5 h-5" /> : <HiChevronDown className="w-5 h-5" />}
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

              {/* Help Section */}
              <div className="mt-16 p-6 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800 max-w-2xl mx-auto">
                <h3 className="font-semibold text-neutral-900 dark:text-white mb-2 text-center">
                  💡 Have a question about a product?
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 text-center">
                  Drop a comment on any of our videos or send us an email at{" "}
                  <a href="mailto:gilliganphantom@gmail.com" className="font-medium hover:text-neutral-900 dark:hover:text-white transition-colors underline">
                    gilliganphantom@gmail.com
                  </a>
                  . Happy to help you choose the right gear for your build.
                </p>
              </div>

              {/* Footer Links */}
              <div className="mt-12 flex flex-wrap gap-x-6 gap-y-2 text-sm justify-center">
                <Link
                  to="/#videos"
                  className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
                >
                  ← Watch full rig tours
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
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}
