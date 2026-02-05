import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { projectId, publicAnonKey } from '../utils/supabase/info';

export interface Rig {
  id: string;
  slug?: string; // Added for SEO
  title: string;
  type: string;
  price: string;
  location: string;
  thumbnail: string;
  externalLink: string;
  year?: string;
  highlights?: string[];
  buildDescription?: string;
  name?: string;
  mileage?: string;
  length?: string;
  story?: string;
  youtubeVideo?: string;
  instagram?: string;
  galleryImages?: string[];
  sold?: boolean;
  status?: 'available' | 'pending' | 'sold';
  featured?: boolean;
  featuredOrder?: number;
}

interface RigsContextType {
  rigs: Rig[];
  loading: boolean;
  addRig: (rig: Omit<Rig, 'id'>) => Promise<void>;
  updateRig: (rigId: string, updates: Partial<Rig>) => Promise<void>;
  updateRigStatus: (rigId: string, status: 'available' | 'pending' | 'sold') => void;
  toggleFeatured: (rigId: string) => void;
  deleteRig: (rigId: string) => void;
}

const RigsContext = createContext<RigsContextType | undefined>(undefined);
const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-3ab5944d`;

// Helper to make URLs pretty
const generateSlug = (title: string) => {
  return title
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
};

export function RigsProvider({ children }: { children: ReactNode }) {
  const [rigs, setRigs] = useState<Rig[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRigs();
  }, []);

  const fetchRigs = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/rigs`, {
        headers: { 'Authorization': `Bearer ${publicAnonKey}` },
      });
      
      if (!response.ok) throw new Error(`Failed to fetch rigs`);
      
      const data = await response.json();
      const processedRigs = (data.rigs || []).map((rig: Rig) => ({
        ...rig,
        slug: generateSlug(rig.title)
      }));
      
      setRigs(processedRigs);
    } catch (error) {
      console.error('Error fetching rigs:', error);
      setRigs([]);
    } finally {
      setLoading(false);
    }
  };

  const addRig = async (rig: Omit<Rig, 'id'>) => {
    try {
      const response = await fetch(`${API_BASE_URL}/rigs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify(rig),
      });
      if (!response.ok) throw new Error(`Failed to create rig`);
      await fetchRigs();
    } catch (error) {
      console.error('Error creating rig:', error);
      throw error;
    }
  };

  const updateRig = async (rigId: string, updates: Partial<Rig>) => {
    try {
      const response = await fetch(`${API_BASE_URL}/rigs/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({ rigId, updates }),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        const errorMessage = errorData.error || errorData.details || 'Failed to update rig';
        throw new Error(errorMessage);
      }
      await fetchRigs();
    } catch (error) {
      console.error('Error updating rig:', error);
      throw error;
    }
  };

  const updateRigStatus = async (rigId: string, status: 'available' | 'pending' | 'sold') => {
    try {
      await fetch(`${API_BASE_URL}/rigs/update-status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({ rigId, status }),
      });
      await fetchRigs();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const toggleFeatured = async (rigId: string) => {
    try {
      await fetch(`${API_BASE_URL}/rigs/toggle-featured`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({ rigId }),
      });
      await fetchRigs();
    } catch (error) {
      console.error('Error toggling featured:', error);
    }
  };

  const deleteRig = async (rigId: string) => {
    try {
      await fetch(`${API_BASE_URL}/rigs/delete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({ rigId }),
      });
      await fetchRigs();
    } catch (error) {
      console.error('Error deleting rig:', error);
    }
  };

  return (
    <RigsContext.Provider value={{ rigs, loading, addRig, updateRig, updateRigStatus, toggleFeatured, deleteRig }}>
      {children}
    </RigsContext.Provider>
  );
}

export function useRigs() {
  const context = useContext(RigsContext);
  if (context === undefined) throw new Error("useRigs must be used within a RigsProvider");
  return context;
}