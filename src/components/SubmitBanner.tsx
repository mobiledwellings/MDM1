import { HiArrowRight, HiUpload, HiX } from "react-icons/hi";
import { BsImage } from "react-icons/bs";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { useState } from "react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { projectId, publicAnonKey } from '../utils/supabase/info';

export function SubmitBanner() {
  const [exteriorImage, setExteriorImage] = useState<File | null>(null);
  const [interiorImage, setInteriorImage] = useState<File | null>(null);
  const [exteriorPreview, setExteriorPreview] = useState<string>("");
  const [interiorPreview, setInteriorPreview] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dwellingType, setDwellingType] = useState<string>("");
  const [exteriorDragging, setExteriorDragging] = useState(false);
  const [interiorDragging, setInteriorDragging] = useState(false);

  const handleExteriorImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setExteriorImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setExteriorPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInteriorImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setInteriorImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setInteriorPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Drag and drop handlers for exterior
  const handleExteriorDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setExteriorDragging(true);
  };

  const handleExteriorDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setExteriorDragging(false);
  };

  const handleExteriorDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setExteriorDragging(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setExteriorImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setExteriorPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Drag and drop handlers for interior
  const handleInteriorDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setInteriorDragging(true);
  };

  const handleInteriorDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setInteriorDragging(false);
  };

  const handleInteriorDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setInteriorDragging(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setInteriorImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setInteriorPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Compress image helper (same as marketplace)
  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          // Max dimensions
          const maxDimension = 1920;
          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              height = (height / width) * maxDimension;
              width = maxDimension;
            } else {
              width = (width / height) * maxDimension;
              height = maxDimension;
            }
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

  const handleFeatureSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Store reference to form before async operations
    const form = e.currentTarget;

    // Validate required fields that are not native-visible (file inputs are hidden)
    if (!exteriorImage || !interiorImage) {
      toast.error('Please add both exterior and interior photos.');
      setIsSubmitting(false);
      return;
    }

    if (!dwellingType) {
      toast.error('Please select the type of dwelling.');
      setIsSubmitting(false);
      return;
    }

    try {
      const formData = new FormData(form);
      const name = formData.get('name') as string;
      const email = formData.get('email') as string;
      const location = formData.get('location') as string;
      const story = formData.get('story') as string;
      const socials = formData.get('socials') as string;

      // Compress images
      let compressedExterior = '';
      let compressedInterior = '';

      if (exteriorImage) {
        toast.info('Compressing images...');
        compressedExterior = await compressImage(exteriorImage);
      }
      
      if (interiorImage) {
        compressedInterior = await compressImage(interiorImage);
      }

      // Submit to server
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-3ab5944d/feature-submission`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name,
            email,
            location,
            dwellingType,
            story,
            socials,
            exteriorImage: compressedExterior,
            interiorImage: compressedInterior,
          }),
        }
      );

      const result = await response.json();
      
      console.log('Feature submission response:', response.status, result);

      if (response.ok) {
        toast.success("Thank you for your submission! We'll be in touch soon.");
        // Reset form
        form.reset();
        setExteriorImage(null);
        setInteriorImage(null);
        setExteriorPreview('');
        setInteriorPreview('');
        setDwellingType('');
      } else {
        console.error('Submission error:', result);
        toast.error(result.error || 'Failed to submit. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="submit" className="bg-neutral-50 dark:bg-neutral-800 border-y border-neutral-200 dark:border-neutral-700">
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="flex flex-col justify-center">
            <p className="text-neutral-600 dark:text-neutral-400 mb-6 leading-loose text-center text-lg">
              <strong>Mobile Dwellings</strong> is a documentary video series exploring alternative ways of living — From converted school buses and overland rigs to tiny homes and liveaboard sailboats, we focus on the people behind the builds: the decisions they made, the tradeoffs they accepted, and the freedom they found along the way.
            </p>
            <p className="text-neutral-600 dark:text-neutral-400 mb-6 leading-loose text-center text-lg">
              Each video is a conversation, not just a tour. We care as much about why someone chose this life as the challenges, risks, and moments that made it worth it.
            </p>
            <p className="text-neutral-600 dark:text-neutral-400 leading-loose text-center text-lg">
              If you have a mobile dwelling and a story you want to share — whether it's finished or still unfolding — we'd love to hear from you.
            </p>
          </div>

          <div className="bg-white dark:bg-neutral-900 p-8 border border-neutral-200 dark:border-neutral-700 rounded-lg">
            <h3 className="mb-6 dark:text-white text-center">Get Featured</h3>
            
            <form onSubmit={handleFeatureSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Input 
                    name="name"
                    placeholder="Name" 
                    required className="text-left"
                  />
                </div>
                <div>
                  <Input 
                    name="email"
                    type="email" 
                    placeholder="Email" 
                    required className="text-left"
                  />
                </div>
              </div>

              <div>
                <Input 
                  name="location"
                  placeholder="Your location/destination" 
                  required className="text-left"
                />
              </div>

              <div>
                <Select required value={dwellingType} onValueChange={setDwellingType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Type of dwelling" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bus">School Bus / Skoolie</SelectItem>
                    <SelectItem value="rv">RV / Motorhome</SelectItem>
                    <SelectItem value="truck">Truck Camper</SelectItem>
                    <SelectItem value="trailer">Trailer</SelectItem>
                    <SelectItem value="tiny">Tiny House</SelectItem>
                    <SelectItem value="boat">Boat / Sailboat</SelectItem>
                    <SelectItem value="overland">Overland Rig</SelectItem>
                    <SelectItem value="van">Van / Camper Van</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Textarea 
                  name="story"
                  placeholder="Tell us about your build and your story..." 
                  rows={4}
                  required className="text-center"
                />
              </div>

              <div>
                <Input 
                  name="socials"
                  placeholder="Link your socials (optional)" 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleExteriorImageChange}
                      className="hidden"
                    />
                    <div
                      className={`flex items-center justify-center h-32 border-2 border-dashed rounded-lg transition-colors ${
                        exteriorDragging
                          ? 'border-neutral-900 dark:border-neutral-100 bg-neutral-100 dark:bg-neutral-700'
                          : 'border-neutral-300 dark:border-neutral-600 hover:border-neutral-900 dark:hover:border-neutral-100'
                      }`}
                      onDragOver={handleExteriorDragOver}
                      onDragLeave={handleExteriorDragLeave}
                      onDrop={handleExteriorDrop}
                    >
                      {exteriorPreview ? (
                        <div className="relative w-full h-full">
                          <ImageWithFallback
                            src={exteriorPreview}
                            alt="Exterior Preview"
                            className="w-full h-full object-cover rounded-lg"
                          />
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-32">
                          <HiUpload className="h-6 w-6 text-neutral-500 dark:text-neutral-400" />
                          <p className="text-neutral-500 dark:text-neutral-400 text-sm mt-2 text-center px-2">
                            {exteriorDragging ? 'Drop here' : 'Exterior Photo *'}
                          </p>
                        </div>
                      )}
                    </div>
                  </label>
                </div>
                <div>
                  <label className="block cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleInteriorImageChange}
                      className="hidden"
                    />
                    <div
                      className={`flex items-center justify-center h-32 border-2 border-dashed rounded-lg transition-colors ${
                        interiorDragging
                          ? 'border-neutral-900 dark:border-neutral-100 bg-neutral-100 dark:bg-neutral-700'
                          : 'border-neutral-300 dark:border-neutral-600 hover:border-neutral-900 dark:hover:border-neutral-100'
                      }`}
                      onDragOver={handleInteriorDragOver}
                      onDragLeave={handleInteriorDragLeave}
                      onDrop={handleInteriorDrop}
                    >
                      {interiorPreview ? (
                        <div className="relative w-full h-full">
                          <ImageWithFallback
                            src={interiorPreview}
                            alt="Interior Preview"
                            className="w-full h-full object-cover rounded-lg"
                          />
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-32">
                          <HiUpload className="h-6 w-6 text-neutral-500 dark:text-neutral-400" />
                          <p className="text-neutral-500 dark:text-neutral-400 text-sm mt-2 text-center px-2">
                            {interiorDragging ? 'Drop here' : 'Interior Photo *'}
                          </p>
                        </div>
                      )}
                    </div>
                  </label>
                </div>
              </div>

              <button 
                type="submit"
                className="w-full px-6 py-3 bg-neutral-900 dark:bg-neutral-700 text-white hover:bg-neutral-700 dark:hover:bg-neutral-600 transition-colors"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit for Feature"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}