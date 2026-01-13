import { createContext, useContext, useState, ReactNode, useEffect } from "react";

export type ProductCategory = "featured" | "batteries" | "inverters" | "charge-controllers" | "solar-panels" | "solar-racks" | "mini-splits" | "solar-generators" | "water-heaters";

export interface Product {
  id: string;
  name: string;
  description: string;
  shortDescription?: string;
  price: string;
  originalPrice?: string;
  couponCode?: string;
  discount?: string;
  link: string;
  thumbnail: string;
  galleryImages?: string[];
  category: ProductCategory;
  featured?: boolean;
  highlights?: string[];
  specs?: { label: string; value: string }[];
}

interface DealsContextType {
  products: Product[];
  loading: boolean;
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (productId: string, product: Partial<Product>) => void;
  deleteProduct: (productId: string) => void;
  toggleFeatured: (productId: string) => void;
}

const DealsContext = createContext<DealsContextType | undefined>(undefined);

const STORAGE_KEY = 'mobile-dwellings-deals';

// Default products to show initially
const defaultProducts: Product[] = [
  {
    id: "battery-48v-100ah",
    name: "48V 100Ah Server Rack LiFePO4 Battery",
    shortDescription: "Perfect for larger off-grid systems",
    description: "This is the exact battery I use in my builds. 48V 100Ah LiFePO4 chemistry means it's safe, long-lasting, and powerful enough to run any appliance.",
    price: "$599",
    originalPrice: "$799",
    couponCode: "MOBILEDWELLINGS",
    discount: "25% off",
    link: "https://example.com/48v-battery",
    thumbnail: "",
    category: "batteries",
    featured: true,
    highlights: ["4.8kWh capacity", "Built-in BMS", "10-year warranty"],
  },
  {
    id: "inverter-3000w",
    name: "3000W Pure Sine Wave Inverter",
    shortDescription: "Run any household appliance",
    description: "3000W continuous, 6000W surge. Pure sine wave output means you can run sensitive electronics.",
    price: "$299",
    originalPrice: "$399",
    couponCode: "MOBILE25",
    discount: "25% off",
    link: "https://example.com/inverter-3000w",
    thumbnail: "",
    category: "inverters",
    featured: true,
    highlights: ["Pure sine wave", "6000W surge", "LCD display"],
  },
  {
    id: "solar-200w-mono",
    name: "200W Monocrystalline Solar Panel",
    shortDescription: "High efficiency roof-mount panels",
    description: "High efficiency monocrystalline panels perfect for roof mounting on vans and buses.",
    price: "$149",
    link: "https://example.com/solar-200w",
    thumbnail: "",
    category: "solar-panels",
    featured: true,
    highlights: ["22% efficiency", "10-year warranty", "Low profile"],
  },
  {
    id: "minisplit-12k",
    name: "12,000 BTU Mini Split Air Conditioner",
    shortDescription: "The most efficient AC for mobile living",
    description: "This is THE mini split for van and bus builds. Runs efficiently on solar, provides both heating and cooling.",
    price: "$799",
    originalPrice: "$999",
    couponCode: "MOBILE10",
    discount: "20% off",
    link: "https://example.com/mini-split-12k",
    thumbnail: "",
    category: "mini-splits",
    featured: true,
    highlights: ["Heat & cool", "Runs on solar", "Whisper quiet"],
  },
  {
    id: "waterheater-propane",
    name: "On-Demand Propane Water Heater",
    shortDescription: "Instant hot water anywhere",
    description: "Tankless propane water heater provides endless hot water on demand.",
    price: "$139",
    link: "https://example.com/water-heater-propane",
    thumbnail: "",
    category: "water-heaters",
    featured: true,
    highlights: ["No electricity needed", "Instant hot water", "Compact"],
  },
];

export function DealsProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Load products from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setProducts(JSON.parse(stored));
      } catch {
        setProducts(defaultProducts);
      }
    } else {
      setProducts(defaultProducts);
    }
    setLoading(false);
  }, []);

  // Save to localStorage whenever products change
  useEffect(() => {
    if (!loading && products.length > 0) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
      } catch (e) {
        console.error('Failed to save to localStorage (quota exceeded?):', e);
        // If quota exceeded, try to save without images
        try {
          const productsWithoutImages = products.map(p => ({
            ...p,
            thumbnail: p.thumbnail?.startsWith('data:') ? '' : p.thumbnail,
            galleryImages: p.galleryImages?.filter(img => !img.startsWith('data:'))
          }));
          localStorage.setItem(STORAGE_KEY, JSON.stringify(productsWithoutImages));
        } catch (e2) {
          console.error('Failed to save even without images:', e2);
        }
      }
    }
  }, [products, loading]);

  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...product,
      id: `product-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
    setProducts(prev => [...prev, newProduct]);
  };

  const updateProduct = (productId: string, updates: Partial<Product>) => {
    setProducts(prev => 
      prev.map(p => p.id === productId ? { ...p, ...updates } : p)
    );
  };

  const deleteProduct = (productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
  };

  const toggleFeatured = (productId: string) => {
    setProducts(prev =>
      prev.map(p => p.id === productId ? { ...p, featured: !p.featured } : p)
    );
  };

  return (
    <DealsContext.Provider value={{ products, loading, addProduct, updateProduct, deleteProduct, toggleFeatured }}>
      {children}
    </DealsContext.Provider>
  );
}

export function useDeals() {
  const context = useContext(DealsContext);
  if (context === undefined) throw new Error("useDeals must be used within a DealsProvider");
  return context;
}
