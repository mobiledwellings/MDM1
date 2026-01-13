import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { projectId, publicAnonKey } from '../utils/supabase/info';

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
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (productId: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
  toggleFeatured: (productId: string) => Promise<void>;
  uploadImage: (base64Image: string, productId?: string) => Promise<string | null>;
}

const DealsContext = createContext<DealsContextType | undefined>(undefined);

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-3ab5944d`;

// Default products to show initially (only used if server returns empty)
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

  // Fetch products from server on mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/deals`, {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          // data is an array of {key, value} objects from KV store
          const productsArray = Array.isArray(data) 
            ? data.map((item: { value: Product }) => item.value)
            : [];
          
          if (productsArray.length > 0) {
            setProducts(productsArray);
          } else {
            // Initialize with defaults if server has no products
            setProducts(defaultProducts);
            // Save defaults to server
            for (const product of defaultProducts) {
              await fetch(`${API_BASE_URL}/deals`, {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${publicAnonKey}`,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(product),
              });
            }
          }
        } else {
          console.error('Failed to fetch deals from server');
          setProducts(defaultProducts);
        }
      } catch (error) {
        console.error('Error fetching deals:', error);
        setProducts(defaultProducts);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Upload image to Supabase storage via server
  const uploadImage = async (base64Image: string, productId?: string): Promise<string | null> => {
    try {
      const response = await fetch(`${API_BASE_URL}/deals/upload-image`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ base64Image, productId }),
      });

      if (response.ok) {
        const data = await response.json();
        return data.url;
      } else {
        console.error('Failed to upload image');
        return null;
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    }
  };

  const addProduct = async (product: Omit<Product, 'id'>) => {
    try {
      const response = await fetch(`${API_BASE_URL}/deals`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(product),
      });

      if (response.ok) {
        const data = await response.json();
        setProducts(prev => [...prev, data.product]);
      } else {
        console.error('Failed to add product');
      }
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const updateProduct = async (productId: string, updates: Partial<Product>) => {
    try {
      const response = await fetch(`${API_BASE_URL}/deals/${productId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (response.ok) {
        const data = await response.json();
        setProducts(prev => 
          prev.map(p => p.id === productId ? data.product : p)
        );
      } else {
        console.error('Failed to update product');
      }
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const deleteProduct = async (productId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/deals/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });

      if (response.ok) {
        setProducts(prev => prev.filter(p => p.id !== productId));
      } else {
        console.error('Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const toggleFeatured = async (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      await updateProduct(productId, { featured: !product.featured });
    }
  };

  return (
    <DealsContext.Provider value={{ products, loading, addProduct, updateProduct, deleteProduct, toggleFeatured, uploadImage }}>
      {children}
    </DealsContext.Provider>
  );
}

export function useDeals() {
  const context = useContext(DealsContext);
  if (context === undefined) throw new Error("useDeals must be used within a DealsProvider");
  return context;
}