import { useParams, useNavigate } from "react-router-dom";
import { useRigs } from "../contexts/RigsContext";
import { useAdmin } from "../contexts/AdminContext";
import { SEO } from "../components/SEO";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { useState, useEffect } from "react";
import { HiExternalLink, HiCalendar, HiLocationMarker, HiArrowLeft, HiUpload } from "react-icons/hi";
import { MdSpeed } from "react-icons/md";
import { FaRuler, FaStar, FaTrash, FaPencilAlt } from "react-icons/fa";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { toast } from "sonner";
import { projectId, publicAnonKey } from "../utils/supabase/info";

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-3ab5944d`;

function compressImageForUpload(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;
        const maxSize = 1920;
        if (width > height && width > maxSize) {
          height = (height * maxSize) / width;
          width = maxSize;
        } else if (height > maxSize) {
          width = (width * maxSize) / height;
          height = maxSize;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", 0.8));
      };
      img.onerror = reject;
      img.src = ev.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Helper to render text with **bold** markdown support and preserve newlines
function FormattedText({ text, className }: { text: string; className?: string }) {
  // Split by newlines first, then process each line for bold
  const lines = text.split('\n');
  
  return (
    <div className={className}>
      {lines.map((line, lineIndex) => {
        const parts = line.split(/(\*\*.*?\*\*)/g);
        return (
          <p key={lineIndex} className={lineIndex > 0 ? 'mt-2' : ''}>
            {parts.map((part, i) => {
              if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={i} className="font-bold">{part.slice(2, -2)}</strong>;
              }
              return <span key={i}>{part}</span>;
            })}
            {line === '' && <br />}
          </p>
        );
      })}
    </div>
  );
}

export function RigDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { rigs, loading, updateRig, updateRigStatus, toggleFeatured, deleteRig } = useRigs();
  const { isAdmin } = useAdmin();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<any>({});
  const [editGalleryImages, setEditGalleryImages] = useState<string[]>([]);
  const [draggedImageIndex, setDraggedImageIndex] = useState<number | null>(null);
  const [uploadingGallery, setUploadingGallery] = useState(false);

  const gallerySlotLimit = 20;

  const handleAppendGalleryPhotos = async (files: FileList | null) => {
    if (!rig || !files?.length) return;
    const remainingSlots = gallerySlotLimit - editGalleryImages.length;
    if (remainingSlots <= 0) {
      toast.error(`Maximum ${gallerySlotLimit} photos per listing`);
      return;
    }
    const toProcess = Array.from(files).slice(0, remainingSlots);

    setUploadingGallery(true);
    const toastId = toast.loading(`Uploading ${toProcess.length} photo(s)…`);

    try {
      const payloads: string[] = [];
      for (const file of toProcess) {
        if (!file.type.startsWith("image/")) continue;
        payloads.push(await compressImageForUpload(file));
      }
      if (payloads.length === 0) {
        toast.dismiss(toastId);
        toast.error("No valid images selected");
        setUploadingGallery(false);
        return;
      }

      const res = await fetch(`${API_BASE_URL}/rigs/append-gallery-images`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({
          rigId: rig.id,
          newImagesBase64: payloads,
        }),
      });
      const data = await res.json().catch(() => ({}));

      toast.dismiss(toastId);

      if (!res.ok) {
        toast.error(typeof data?.error === "string" ? data.error : "Upload failed");
        setUploadingGallery(false);
        return;
      }

      const urls = data.urls as string[] | undefined;
      if (!urls?.length) {
        toast.error("No photos were uploaded");
        setUploadingGallery(false);
        return;
      }

      setEditGalleryImages((prev) => [...prev, ...urls]);
      toast.success(`Added ${urls.length} photo(s). Save changes to finalize.`);
    } catch (e) {
      console.error(e);
      toast.dismiss(toastId);
      toast.error("Photo upload failed");
    } finally {
      setUploadingGallery(false);
    }
  };

  // Match by ID or by the SEO Slug
  const rig = rigs.find((r) => r.id === id || r.slug === id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-neutral-900 flex items-center justify-center">
        <div className="animate-pulse text-neutral-400">Loading Rig Details...</div>
      </div>
    );
  }

  if (!rig) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Rig Not Found</h1>
            <button onClick={() => navigate('/rigs-for-sale')} className="text-blue-600 hover:underline flex items-center gap-2">
              <HiArrowLeft /> Back to Marketplace
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const currentStatus = rig.status || (rig.sold ? 'sold' : 'available');
  const currentImage = rig.galleryImages && rig.galleryImages.length > 0 
    ? rig.galleryImages[selectedImageIndex]
    : rig.thumbnail;

  // Generate SEO-friendly description
  const seoDescription = `${rig.title} for sale - ${rig.price}. ${rig.type} located in ${rig.location}. ${rig.mileage ? `${rig.mileage} miles. ` : ''}${rig.length ? `${rig.length} ft. ` : ''}${rig.buildDescription?.substring(0, 120) || ''}...`;
  
  // Structured data for individual listing
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Vehicle",
    "name": rig.title,
    "description": rig.buildDescription?.substring(0, 500),
    "image": rig.galleryImages || [rig.thumbnail],
    "url": `https://mobiledwellings.media/rigs/${rig.id}`,
    "vehicleConfiguration": rig.type,
    "mileageFromOdometer": rig.mileage ? {
      "@type": "QuantitativeValue",
      "value": rig.mileage.replace(/[^0-9]/g, ''),
      "unitCode": "SMI"
    } : undefined,
    "offers": {
      "@type": "Offer",
      "price": rig.price?.replace(/[^0-9]/g, ''),
      "priceCurrency": "USD",
      "availability": currentStatus === 'sold' ? "https://schema.org/SoldOut" : "https://schema.org/InStock",
      "itemCondition": "https://schema.org/UsedCondition",
      "seller": {
        "@type": "Person",
        "name": rig.name || "Mobile Dwellings Seller"
      }
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-900">
      <SEO 
        title={`${rig.title} | ${rig.type} For Sale`}
        description={seoDescription}
        keywords={`${rig.type} for sale, ${rig.title}, skoolie for sale, converted bus, ${rig.location}, buy skoolie`}
        image={rig.thumbnail}
        url={`https://mobiledwellings.media/rigs/${rig.id}`}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <Header />

      <main className="max-w-7xl mx-auto px-6 py-12">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-neutral-500 hover:text-neutral-900 dark:hover:text-white mb-8 transition-colors font-medium"
        >
          <HiArrowLeft /> Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            <div className="relative aspect-video overflow-hidden rounded-xl bg-neutral-100 dark:bg-neutral-800 shadow-sm border border-neutral-200 dark:border-neutral-700">
              <ImageWithFallback src={currentImage} alt={rig.title} className="w-full h-full object-cover" />
              {currentStatus !== 'available' && (
                <div className={`absolute top-4 right-4 text-white px-4 py-2 rounded font-bold ${currentStatus === 'sold' ? 'bg-red-600' : 'bg-yellow-600'}`}>
                  {currentStatus.toUpperCase()}
                </div>
              )}
            </div>

            {rig.galleryImages && rig.galleryImages.length > 0 && (
              <div>
                <h3 className="font-bold text-neutral-900 dark:text-white mb-4">Gallery</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {rig.galleryImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`relative aspect-video overflow-hidden rounded-lg bg-neutral-100 dark:bg-neutral-800 cursor-pointer transition-all hover:ring-4 hover:ring-neutral-900 dark:hover:ring-neutral-100 ${selectedImageIndex === index ? 'ring-4 ring-neutral-900 dark:ring-neutral-100' : ''}`}
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

            {rig.youtubeVideo && (
              <div>
                <h3 className="font-bold text-neutral-900 dark:text-white mb-4">Video Tour</h3>
                <div className="relative aspect-video overflow-hidden rounded-xl bg-neutral-100 dark:bg-neutral-800">
                  <iframe
                    src={`https://www.youtube.com/embed/${rig.youtubeVideo.includes('youtube.com') || rig.youtubeVideo.includes('youtu.be') 
                      ? rig.youtubeVideo.split('v=')[1]?.split('&')[0] || rig.youtubeVideo.split('/').pop()?.split('?')[0]
                      : rig.youtubeVideo}`}
                    title={`${rig.title} Video Tour`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full"
                  />
                </div>
              </div>
            )}

            <div className="prose dark:prose-invert max-w-none">
              <h3 className="text-2xl font-bold border-b pb-2 dark:border-neutral-700">Build Description</h3>
              {rig.buildDescription && (
                <FormattedText text={rig.buildDescription} className="text-neutral-700 dark:text-neutral-300 mt-4" />
              )}
              
              {rig.story && (
                <>
                  <h3 className="text-2xl font-bold mt-12 border-b pb-2 dark:border-neutral-700">The Story</h3>
                  <FormattedText text={rig.story} className="text-neutral-700 dark:text-neutral-300 mt-4" />
                </>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-6 bg-neutral-50 dark:bg-neutral-800 rounded-2xl border border-neutral-200 dark:border-neutral-700 sticky top-24">
              <h1 className="text-3xl font-bold mb-2 leading-tight dark:text-white">{rig.title}</h1>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-6">{rig.price}</div>
              
              <div className="space-y-4 mb-8 pt-6 border-t border-neutral-200 dark:border-neutral-700">
                <div className="flex items-center gap-3 text-neutral-600 dark:text-neutral-400">
                  <HiLocationMarker className="w-5 h-5 text-red-500" /> {rig.location}
                </div>
                {rig.year && <div className="flex items-center gap-3 text-neutral-600 dark:text-neutral-400"><HiCalendar className="w-5 h-5" /> Year: {rig.year}</div>}
                {rig.mileage && <div className="flex items-center gap-3 text-neutral-600 dark:text-neutral-400"><MdSpeed className="w-5 h-5" /> {rig.mileage} Miles</div>}
                {rig.length && <div className="flex items-center gap-3 text-neutral-600 dark:text-neutral-400"><FaRuler className="w-5 h-5" /> {rig.length} ft</div>}
              </div>

              <a 
                href={rig.externalLink} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-4 bg-neutral-900 dark:bg-white dark:text-neutral-900 text-white rounded-xl font-bold hover:opacity-90 transition-opacity shadow-lg"
              >
                View Listing <HiExternalLink />
              </a>

              {isAdmin && (
                <div className="mt-10 pt-6 border-t border-neutral-200 dark:border-neutral-700 space-y-3">
                  <p className="text-xs font-bold uppercase text-neutral-400 tracking-widest">Admin Dashboard</p>
                  <button onClick={() => toggleFeatured(rig.id)} className={`w-full py-2 rounded-lg flex items-center justify-center gap-2 font-medium ${rig.featured ? 'bg-yellow-500 text-white' : 'bg-neutral-200 dark:bg-neutral-700 dark:text-white'}`}>
                    <FaStar /> {rig.featured ? 'Featured' : 'Make Featured'}
                  </button>
                  <button 
                    onClick={() => {
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
                      setEditGalleryImages(rig.galleryImages || []);
                      setIsEditing(true);
                    }} 
                    className="w-full py-2 bg-blue-100 text-blue-700 rounded-lg flex items-center justify-center gap-2 font-medium hover:bg-blue-200 transition-colors"
                  >
                    <FaPencilAlt /> Edit Listing
                  </button>
                  <button onClick={() => { if(confirm('Are you sure?')) { deleteRig(rig.id); navigate('/rigs-for-sale'); } }} className="w-full py-2 bg-red-100 text-red-700 rounded-lg flex items-center justify-center gap-2 font-medium">
                    <FaTrash /> Delete Listing
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/50 z-[100] overflow-y-auto">
          <div className="min-h-full flex items-start justify-center p-4 py-8">
            <div className="bg-white dark:bg-neutral-900 rounded-lg max-w-2xl w-full">
              <div className="sticky top-0 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-700 p-4 flex items-center justify-between z-10 rounded-t-lg">
                <h2 className="font-bold text-neutral-900 dark:text-white">Edit Listing</h2>
                <button
                  onClick={() => setIsEditing(false)}
                  className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-colors text-neutral-600 dark:text-neutral-400"
                >
                  ✕
                </button>
              </div>
              
              <form onSubmit={async (e) => {
                e.preventDefault();
                try {
                  await updateRig(rig.id, {
                    ...editForm,
                    galleryImages: editGalleryImages,
                    thumbnail: editGalleryImages[0] || rig.thumbnail,
                  });
                  toast.success('Listing updated successfully!');
                  setIsEditing(false);
                } catch (error) {
                  console.error('Update error:', error);
                  const errorMessage = error instanceof Error ? error.message : 'Failed to update listing';
                  toast.error(`Failed to update listing: ${errorMessage}`);
                }
              }} className="p-6 space-y-4">
                
                {/* Photo Management Section */}
                <div className="border-b border-neutral-200 dark:border-neutral-700 pb-6">
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Photos (drag to reorder, first image is cover photo)
                  </label>
                  <label
                    className={`mb-4 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-neutral-300 bg-neutral-50 py-6 transition-colors hover:border-neutral-400 dark:border-neutral-600 dark:bg-neutral-900/50 dark:hover:border-neutral-500 ${
                      uploadingGallery || editGalleryImages.length >= gallerySlotLimit ? "pointer-events-none opacity-50" : ""
                    }`}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      disabled={uploadingGallery || editGalleryImages.length >= gallerySlotLimit}
                      onChange={(e) => {
                        void handleAppendGalleryPhotos(e.target.files);
                        e.target.value = "";
                      }}
                    />
                    <HiUpload className="h-8 w-8 text-neutral-400" />
                    <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      {uploadingGallery ? "Uploading…" : "Add photos"}
                    </span>
                    <span className="text-xs text-neutral-500">
                      Up to {gallerySlotLimit} total · JPG/PNG resized on upload
                    </span>
                  </label>
                  <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                    {editGalleryImages.map((image, index) => (
                      <div 
                        key={index}
                        draggable
                        onDragStart={() => setDraggedImageIndex(index)}
                        onDragOver={(e) => {
                          e.preventDefault();
                          if (draggedImageIndex === null || draggedImageIndex === index) return;
                          const newImages = [...editGalleryImages];
                          const [dragged] = newImages.splice(draggedImageIndex, 1);
                          newImages.splice(index, 0, dragged);
                          setEditGalleryImages(newImages);
                          setDraggedImageIndex(index);
                        }}
                        onDragEnd={() => setDraggedImageIndex(null)}
                        className={`relative aspect-square rounded-lg overflow-hidden cursor-move border-2 ${index === 0 ? 'border-green-500' : 'border-transparent'} ${draggedImageIndex === index ? 'opacity-50' : ''}`}
                      >
                        <img src={image} alt={`Photo ${index + 1}`} className="w-full h-full object-cover" />
                        {index === 0 && (
                          <div className="absolute top-1 left-1 bg-green-500 text-white text-xs px-1.5 py-0.5 rounded font-medium">
                            Cover
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            const newImages = editGalleryImages.filter((_, i) => i !== index);
                            setEditGalleryImages(newImages);
                          }}
                          className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                        >
                          <FaTrash className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            // Move this image to first position (make it cover)
                            const newImages = [...editGalleryImages];
                            const [selected] = newImages.splice(index, 1);
                            newImages.unshift(selected);
                            setEditGalleryImages(newImages);
                          }}
                          className={`absolute bottom-1 left-1 bg-neutral-900/80 text-white text-xs px-2 py-1 rounded hover:bg-neutral-900 transition-colors ${index === 0 ? 'hidden' : ''}`}
                        >
                          Set as Cover
                        </button>
                      </div>
                    ))}
                  </div>
                  {editGalleryImages.length === 0 && (
                    <p className="text-neutral-500 text-sm mt-2">No photos available</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Title (Year, Make, Model)</label>
                    <Input 
                      value={editForm.title || ''} 
                      onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Type</label>
                    <Input 
                      value={editForm.type || ''} 
                      onChange={(e) => setEditForm({...editForm, type: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Price</label>
                    <Input 
                      value={editForm.price || ''} 
                      onChange={(e) => setEditForm({...editForm, price: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Location</label>
                    <Input 
                      value={editForm.location || ''} 
                      onChange={(e) => setEditForm({...editForm, location: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Seller Name</label>
                    <Input 
                      value={editForm.name || ''} 
                      onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Mileage</label>
                    <Input 
                      value={editForm.mileage || ''} 
                      onChange={(e) => setEditForm({...editForm, mileage: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Length (ft)</label>
                    <Input 
                      value={editForm.length || ''} 
                      onChange={(e) => setEditForm({...editForm, length: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Build Description</label>
                  <Textarea 
                    value={editForm.buildDescription || ''} 
                    onChange={(e) => setEditForm({...editForm, buildDescription: e.target.value})}
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Story</label>
                  <Textarea 
                    value={editForm.story || ''} 
                    onChange={(e) => setEditForm({...editForm, story: e.target.value})}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">YouTube Video URL</label>
                    <Input 
                      value={editForm.youtubeVideo || ''} 
                      onChange={(e) => setEditForm({...editForm, youtubeVideo: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Instagram URL</label>
                    <Input 
                      value={editForm.instagram || ''} 
                      onChange={(e) => setEditForm({...editForm, instagram: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">External Listing Link</label>
                  <Input 
                    value={editForm.externalLink || ''} 
                    onChange={(e) => setEditForm({...editForm, externalLink: e.target.value})}
                    required
                  />
                </div>

                <div className="flex gap-3 pt-4 sticky bottom-0 bg-white dark:bg-neutral-900 pb-2">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
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
        </div>
      )}

      <Footer />
    </div>
  );
}

// Ensure a named export exists for consumers that import { RigDetail }
export { RigDetailPage as RigDetail };