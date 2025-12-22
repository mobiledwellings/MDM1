import { HiX, HiExternalLink, HiCalendar } from "react-icons/hi";
import { HiLocationMarker } from "react-icons/hi";
import { MdSpeed } from "react-icons/md";
import { FaRuler, FaYoutube, FaInstagram, FaStar, FaTrash } from "react-icons/fa";
import { Rig } from "../contexts/RigsContext";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useRigs } from "../contexts/RigsContext";
import { useAdmin } from "../contexts/AdminContext";
import { useState } from "react";

interface RigDetailProps {
  rig: Rig;
  onClose: () => void;
}

export function RigDetail({ rig, onClose }: RigDetailProps) {
  const { updateRigStatus, toggleFeatured, deleteRig } = useRigs();
  const { isAdmin } = useAdmin();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  
  const currentStatus = rig.status || (rig.sold ? 'sold' : 'available');
  
  // Get the currently selected image (from galleryImages or fallback to thumbnail)
  const currentImage = rig.galleryImages && rig.galleryImages.length > 0 
    ? rig.galleryImages[selectedImageIndex]
    : rig.thumbnail;
  
  const handleStatusChange = (status: 'available' | 'pending' | 'sold') => {
    updateRigStatus(rig.id, status);
  };

  const handleToggleFeatured = () => {
    toggleFeatured(rig.id);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this listing? This cannot be undone.')) {
      deleteRig(rig.id);
      onClose();
    }
  };
  
  return (
    <div className="fixed inset-0 bg-white dark:bg-neutral-900 z-50 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-700 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="font-bold text-neutral-900 dark:text-white">Listing Details</h1>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-colors"
            aria-label="Close"
          >
            <HiX className="w-6 h-6 text-neutral-600 dark:text-neutral-400" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content - Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Main Image */}
            <div className="relative aspect-video overflow-hidden rounded-lg bg-neutral-100 dark:bg-neutral-800">
              <ImageWithFallback
                src={currentImage}
                alt={rig.title}
                className="w-full h-full object-cover"
              />
              {currentStatus === 'sold' && (
                <div className="absolute top-4 right-4 bg-red-600 text-white px-4 py-2 rounded font-semibold">
                  SOLD
                </div>
              )}
              {currentStatus === 'pending' && (
                <div className="absolute top-4 right-4 bg-yellow-600 text-white px-4 py-2 rounded font-semibold">
                  PENDING
                </div>
              )}
              {currentStatus === 'available' && (
                <div className="absolute top-4 right-4 bg-neutral-900 dark:bg-neutral-700 text-white px-4 py-2 rounded font-semibold">
                  {rig.price}
                </div>
              )}
            </div>

            {/* Gallery Images */}
            {rig.galleryImages && rig.galleryImages.length > 0 && (
              <div>
                <h3 className="font-bold text-neutral-900 dark:text-white mb-4">Gallery</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {rig.galleryImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`relative aspect-video overflow-hidden rounded-lg bg-neutral-100 dark:bg-neutral-800 cursor-pointer transition-all hover:ring-4 hover:ring-neutral-900 dark:hover:ring-neutral-100 ${
                        selectedImageIndex === index ? 'ring-4 ring-neutral-900 dark:ring-neutral-100' : ''
                      }`}
                    >
                      <ImageWithFallback
                        src={image}
                        alt={`${rig.title} - Image ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Build Description */}
            {rig.buildDescription && (
              <div>
                <h3 className="font-bold text-neutral-900 dark:text-white mb-4">Build Description</h3>
                <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed whitespace-pre-line">
                  {rig.buildDescription}
                </p>
              </div>
            )}

            {/* Story */}
            {rig.story && (
              <div>
                <h3 className="font-bold text-neutral-900 dark:text-white mb-4">Story</h3>
                <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed whitespace-pre-line">
                  {rig.story}
                </p>
              </div>
            )}

            {/* YouTube Video */}
            {rig.youtubeVideo && (
              <div>
                <h3 className="font-bold text-neutral-900 dark:text-white mb-4">Video Tour</h3>
                <div className="relative aspect-video overflow-hidden rounded-lg bg-neutral-100 dark:bg-neutral-800">
                  <iframe
                    src={`https://www.youtube.com/embed/${rig.youtubeVideo}`}
                    title="Video Tour"
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            )}

            {/* Admin Controls - Only visible when logged in as admin */}
            {isAdmin && (
              <div className="pt-8 border-t border-neutral-200 dark:border-neutral-700 space-y-2">
                <button
                  onClick={handleToggleFeatured}
                  className={`w-full px-4 py-2 rounded text-sm flex items-center justify-center gap-2 transition-colors ${
                    rig.featured
                      ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                      : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300 hover:bg-yellow-100 dark:hover:bg-yellow-900/30'
                  }`}
                >
                  <FaStar className={`w-4 h-4 ${rig.featured ? 'fill-current' : ''}`} />
                  {rig.featured ? 'Remove from Featured' : 'Feature This Rig'}
                </button>
                <button
                  onClick={handleDelete}
                  className="w-full px-4 py-2 rounded text-sm flex items-center justify-center gap-2 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/40 transition-colors"
                >
                  <FaTrash className="w-4 h-4" />
                  Delete This Listing
                </button>
              </div>
            )}
          </div>

          {/* Sidebar - Right Column */}
          <div className="space-y-6">
            {/* Price Card */}
            <div className="bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-6 sticky top-24">
              <div className="mb-6">
                {currentStatus === 'sold' ? (
                  <div className="text-3xl font-bold text-red-600">SOLD</div>
                ) : currentStatus === 'pending' ? (
                  <div className="text-3xl font-bold text-yellow-600">PENDING</div>
                ) : (
                  <div className="text-3xl font-bold text-neutral-900 dark:text-white">{rig.price}</div>
                )}
                <h2 className="mt-4 font-bold text-neutral-900 dark:text-white">{rig.title}</h2>
                <div className="text-sm text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mt-2">
                  {rig.type}
                </div>
              </div>

              {/* Location */}
              <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400 mb-6">
                <HiLocationMarker className="w-5 h-5" />
                <span>{rig.location}</span>
              </div>

              {/* Specs */}
              <div className="space-y-3 mb-6 pb-6 border-b border-neutral-200 dark:border-neutral-700">
                {rig.year && (
                  <div className="flex items-center gap-2 text-sm">
                    <HiCalendar className="w-4 h-4 text-neutral-400" />
                    <span className="text-neutral-600 dark:text-neutral-400">Year:</span>
                    <span className="font-semibold text-neutral-900 dark:text-white">{rig.year}</span>
                  </div>
                )}
                {rig.mileage && (
                  <div className="flex items-center gap-2 text-sm">
                    <MdSpeed className="w-4 h-4 text-neutral-400" />
                    <span className="text-neutral-600 dark:text-neutral-400">Mileage:</span>
                    <span className="font-semibold text-neutral-900 dark:text-white">{rig.mileage}</span>
                  </div>
                )}
                {rig.length && (
                  <div className="flex items-center gap-2 text-sm">
                    <FaRuler className="w-4 h-4 text-neutral-400" />
                    <span className="text-neutral-600 dark:text-neutral-400">Length:</span>
                    <span className="font-semibold text-neutral-900 dark:text-white">{rig.length}</span>
                  </div>
                )}
              </div>

              {/* Highlights */}
              {rig.highlights && rig.highlights.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-semibold text-neutral-900 dark:text-white mb-3">Highlights</h4>
                  <div className="flex flex-wrap gap-2">
                    {rig.highlights.map((highlight, index) => (
                      <span
                        key={index}
                        className="text-xs bg-neutral-100 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 px-3 py-1 rounded border border-neutral-200 dark:border-neutral-700"
                      >
                        {highlight}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* External Link Button */}
              <a
                href={rig.externalLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 bg-neutral-900 dark:bg-neutral-700 text-white px-6 py-3 rounded hover:bg-neutral-700 dark:hover:bg-neutral-600 transition-colors"
              >
                <span>{currentStatus === 'sold' ? 'View Sold Listing' : 'View External Listing'}</span>
                <HiExternalLink className="w-4 h-4" />
              </a>

              {/* Status Toggle Buttons - Only visible when logged in as admin */}
              {isAdmin && (
                <div className="mt-6 pt-6 border-t border-neutral-200 dark:border-neutral-700 space-y-2">
                  <h4 className="font-semibold text-neutral-900 dark:text-white mb-3">Update Status</h4>
                  <button
                    onClick={() => handleStatusChange('sold')}
                    className={`w-full px-4 py-2 rounded transition-colors ${
                      currentStatus === 'sold'
                        ? 'bg-red-600 text-white'
                        : 'bg-neutral-100 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 hover:bg-red-100 dark:hover:bg-red-900/20'
                    }`}
                  >
                    Mark This Rig as Sold
                  </button>
                  <button
                    onClick={() => handleStatusChange('pending')}
                    className={`w-full px-4 py-2 rounded transition-colors ${
                      currentStatus === 'pending'
                        ? 'bg-yellow-600 text-white'
                        : 'bg-neutral-100 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 hover:bg-yellow-100 dark:hover:bg-yellow-900/20'
                    }`}
                  >
                    Mark This Rig as Pending
                  </button>
                  <button
                    onClick={() => handleStatusChange('available')}
                    className={`w-full px-4 py-2 rounded transition-colors ${
                      currentStatus === 'available'
                        ? 'bg-green-600 text-white'
                        : 'bg-neutral-100 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 hover:bg-green-100 dark:hover:bg-green-900/20'
                    }`}
                  >
                    Mark This Rig as Available
                  </button>
                </div>
              )}

              {/* Contact Info */}
              {(rig.name || rig.instagram) && (
                <div className="mt-6 pt-6 border-t border-neutral-200 dark:border-neutral-700">
                  <h4 className="font-semibold text-neutral-900 dark:text-white mb-3">Seller Info</h4>
                  <div className="space-y-2 text-sm">
                    {rig.name && (
                      <div className="text-neutral-600 dark:text-neutral-400">
                        <span className="font-semibold text-neutral-900 dark:text-white">{rig.name}</span>
                      </div>
                    )}
                    {rig.instagram && (
                      <a
                        href={rig.instagram.startsWith('http') ? rig.instagram : `https://instagram.com/${rig.instagram}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
                      >
                        <FaInstagram className="w-4 h-4" />
                        <span>Instagram</span>
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}