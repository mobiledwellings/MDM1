import { useState } from "react";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

export function Newsletter() {
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState("");

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setEmail("");
    }, 3000);
  };

  const handleFeatureSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Thank you for your submission! We'll be in touch soon.");
  };

  return (
    <section id="newsletter" className="max-w-7xl mx-auto px-6 py-20 md:py-32">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Newsletter */}
        <div className="border-t border-neutral-200 dark:border-neutral-700 pt-8">
          <h3 className="mb-4 dark:text-white">Subscribe to Our Newsletter</h3>
          <p className="text-neutral-600 dark:text-neutral-400 mb-6 leading-relaxed">
            Get notified when we publish new video stories about mobile living, minimalism, and sustainable lifestyles.
          </p>
          
          {submitted ? (
            <div className="bg-neutral-100 dark:bg-neutral-800 px-6 py-4 text-neutral-700 dark:text-neutral-300">
              Thank you for subscribing!
            </div>
          ) : (
            <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
              <Input 
                type="email" 
                placeholder="your@email.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1"
              />
              <button 
                type="submit"
                className="px-6 py-2 bg-neutral-900 dark:bg-neutral-700 text-white hover:bg-neutral-700 dark:hover:bg-neutral-600 transition-colors"
              >
                Subscribe
              </button>
            </form>
          )}
        </div>

        {/* Feature Submission */}
        <div className="border-t border-neutral-200 dark:border-neutral-700 pt-8">
          <h3 className="mb-4 dark:text-white">Get Featured</h3>
          <p className="text-neutral-600 dark:text-neutral-400 mb-6 leading-relaxed">
            Share your mobile dwelling story with us. Fill out the form below and we'll review your submission.
          </p>
          
          <form onSubmit={handleFeatureSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Input 
                  placeholder="Name" 
                  required
                />
              </div>
              <div>
                <Input 
                  type="email" 
                  placeholder="Email" 
                  required
                />
              </div>
            </div>

            <div>
              <Select required>
                <SelectTrigger>
                  <SelectValue placeholder="Type of dwelling" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="van">Van / Camper Van</SelectItem>
                  <SelectItem value="bus">School Bus / Skoolie</SelectItem>
                  <SelectItem value="rv">RV / Motorhome</SelectItem>
                  <SelectItem value="truck">Truck Camper</SelectItem>
                  <SelectItem value="trailer">Trailer</SelectItem>
                  <SelectItem value="tiny">Tiny House</SelectItem>
                  <SelectItem value="boat">Boat / Sailboat</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Textarea 
                placeholder="Tell us about your build and your story..." 
                rows={4}
                required
              />
            </div>

            <div>
              <Input 
                placeholder="Instagram handle (optional)" 
              />
            </div>

            <button 
              type="submit"
              className="w-full px-6 py-3 bg-neutral-900 dark:bg-neutral-700 text-white hover:bg-neutral-700 dark:hover:bg-neutral-600 transition-colors"
            >
              Submit for Feature
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}