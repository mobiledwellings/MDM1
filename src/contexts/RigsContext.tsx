import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { projectId, publicAnonKey } from '../utils/supabase/info';

export interface Rig {
  id: string;
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

// Mock data - Starting listings
const INITIAL_RIGS: Rig[] = [
  {
    id: "1",
    title: "2019 Mercedes Sprinter 4x4 - Full Off-Grid Build",
    type: "Van / Camper Van",
    price: "$89,500",
    location: "Portland, OR",
    thumbnail: "https://images.unsplash.com/photo-1546556407-5a1b85d0a2cb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYW1wZXIlMjB2YW4lMjBpbnRlcmlvcnxlbnwxfHx8fDE3NjQ2MzY3MDF8MA&ixlib=rb-4.1.0&q=80&w=1080",
    externalLink: "https://facebook.com/marketplace",
    year: "2019",
    highlights: ["800W Solar", "Diesel Heater", "Full Kitchen"]
  },
  {
    id: "2",
    title: "1998 Blue Bird School Bus Conversion - 2 Year Build",
    type: "School Bus / Skoolie",
    price: "$65,000",
    location: "Austin, TX",
    thumbnail: "https://images.unsplash.com/photo-1627265958740-04a624ff11ba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2hvb2wlMjBidXMlMjBjb252ZXJzaW9ufGVufDF8fHx8MTc2NDYzNjcwMXww&ixlib=rb-4.1.0&q=80&w=1080",
    externalLink: "https://facebook.com/marketplace",
    year: "1998",
    highlights: ["Full Bathroom", "Wood Interior", "35ft Length"],
    sold: true
  },
  {
    id: "3",
    title: "Custom Built Tiny House on Trailer - Move-In Ready",
    type: "Tiny House",
    price: "$72,000",
    location: "Asheville, NC",
    thumbnail: "https://images.unsplash.com/photo-1612125205368-62c12bff24d6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aW55JTIwaG91c2UlMjB0cmFpbGVyfGVufDF8fHx8MTc2NDYzNjcwMXww&ixlib=rb-4.1.0&q=80&w=1080",
    externalLink: "https://facebook.com/marketplace",
    year: "2022",
    highlights: ["Sleeping Loft", "Full Appliances", "Cedar Siding"]
  },
  {
    id: "4",
    title: "2015 Toyota Tacoma Overland Build - Adventure Ready",
    type: "Overland Rig",
    price: "$52,000",
    location: "Denver, CO",
    thumbnail: "https://images.unsplash.com/photo-1748445608314-4d9bfc595673?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvdmVybGFuZCUyMHRydWNrJTIwY2FtcGVyfGVufDF8fHx8MTc2NDYzNjcwMnww&ixlib=rb-4.1.0&q=80&w=1080",
    externalLink: "https://facebook.com/marketplace",
    year: "2015",
    highlights: ["Pop-up Camper", "Lifted 4x4", "Roof Rack"]
  },
  {
    id: "5",
    title: "1985 Airstream Renovation - Vintage Beauty",
    type: "RV / Motorhome",
    price: "$45,000",
    location: "Santa Fe, NM",
    thumbnail: "https://images.unsplash.com/photo-1515172128886-07c606bb4eb3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwcnYlMjBtb3RvcmhvbWV8ZW58MXx8fHwxNzY0NjM2NzAyfDA&ixlib=rb-4.1.0&q=80&w=1080",
    externalLink: "https://facebook.com/marketplace",
    year: "1985",
    highlights: ["Renovated Interior", "Original Shell", "28ft"]
  },
  {
    id: "6",
    title: "32' Catalina Sailboat - Liveaboard Cruiser",
    type: "Boat / Sailboat",
    price: "$38,000",
    location: "San Diego, CA",
    thumbnail: "https://images.unsplash.com/photo-1553836277-eea7b432c7fe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYWlsYm9hdCUyMGxpdmluZ3xlbnwxfHx8fDE3NjQ2MzY3MDN8MA&ixlib=rb-4.1.0&q=80&w=1080",
    externalLink: "https://facebook.com/marketplace",
    year: "1988",
    highlights: ["New Sails", "Solar Panel", "Full Galley"]
  },
];

interface RigsContextType {
  rigs: Rig[];
  addRig: (rig: Omit<Rig, 'id'>) => Promise<void>;
  updateRigStatus: (rigId: string, status: 'available' | 'pending' | 'sold') => void;
  toggleFeatured: (rigId: string) => void;
  deleteRig: (rigId: string) => void;
}

const RigsContext = createContext<RigsContextType | undefined>(undefined);

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-3ab5944d`;

export function RigsProvider({ children }: { children: ReactNode }) {
  const [rigs, setRigs] = useState<Rig[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch rigs from Supabase on mount
  useEffect(() => {
    fetchRigs();
  }, []);

  const fetchRigs = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/rigs`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch rigs: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Fetched rigs from Supabase:', data.rigs);
      setRigs(data.rigs || []);
    } catch (error) {
      console.error('Error fetching rigs from Supabase:', error);
      // On error, fall back to showing no rigs
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
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to create rig: ${errorData.error || response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Created rig in Supabase:', data.rig);
      
      // Refresh the rigs list
      await fetchRigs();
    } catch (error) {
      console.error('Error creating rig in Supabase:', error);
      throw error;
    }
  };

  const updateRigStatus = async (rigId: string, status: 'available' | 'pending' | 'sold') => {
    try {
      const response = await fetch(`${API_BASE_URL}/rigs/${rigId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({ status }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to update rig status: ${errorData.error || response.statusText}`);
      }
      
      console.log('Updated rig status in Supabase');
      
      // Refresh the rigs list
      await fetchRigs();
    } catch (error) {
      console.error('Error updating rig status in Supabase:', error);
      throw error;
    }
  };

  const toggleFeatured = async (rigId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/rigs/${rigId}/featured`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to toggle featured status: ${errorData.error || response.statusText}`);
      }
      
      console.log('Toggled featured status in Supabase');
      
      // Refresh the rigs list
      await fetchRigs();
    } catch (error) {
      console.error('Error toggling featured status in Supabase:', error);
      throw error;
    }
  };

  const deleteRig = async (rigId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/rigs/${rigId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to delete rig: ${errorData.error || response.statusText}`);
      }
      
      console.log('Deleted rig from Supabase');
      
      // Refresh the rigs list
      await fetchRigs();
    } catch (error) {
      console.error('Error deleting rig from Supabase:', error);
      throw error;
    }
  };

  return (
    <RigsContext.Provider value={{ rigs, addRig, updateRigStatus, toggleFeatured, deleteRig }}>
      {children}
    </RigsContext.Provider>
  );
}

export function useRigs() {
  const context = useContext(RigsContext);
  if (context === undefined) {
    throw new Error("useRigs must be used within a RigsProvider");
  }
  return context;
}