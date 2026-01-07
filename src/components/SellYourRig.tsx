import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { HiUpload, HiX, HiChevronDown, HiChevronUp } from "react-icons/hi";
import { BsImage } from "react-icons/bs";
import { toast } from "sonner";
import { useRigs } from "../contexts/RigsContext";
import { useState } from "react";

export function SellYourRig() {
  const { addRig } = useRigs();
  const [galleryImages, setGalleryImages] = useState<File[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
  const [rigType, setRigType] = useState<string>("");
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false); // NEW: Track form open/closed state

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
          
          // Resize to max 1920px on longest side
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
          
          // Compress to 80% quality JPEG
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
    
    // Compress images before preview
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
    
    // Compress images before preview
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
    
    // Remove dragged items
    const [draggedPreview] = newPreviews.splice(draggedIndex, 1);
    const [draggedImage] = newImages.splice(draggedIndex, 1);
    
    // Insert at new position
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
    
    // Prevent multiple submissions
    if (isSubmitting) {
      console.log('Already submitting, ignoring duplicate submission');
      return;
    }
    
    setIsSubmitting(true);
    console.log('Form submit started');
    
    // Store reference to form before async operations
    const form = e.currentTarget;
    
    // Validate rig type was selected
    if (!rigType) {
      console.log('Validation failed: No rig type selected');
      toast.error('Please select a rig type');
      setIsSubmitting(false);
      return;
    }
    
    console.log('Rig type selected:', rigType);
    
    // Get form data
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
    const highlights = formData.get('highlights') as string;
    
    // Map rig type values to display names
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
    
    // Extract YouTube video ID if full URL provided
    let youtubeId = '';
    if (youtubeVideo) {
      const youtubeMatch = youtubeVideo.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
      youtubeId = youtubeMatch ? youtubeMatch[1] : youtubeVideo;
    }
    
    // Parse highlights if provided
    const highlightsArray = highlights 
      ? highlights.split(',').map(h => h.trim()).filter(h => h.length > 0)
      : [];
    
    // Create new rig object (without ID - server will generate it)
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
      highlights: highlightsArray.length > 0 ? highlightsArray : undefined,
    };
    
    try {
      console.log('Submitting rig listing:', newRig);
      
      // Show uploading message
      toast.loading('Uploading images and creating listing...', { id: 'upload-toast' });
      
      // Add to context (this is async and calls the API)
      await addRig(newRig);
      
      console.log('Rig listing submitted successfully');
      
      // Dismiss loading toast
      toast.dismiss('upload-toast');
      
      // Show success message only after successful save
      toast.success("Listing submitted successfully! Scroll up to see it in the Rigs For Sale section.");
      
      // Reset form
      form.reset();
      setGalleryImages([]);
      setGalleryPreviews([]);
      setRigType("");
      
      // Close the form after successful submission
      setIsFormOpen(false);
      
      // Smooth scroll to rigs section after a brief delay
      setTimeout(() => {
        const rigsSection = document.getElementById('rigs');
        if (rigsSection) {
          rigsSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 1000);
    } catch (error) {
      console.error('Error submitting listing:', error);
      toast.error('Failed to submit listing. Please check the console for details and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="sell-your-rig-form" className="bg-white dark:bg-neutral-900 border-y border-neutral-200 dark:border-neutral-700">
      <div className="max-w-7xl mx-auto px-6 py-20 md:py-32">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12 text-center">
            <div className="text-[rgb(89,89,89)] dark:text-neutral-400 text-sm mb-4 tracking-wide text-[20px] font-bold">
              Mobile Dwellings Marketplace
            </div>
            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-2xl mx-auto">
              List your Rig for sale here! We'll show the world what you've built while you handle the sale directly through your preferred marketplace.
            </p>
          </div>

          {/* NEW: Toggle Button */}
          <div className="flex justify-center mb-8">
            <button
              onClick={() => setIsFormOpen(!isFormOpen)}
              className="px-8 py-3 bg-neutral-900 dark:bg-neutral-800 text-white hover:bg-neutral-700 dark:hover:bg-neutral-700 transition-colors rounded flex items-center gap-2"
            >
              List Your Rig For Sale
              {isFormOpen ? (
                <HiChevronUp className="w-5 h-5" />
              ) : (
                <HiChevronDown className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* NEW: Collapsible Form Container */}
          <div 
            className={`transition-all duration-500 ease-in-out overflow-hidden ${
              isFormOpen ? 'max-h-[10000px] opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="bg-neutral-50 dark:bg-neutral-800 p-8 md:p-12 border border-neutral-200 dark:border-neutral-700 rounded-lg">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Basic Information */}
                <div>
                  <h3 className="mb-6 text-neutral-900 dark:text-white text-center">Basic Information</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input 
                        placeholder="Your Name" 
                        required
                        name="name"
                      />
                      <Input 
                        placeholder="Location (City, State/Country)" 
                        required
                        name="location"
                      />
                    </div>
                  </div>
                </div>

                {/* Rig Details */}
                <div className="border-t border-neutral-200 dark:border-neutral-700 pt-8">
                  <h3 className="mb-6 text-neutral-900 dark:text-white text-center">Rig Details</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Select required onValueChange={setRigType}>
                          <SelectTrigger>
                            <SelectValue placeholder="Rig Type" />
                          </SelectTrigger>
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
                      </div>
                      <Input 
                        placeholder="Year, Make, Model" 
                        required
                        name="yearMakeModel"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Input 
                        placeholder="Mileage" 
                        type="text"
                        name="mileage"
                      />
                      <Input 
                        placeholder="Length (ft)" 
                        type="text"
                        name="length"
                      />
                      <Input 
                        placeholder="Asking Price ($)" 
                        required
                        type="text"
                        name="price"
                      />
                    </div>
                  </div>
                </div>

                {/* Build Details */}
                <div className="border-t border-neutral-200 dark:border-neutral-700 pt-8">
                  <h3 className="mb-6 text-neutral-900 dark:text-white text-center">Build Description</h3>
                  <div className="space-y-4">
                    <Textarea 
                      placeholder="Please copy and paste your build description here. Buyers love it when you describe your rig in incredible detail! Literally list everything about it. You got this!" 
                      rows={10}
                      required
                      name="buildDescription" className="text-center"
                    />
                  </div>
                </div>

                {/* Story & Links */}
                <div className="border-t border-neutral-200 dark:border-neutral-700 pt-8">
                  <h3 className="mb-6 text-neutral-900 dark:text-white text-center">Your Story</h3>
                  <div className="space-y-4">
                    <Textarea 
                      placeholder="Tell your story if you'd like. Did you build it yourself? Did you travel? Why are you selling?" 
                      rows={5}
                      name="story" className="text-center"
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input 
                        placeholder="Video Walkthrough URL (optional)" 
                        type="url"
                        name="youtubeVideo" className="text-center"
                      />
                      <Input 
                        placeholder="Instagram URL (optional)" 
                        type="url"
                        name="instagram" className="text-center"
                      />
                    </div>
                  </div>
                </div>

                {/* External Listing Link */}
                <div className="border-t border-neutral-200 dark:border-neutral-700 pt-8">
                  <h3 className="mb-6 text-neutral-900 dark:text-white text-center">Link to Your External Listing</h3>
                  <div className="space-y-4">
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4 text-center">
                      We showcase your listing, but you handle the sale. Provide a link to your Facebook Marketplace, Craigslist, Gumtree, or other listing where buyers can message you directly.
                    </p>
                    <Input 
                      placeholder="External Listing URL" 
                      type="url"
                      required
                      name="externalLink" className="text-center"
                    />
                  </div>
                </div>

                {/* Gallery Images */}
                <div className="border-t border-neutral-200 dark:border-neutral-700 pt-8">
                  <h3 className="mb-6 text-neutral-900 dark:text-white text-center">Photos (10-20 images)</h3>
                  <div className="space-y-4">
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4 text-center">
                      Upload photos of your rig. The <strong>first image will be your cover photo</strong>. Drag and drop to reorder.
                    </p>
                    
                    <label className="block">
                      <div 
                        className={`border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-lg p-8 text-center cursor-pointer hover:border-neutral-400 transition-colors ${isDragOver ? 'border-blue-500' : ''}`}
                        onDrop={handleFileDrop}
                        onDragOver={handleDragOverUpload}
                        onDragLeave={handleDragLeaveUpload}
                      >
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleGalleryImagesChange}
                          className="hidden"
                        />
                        <HiUpload className="w-10 h-10 mx-auto mb-3 text-neutral-400 dark:text-neutral-500" />
                        <p className="text-neutral-600 dark:text-neutral-400">Click to upload photos</p>
                        <p className="text-sm text-neutral-500 mt-2">
                          {galleryImages.length} / 20 images uploaded
                        </p>
                      </div>
                    </label>

                    {galleryPreviews.length > 0 && (
                      <>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-4">
                          Drag to reorder • First image is your cover photo
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                          {galleryPreviews.map((preview, index) => (
                            <div 
                              key={index} 
                              className={`relative group cursor-move ${draggedIndex === index ? 'opacity-50' : ''}`}
                              draggable 
                              onDragStart={() => handleDragStart(index)} 
                              onDragOver={(e) => handleDragOver(e, index)} 
                              onDragEnd={handleDragEnd}
                            >
                              <img 
                                src={preview} 
                                alt={`Gallery ${index + 1}`} 
                                className="w-full h-32 object-cover rounded-lg"
                              />
                              {index === 0 && (
                                <div className="absolute top-2 left-2 bg-neutral-900 dark:bg-neutral-700 text-white px-2 py-1 text-xs rounded">
                                  Cover Photo
                                </div>
                              )}
                              <button
                                type="button"
                                onClick={() => removeGalleryImage(index)}
                                className="absolute top-1 right-1 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 z-10"
                              >
                                <HiX className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <div className="border-t border-neutral-200 dark:border-neutral-700 pt-8">
                  <button 
                    type="submit"
                    className="w-full px-8 py-4 bg-neutral-900 text-white hover:bg-neutral-700 transition-colors rounded"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Listing for Review'}
                  </button>
                  <p className="text-sm text-neutral-500 text-center mt-4">
                    We'll review your listing and publish it ASAP!
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}