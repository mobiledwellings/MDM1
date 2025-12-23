import { useParams, useNavigate } from "react-router-dom";
import { useRigs } from "../contexts/RigsContext";
import { useAdmin } from "../contexts/AdminContext";
import { SEO } from "../components/SEO";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { useState, useEffect } from "react";
import { HiExternalLink, HiCalendar, HiLocationMarker, HiArrowLeft } from "react-icons/hi";
import { MdSpeed } from "react-icons/md";
import { FaRuler, FaStar, FaTrash } from "react-icons/fa";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

export function RigDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { rigs, loading, updateRigStatus, toggleFeatured, deleteRig } = useRigs();
  const { isAdmin } = useAdmin();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

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

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-900">
      <SEO 
        title={rig.title}
        description={`Price: ${rig.price}. Location: ${rig.location}. ${rig.buildDescription?.substring(0, 100)}...`}
        image={rig.thumbnail}
        url={window.location.href}
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
              <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
                {rig.galleryImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`aspect-video rounded-lg overflow-hidden border-2 transition-all ${selectedImageIndex === index ? 'border-neutral-900 dark:border-white' : 'border-transparent'}`}
                  >
                    <img src={image} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            <div className="prose dark:prose-invert max-w-none">
              <h3 className="text-2xl font-bold border-b pb-2 dark:border-neutral-700">Build Description</h3>
              <p className="whitespace-pre-line text-neutral-700 dark:text-neutral-300 mt-4">{rig.buildDescription}</p>
              
              {rig.story && (
                <>
                  <h3 className="text-2xl font-bold mt-12 border-b pb-2 dark:border-neutral-700">The Story</h3>
                  <p className="whitespace-pre-line text-neutral-700 dark:text-neutral-300 mt-4">{rig.story}</p>
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
                  <button onClick={() => { if(confirm('Are you sure?')) { deleteRig(rig.id); navigate('/rigs-for-sale'); } }} className="w-full py-2 bg-red-100 text-red-700 rounded-lg flex items-center justify-center gap-2 font-medium">
                    <FaTrash /> Delete Listing
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

// Ensure a named export exists for consumers that import { RigDetail }
export { RigDetailPage as RigDetail };