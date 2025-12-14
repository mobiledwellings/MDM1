import { HiPlay } from "react-icons/hi";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useEffect, useState } from "react";
import { fetchLatestVideos, YouTubeVideo } from "../lib/youtube";

export function FeaturedStory() {
  const [featuredVideo, setFeaturedVideo] = useState<YouTubeVideo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadVideo() {
      const videos = await fetchLatestVideos(1);
      if (videos.length > 0) {
        setFeaturedVideo(videos[0]);
      }
      setLoading(false);
    }
    loadVideo();
  }, []);

  // Show loading state or fallback content
  if (loading || !featuredVideo) {
    return (
      <section className="max-w-7xl mx-auto px-6 py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative group cursor-pointer">
            <div className="aspect-video relative overflow-hidden bg-neutral-100 dark:bg-neutral-800 animate-pulse rounded-lg"></div>
          </div>
          <div className="lg:pl-8">
            <div className="h-4 bg-neutral-100 dark:bg-neutral-800 w-32 mb-4 animate-pulse"></div>
            <div className="h-12 bg-neutral-100 dark:bg-neutral-800 w-full mb-6 animate-pulse"></div>
            <div className="h-24 bg-neutral-100 dark:bg-neutral-800 w-full mb-4 animate-pulse"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-6 py-12 md:py-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="relative group cursor-pointer" onClick={() => window.open(`https://youtube.com/watch?v=${featuredVideo.videoId}`, '_blank')}>
          <div className="aspect-video relative overflow-hidden rounded-lg">
            <ImageWithFallback 
              src={featuredVideo.thumbnail}
              alt={featuredVideo.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
              <div className="w-16 h-16 bg-white/90 group-hover:bg-white rounded-full flex items-center justify-center transition-colors">
                <HiPlay className="w-7 h-7 text-neutral-900 ml-1" fill="currentColor" />
              </div>
            </div>
            {featuredVideo.duration && (
              <div className="absolute bottom-3 right-3 bg-black/75 text-white px-2 py-1 text-xs">
                {featuredVideo.duration}
              </div>
            )}
          </div>
        </div>
        
        <div className="lg:pl-8">
          <div className="text-neutral-500 dark:text-neutral-400 text-sm mb-4 tracking-wide uppercase">
            Featured Story
          </div>
          <h1 className="mb-6 leading-tight dark:text-white">
            {featuredVideo.title}
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 mb-6 leading-relaxed">
            {featuredVideo.description}
          </p>
          {featuredVideo.viewCount && (
            <p className="text-neutral-500 dark:text-neutral-400 text-sm mb-6">
              {featuredVideo.viewCount} views
            </p>
          )}
          <div className="mt-8">
            <a 
              href={`https://youtube.com/watch?v=${featuredVideo.videoId}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block text-neutral-900 dark:text-white border-b-2 border-neutral-900 dark:border-white pb-1 hover:border-neutral-500 dark:hover:border-neutral-400 transition-colors"
            >
              Watch their story
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}