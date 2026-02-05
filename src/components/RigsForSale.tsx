import { HiExternalLink, HiLocationMarker, HiChevronDown, HiChevronUp, HiUpload, HiX } from "react-icons/hi";
import { MdSpeed } from "react-icons/md";
import { FaRuler } from "react-icons/fa";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useState } from "react";
import { useRigs } from "../contexts/RigsContext";
import { Link } from "react-router-dom";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { toast } from "sonner";

export function RigsForSale() {
  const { rigs, addRig } = useRigs();
  const [filter, setFilter] = useState<string>("featured");
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  // Form states
  const [galleryImages, setGalleryImages] = useState<File[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
  const [rigType, setRigType] = useState<string>("");
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredRigs = filter === "featured"
    ? rigs.filter(rig => rig.featured).sort((a, b) => (a.featuredOrder || 0) - (b.featuredOrder || 0))
    : filter === "all" 
    ? rigs 
    : rigs.filter(rig => rig.type.toLowerCase().includes(filter.toLowerCase()));

  // Compress image before adding to gallery
  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
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
          
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          
          resolve(canvas.toDataURL('image/jpeg', 0.8));
        };
        img.onerror = reject;
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleGalleryImagesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (galleryImages.length + files.length > 20) {
      toast.error("Maximum 20 gallery images allowed");
      return;
    }

    setGalleryImages([...galleryImages, ...files]);
    
    for (const file of files) {
      try {
        const compressed = await compressImage(file);
        setGalleryPreviews(prev => [...prev, compressed]);
      } catch (error) {
        console.error('Error compressing image:', error);
        toast.error('Failed to process image');
      }
    }
  };

  const handleFileDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'));
    
    if (galleryImages.length + files.length > 20) {
      toast.error("Maximum 20 gallery images allowed");
      return;
    }

    setGalleryImages([...galleryImages, ...files]);
    
    for (const file of files) {
      try {
        const compressed = await compressImage(file);
        setGalleryPreviews(prev => [...prev, compressed]);
      } catch (error) {
        console.error('Error compressing image:', error);
        toast.error('Failed to process image');
      }
    }
  };

  const handleDragOverUpload = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeaveUpload = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const removeGalleryImage = (index: number) => {
    setGalleryImages(galleryImages.filter((_, i) => i !== index));
    setGalleryPreviews(galleryPreviews.filter((_, i) => i !== index));
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newPreviews = [...galleryPreviews];
    const newImages = [...galleryImages];
    
    const [draggedPreview] = newPreviews.splice(draggedIndex, 1);
    const [draggedImage] = newImages.splice(draggedIndex, 1);
    
    newPreviews.splice(index, 0, draggedPreview);
    newImages.splice(index, 0, draggedImage);
    
    setGalleryPreviews(newPreviews);
    setGalleryImages(newImages);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (isSubmitting) {
      return;
    }
    
    setIsSubmitting(true);
    const form = e.currentTarget;
    
    if (!rigType) {
      toast.error('Please select a rig type');
      setIsSubmitting(false);
      return;
    }
    
    const formData = new FormData(form);
    const name = formData.get('name') as string;
    const location = formData.get('location') as string;
    const yearMakeModel = formData.get('yearMakeModel') as string;
    const price = formData.get('price') as string;
    const externalLink = formData.get('externalLink') as string;
    const mileage = formData.get('mileage') as string;
    const length = formData.get('length') as string;
    const buildDescription = formData.get('buildDescription') as string;
    const story = formData.get('story') as string;
    const youtubeVideo = formData.get('youtubeVideo') as string;
    const instagram = formData.get('instagram') as string;
    
    const rigTypeMap: { [key: string]: string } = {
      'van': 'Van / Camper Van',
      'bus': 'School Bus / Skoolie',
      'rv': 'RV / Motorhome',
      'truck': 'Truck Camper',
      'trailer': 'Trailer / Travel Trailer',
      'tiny': 'Tiny House',
      'boat': 'Boat / Sailboat',
      'overland': 'Overland Rig',
      'other': 'Other'
    };
    
    let youtubeId = '';
    if (youtubeVideo) {
      const youtubeMatch = youtubeVideo.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
      youtubeId = youtubeMatch ? youtubeMatch[1] : youtubeVideo;
    }
    
    const newRig = {
      title: yearMakeModel,
      type: rigTypeMap[rigType] || rigType,
      price: price.startsWith('$') ? price : `$${price}`,
      location: location,
      thumbnail: galleryPreviews[0] || "",
      externalLink: externalLink,
      galleryImages: galleryPreviews,
      name: name,
      mileage: mileage || undefined,
      length: length || undefined,
      buildDescription: buildDescription || undefined,
      story: story || undefined,
      youtubeVideo: youtubeId || undefined,
      instagram: instagram || undefined,
    };
    
    try {
      toast.loading('Uploading images and creating listing...', { id: 'upload-toast' });
      
      await addRig(newRig);
      
      toast.dismiss('upload-toast');
      toast.success("Listing submitted successfully!");
      
      form.reset();
      setGalleryImages([]);
      setGalleryPreviews([]);
      setRigType("");
      setIsFormOpen(false);
      
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 500);
    } catch (error) {
      console.error('Error submitting listing:', error);
      toast.error('Failed to submit listing. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="rigs" className="bg-neutral-50 dark:bg-neutral-800 border-y border-neutral-200 dark:border-neutral-700">
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-20">
        <div className="mb-12">
          <h2 className="text-center mb-8 dark:text-white text-3xl font-bold text-neutral-800">
            The Mobile Dwellings Marketplace
          </h2>
          <p className="text-center text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto mb-12">
            Interested in living on the road? Welcome to the premier marketplace for <strong>Skoolies, Van Conversions, and Tiny Homes</strong>. Browse curated listings or list your own rig today.
          </p>
          
          <div className="flex flex-wrap gap-2 justify-center" role="group" aria-label="Filter rigs by type">
            <button
              aria-pressed={filter === "featured"}
              onClick={() => setFilter("featured")}
              className={`px-4 py-2 rounded transition-colors font-medium ${
                filter === "featured"
                  ? "bg-neutral-900 dark:bg-neutral-700 text-white"
                  : "bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-700"
              }`}
            >
              Featured Rigs
            </button>
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded transition-colors font-medium ${
                filter === "all"
                  ? "bg-neutral-900 dark:bg-neutral-700 text-white"
                  : "bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-700"
              }`}
            >
              All Listings
            </button>
            <button
              onClick={() => setFilter("bus")}
              className={`px-4 py-2 rounded transition-colors font-medium ${
                filter === "bus"
                  ? "bg-neutral-900 dark:bg-neutral-700 text-white"
                  : "bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-700"
              }`}
            >
              Skoolies for Sale
            </button>
            <button
              onClick={() => setFilter("van")}
              className={`px-4 py-2 rounded transition-colors font-medium ${
                filter === "van"
                  ? "bg-neutral-900 dark:bg-neutral-700 text-white"
                  : "bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-700"
              }`}
            >
              Vans
            </button>
            <button
              onClick={() => setFilter("tiny")}
              className={`px-4 py-2 rounded transition-colors font-medium ${
                filter === "tiny"
                  ? "bg-neutral-900 dark:bg-neutral-700 text-white"
                  : "bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-700"
              }`}
            >
              Tiny Houses
            </button>
            <button
              onClick={() => setFilter("overland")}
              className={`px-4 py-2 rounded transition-colors font-medium ${
                filter === "overland"
                  ? "bg-neutral-900 dark:bg-neutral-700 text-white"
                  : "bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-700"
              }`}
            >
              Overland
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {filteredRigs.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-neutral-500 dark:text-neutral-400">No rigs found in this category.</p>
            </div>
          ) : (
            filteredRigs.map((rig) => (
              <article key={rig.id} className="group bg-white dark:bg-neutral-900 rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-700 hover:shadow-lg transition-shadow">
                <Link to={`/rigs/${rig.id}`} className="block" aria-label={`View details for ${rig.title}`}>
                  <div className="relative aspect-video overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                    <ImageWithFallback 
                      src={rig.thumbnail}
                      alt={`${rig.title} - ${rig.type} in ${rig.location}`}
                      className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                    />
                    <div className={`absolute top-3 right-3 ${(rig.status === 'sold' || rig.sold) ? 'bg-red-600' : rig.status === 'pending' ? 'bg-yellow-600' : 'bg-neutral-900 dark:bg-neutral-700'} text-white px-3 py-1 text-sm rounded font-semibold`}>
                      {(rig.status === 'sold' || rig.sold) ? 'SOLD' : rig.status === 'pending' ? 'PENDING' : rig.price}
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="text-neutral-500 dark:text-neutral-400 text-xs uppercase tracking-wider mb-2 font-bold">{rig.type}</div>
                    <h3 className="text-lg font-bold mb-3 dark:text-white group-hover:text-neutral-600 dark:group-hover:text-neutral-400 transition-colors line-clamp-2">{rig.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400 mb-3">
                      <HiLocationMarker className="w-4 h-4" />
                      <span>{rig.location}</span>
                      {rig.length && (
                        <>
                          <span className="text-neutral-300 dark:text-neutral-600">•</span>
                          <FaRuler className="w-3 h-3" />
                          <span>{rig.length} ft</span>
                        </>
                      )}
                      {rig.mileage && (
                        <>
                          <span className="text-neutral-300 dark:text-neutral-600">•</span>
                          <MdSpeed className="w-4 h-4" />
                          <span>{rig.mileage}</span>
                        </>
                      )}
                    </div>
                    {rig.highlights && rig.highlights.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {rig.highlights.map((highlight, index) => (
                          <span key={index} className="text-xs bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 px-2 py-1 rounded border border-neutral-200 dark:border-neutral-700">
                            {highlight}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm text-neutral-900 dark:text-white font-bold group-hover:text-neutral-600 dark:group-hover:text-neutral-400 transition-colors">
                      <span>Full Specs & Photos</span>
                      <HiExternalLink className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
              </article>
            ))
          )}
        </div>

        <div id="sell-your-rig" className="mt-16">
          <div className="flex justify-center mb-8">
            <button
              onClick={() => setIsFormOpen(!isFormOpen)}
              className="px-8 py-3 bg-neutral-900 dark:bg-neutral-800 text-white hover:bg-neutral-700 dark:hover:bg-neutral-700 transition-colors rounded-full font-bold flex items-center gap-2 shadow-md"
            >
              {isFormOpen ? "Close Form" : "List Your Rig For Sale"}
              {isFormOpen ? <HiChevronUp className="w-5 h-5" /> : <HiChevronDown className="w-5 h-5" />}
            </button>
          </div>

          {isFormOpen && (
            <div className="max-w-4xl mx-auto">
              <div className="mb-8 text-center">
                <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  List your Rig for sale here! We'll show the world what you've built while you handle the sale directly through your preferred marketplace.
                </p>
              </div>

              <div className="bg-white dark:bg-neutral-900 p-8 md:p-12 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-xl">
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div>
                    <h4 className="mb-6 text-xl font-bold text-neutral-900 dark:text-white text-center">Contact Information</h4>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input placeholder="Your Name" required name="name" />
                        <Input placeholder="Location (City, State/Country)" required name="location" />
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-neutral-200 dark:border-neutral-700 pt-8">
                    <h4 className="mb-6 text-xl font-bold text-neutral-900 dark:text-white text-center">Rig Details</h4>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Select required onValueChange={setRigType}>
                          <SelectTrigger><SelectValue placeholder="Rig Type" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="van">Van / Camper Van</SelectItem>
                            <SelectItem value="bus">School Bus / Skoolie</SelectItem>
                            <SelectItem value="rv">RV / Motorhome</SelectItem>
                            <SelectItem value="truck">Truck Camper</SelectItem>
                            <SelectItem value="trailer">Trailer / Travel Trailer</SelectItem>
                            <SelectItem value="tiny">Tiny House</SelectItem>
                            <SelectItem value="boat">Boat / Sailboat</SelectItem>
                            <SelectItem value="overland">Overland Rig</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <Input placeholder="Year, Make, Model" required name="yearMakeModel" />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Input placeholder="Mileage" type="text" name="mileage" />
                        <Input placeholder="Length (ft)" type="text" name="length" />
                        <Input placeholder="Asking Price ($)" required type="text" name="price" />
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-neutral-200 dark:border-neutral-700 pt-8">
                    <h4 className="mb-6 text-xl font-bold text-neutral-900 dark:text-white text-center">Build Description</h4>
                    <div className="space-y-4">
                      <Textarea placeholder="Describe your rig in detail..." rows={10} required name="buildDescription" className="text-center" />
                    </div>
                  </div>

                  <div className="border-t border-neutral-200 dark:border-neutral-700 pt-8">
                    <h4 className="mb-6 text-xl font-bold text-neutral-900 dark:text-white text-center">Your Story</h4>
                    <div className="space-y-4">
                      <Textarea placeholder="Tell your story..." rows={5} name="story" className="text-center" />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input placeholder="Video Walkthrough URL" type="url" name="youtubeVideo" className="text-center" />
                        <Input placeholder="Instagram URL" type="url" name="instagram" className="text-center" />
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-neutral-200 dark:border-neutral-700 pt-8">
                    <h4 className="mb-6 text-xl font-bold text-neutral-900 dark:text-white text-center">External Listing Link</h4>
                    <div className="space-y-4">
                      <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4 text-center">Provide a link to where buyers can contact you.</p>
                      <Input placeholder="External Listing URL" type="url" required name="externalLink" className="text-center" />
                    </div>
                  </div>

                  <div className="border-t border-neutral-200 dark:border-neutral-700 pt-8">
                    <h4 className="mb-6 text-xl font-bold text-neutral-900 dark:text-white text-center">Photos (10-20 images)</h4>
                    <div className="space-y-4">
                      <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4 text-center">Upload photos of your rig. The <strong>first image will be your cover photo</strong>.</p>
                      <label className="block">
                        <div className={`border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-lg p-8 text-center cursor-pointer ${isDragOver ? 'border-blue-500' : ''}`} onDrop={handleFileDrop} onDragOver={handleDragOverUpload} onDragLeave={handleDragLeaveUpload}>
                          <input type="file" accept="image/*" multiple onChange={handleGalleryImagesChange} className="hidden" />
                          <HiUpload className="w-10 h-10 mx-auto mb-3 text-neutral-400" />
                          <p>Click to upload photos</p>
                        </div>
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                        {galleryPreviews.map((preview, index) => (
                          <div key={index} className="relative" draggable onDragStart={() => handleDragStart(index)} onDragOver={(e) => handleDragOver(e, index)} onDragEnd={handleDragEnd}>
                            <img src={preview} alt="Preview" className="w-full h-32 object-cover rounded-lg" />
                            <button type="button" onClick={() => removeGalleryImage(index)} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full"><HiX className="w-3 h-3" /></button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <button type="submit" className="w-full py-4 bg-neutral-900 text-white rounded-lg font-bold" disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting...' : 'Submit Listing'}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}