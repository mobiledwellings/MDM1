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
          // Filter out any null/undefined values and ensure each item has required fields
          const productsArray = Array.isArray(data) 
            ? data.filter((p: any) => p && typeof p === 'object' && p.id && p.name)
            : [];
          setProducts(productsArray);
        } else {
          console.error('Failed to fetch deals from server');
          setProducts([]);
        }
      } catch (error) {
        console.error('Error fetching deals:', error);
        setProducts([]);
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