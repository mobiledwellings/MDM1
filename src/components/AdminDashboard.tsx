import { useState } from 'react';
import { X, Star, Trash2, ExternalLink, Eye, Pencil } from 'lucide-react';
import { useRigs } from '../contexts/RigsContext';
import { Rig } from '../contexts/RigsContext';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner';

interface AdminDashboardProps {
  open: boolean;
  onClose: () => void;
  onViewRig: (rig: Rig) => void;
}

export function AdminDashboard({ open, onClose, onViewRig }: AdminDashboardProps) {
  const { rigs, updateRig, updateRigStatus, toggleFeatured, deleteRig } = useRigs();
  const [filter, setFilter] = useState<'all' | 'pending' | 'available' | 'sold'>('all');
  const [editingRig, setEditingRig] = useState<Rig | null>(null);
  const [editForm, setEditForm] = useState<Partial<Rig>>({});

  if (!open) return null;

  const filteredRigs = rigs.filter(rig => {
    if (filter === 'all') return true;
    const status = rig.status || (rig.sold ? 'sold' : 'available');
    return status === filter;
  });

  const pendingCount = rigs.filter(r => (r.status || (r.sold ? 'sold' : 'available')) === 'pending').length;
  const availableCount = rigs.filter(r => (r.status || (r.sold ? 'sold' : 'available')) === 'available').length;
  const soldCount = rigs.filter(r => (r.status || (r.sold ? 'sold' : 'available')) === 'sold').length;

  const handleStatusChange = (rigId: string, status: 'available' | 'pending' | 'sold') => {
    updateRigStatus(rigId, status);
  };

  const handleToggleFeatured = (rigId: string) => {
    toggleFeatured(rigId);
  };

  const handleDelete = (rigId: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) {
      deleteRig(rigId);
    }
  };

  const handleEdit = (rig: Rig) => {
    setEditingRig(rig);
    setEditForm({
      title: rig.title,
      type: rig.type,
      price: rig.price,
      location: rig.location,
      name: rig.name,
      mileage: rig.mileage,
      length: rig.length,
      buildDescription: rig.buildDescription,
      story: rig.story,
      youtubeVideo: rig.youtubeVideo,
      instagram: rig.instagram,
      externalLink: rig.externalLink,
    });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRig) return;
    
    try {
      await updateRig(editingRig.id, editForm);
      toast.success('Listing updated successfully!');
      setEditingRig(null);
      setEditForm({});
    } catch (error) {
      toast.error('Failed to update listing');
    }
  };

  const handleEditFormChange = (field: keyof Rig, value: string) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-white dark:bg-neutral-900 z-50 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-700 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="font-bold text-neutral-900 dark:text-white">Admin Dashboard</h1>
            <button
              onClick={onClose}
              className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-colors"
              aria-label="Close"
            >
              <X className="w-6 h-6 text-neutral-600 dark:text-neutral-400" />
            </button>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                filter === 'all'
                  ? 'bg-neutral-900 dark:bg-neutral-700 text-white'
                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
              }`}
            >
              All Listings ({rigs.length})
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                filter === 'pending'
                  ? 'bg-yellow-600 text-white'
                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
              }`}
            >
              Pending ({pendingCount})
            </button>
            <button
              onClick={() => setFilter('available')}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                filter === 'available'
                  ? 'bg-green-600 text-white'
                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
              }`}
            >
              Available ({availableCount})
            </button>
            <button
              onClick={() => setFilter('sold')}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                filter === 'sold'
                  ? 'bg-red-600 text-white'
                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
              }`}
            >
              Sold ({soldCount})
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {filteredRigs.length === 0 ? (
          <div className="text-center py-12 text-neutral-500 dark:text-neutral-400">
            No listings found
          </div>
        ) : (
          <div className="space-y-6">
            {filteredRigs.map((rig) => {
              const status = rig.status || (rig.sold ? 'sold' : 'available');
              return (
                <div
                  key={rig.id}
                  className="bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg overflow-hidden"
                >
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6">
                    {/* Thumbnail */}
                    <div className="relative aspect-video md:aspect-square overflow-hidden rounded-lg bg-neutral-100 dark:bg-neutral-900">
                      <ImageWithFallback
                        src={rig.thumbnail}
                        alt={rig.title}
                        className="w-full h-full object-cover"
                      />
                      {rig.featured && (
                        <div className="absolute top-2 right-2 bg-yellow-500 text-white p-1.5 rounded">
                          <Star className="w-4 h-4 fill-current" />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="md:col-span-2 space-y-3">
                      <div>
                        <h3 className="font-bold text-neutral-900 dark:text-white">{rig.title}</h3>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                          {rig.type}
                        </p>
                      </div>
                      <div className="text-neutral-900 dark:text-white font-semibold">
                        {rig.price}
                      </div>
                      <div className="text-sm text-neutral-600 dark:text-neutral-400">
                        {rig.location}
                      </div>
                      {rig.name && (
                        <div className="text-sm text-neutral-600 dark:text-neutral-400">
                          Seller: {rig.name}
                        </div>
                      )}
                      <div className="flex flex-wrap gap-2">
                        <span
                          className={`inline-block px-3 py-1 rounded text-xs font-semibold ${
                            status === 'pending'
                              ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400'
                              : status === 'sold'
                              ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400'
                              : 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400'
                          }`}
                        >
                          {status.toUpperCase()}
                        </span>
                        {rig.featured && (
                          <span className="inline-block px-3 py-1 rounded text-xs font-semibold bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400">
                            FEATURED
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="space-y-2">
                      <button
                        onClick={() => onViewRig(rig)}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-neutral-900 dark:bg-neutral-700 text-white rounded-lg hover:bg-neutral-700 dark:hover:bg-neutral-600 transition-colors text-sm"
                      >
                        <Eye className="w-4 h-4" />
                        View Details
                      </button>
                      <div className="grid grid-cols-3 gap-1">
                        <button
                          onClick={() => handleStatusChange(rig.id, 'available')}
                          className={`px-2 py-2 rounded text-xs transition-colors ${
                            status === 'available'
                              ? 'bg-green-600 text-white'
                              : 'bg-neutral-200 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 hover:bg-green-100 dark:hover:bg-green-900/30'
                          }`}
                          title="Mark as Available"
                        >
                          Avail
                        </button>
                        <button
                          onClick={() => handleStatusChange(rig.id, 'pending')}
                          className={`px-2 py-2 rounded text-xs transition-colors ${
                            status === 'pending'
                              ? 'bg-yellow-600 text-white'
                              : 'bg-neutral-200 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 hover:bg-yellow-100 dark:hover:bg-yellow-900/30'
                          }`}
                          title="Mark as Pending"
                        >
                          Pend
                        </button>
                        <button
                          onClick={() => handleStatusChange(rig.id, 'sold')}
                          className={`px-2 py-2 rounded text-xs transition-colors ${
                            status === 'sold'
                              ? 'bg-red-600 text-white'
                              : 'bg-neutral-200 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 hover:bg-red-100 dark:hover:bg-red-900/30'
                          }`}
                          title="Mark as Sold"
                        >
                          Sold
                        </button>
                      </div>
                      <button
                        onClick={() => handleToggleFeatured(rig.id)}
                        className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors ${
                          rig.featured
                            ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                            : 'bg-neutral-200 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 hover:bg-yellow-100 dark:hover:bg-yellow-900/30'
                        }`}
                      >
                        <Star className={`w-4 h-4 ${rig.featured ? 'fill-current' : ''}`} />
                        {rig.featured ? 'Unfeature' : 'Feature'}
                      </button>
                      <button
                        onClick={() => handleEdit(rig)}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/40 transition-colors text-sm"
                      >
                        <Pencil className="w-4 h-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(rig.id, rig.title)}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/40 transition-colors text-sm"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingRig && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-neutral-900 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-700 p-4 flex items-center justify-between">
              <h2 className="font-bold text-neutral-900 dark:text-white">Edit Listing</h2>
              <button
                onClick={() => { setEditingRig(null); setEditForm({}); }}
                className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
              </button>
            </div>
            
            <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Title (Year, Make, Model)</label>
                  <Input 
                    value={editForm.title || ''} 
                    onChange={(e) => handleEditFormChange('title', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Type</label>
                  <Input 
                    value={editForm.type || ''} 
                    onChange={(e) => handleEditFormChange('type', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Price</label>
                  <Input 
                    value={editForm.price || ''} 
                    onChange={(e) => handleEditFormChange('price', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Location</label>
                  <Input 
                    value={editForm.location || ''} 
                    onChange={(e) => handleEditFormChange('location', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Seller Name</label>
                  <Input 
                    value={editForm.name || ''} 
                    onChange={(e) => handleEditFormChange('name', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Mileage</label>
                  <Input 
                    value={editForm.mileage || ''} 
                    onChange={(e) => handleEditFormChange('mileage', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Length (ft)</label>
                  <Input 
                    value={editForm.length || ''} 
                    onChange={(e) => handleEditFormChange('length', e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Build Description</label>
                <Textarea 
                  value={editForm.buildDescription || ''} 
                  onChange={(e) => handleEditFormChange('buildDescription', e.target.value)}
                  rows={4}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Story</label>
                <Textarea 
                  value={editForm.story || ''} 
                  onChange={(e) => handleEditFormChange('story', e.target.value)}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">YouTube Video URL</label>
                  <Input 
                    value={editForm.youtubeVideo || ''} 
                    onChange={(e) => handleEditFormChange('youtubeVideo', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Instagram URL</label>
                  <Input 
                    value={editForm.instagram || ''} 
                    onChange={(e) => handleEditFormChange('instagram', e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">External Listing Link</label>
                <Input 
                  value={editForm.externalLink || ''} 
                  onChange={(e) => handleEditFormChange('externalLink', e.target.value)}
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => { setEditingRig(null); setEditForm({}); }}
                  className="flex-1 py-3 bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg font-medium hover:bg-neutral-300 dark:hover:bg-neutral-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-lg font-medium hover:bg-neutral-700 dark:hover:bg-neutral-200 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
