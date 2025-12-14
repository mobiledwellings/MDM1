import { HiPlay } from "react-icons/hi";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useEffect, useState } from "react";
import { fetchLatestVideos, YouTubeVideo } from "../lib/youtube";

export function VideoMasonry() {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    async function loadVideos() {
      const fetchedVideos = await fetchLatestVideos(30); // Fetch 30 videos to account for filtering
      setVideos(fetchedVideos.slice(0, 9)); // Display only 9 after filtering
      setLoading(false);
    }
    loadVideos();
  }, []);

  return (
    <section id="videos" className="max-w-7xl mx-auto px-6 py-8 md:py-12">
      <div className="mb-8">
        <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl md:max-w-none text-lg md:text-xl text-center mx-auto" style={{ fontWeight: 700 }}>
          Exploring authenticity, sustainability, and freedom through intimate video portraits about mobile living.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
        {loading ? (
          <div className="col-span-full text-center">
            <p className="dark:text-neutral-400">Loading videos...</p>
          </div>
        ) : (
          videos.slice(0, isMobile ? 4 : 9).map((video) => (
            <article key={video.id} className="group">
              <a
                href={`https://youtube.com/watch?v=${video.videoId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <div className="relative aspect-video mb-4 overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                  <ImageWithFallback 
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                    style={{ imageRendering: 'crisp-edges' }}
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-white/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <HiPlay className="w-6 h-6 text-neutral-900 ml-0.5" fill="currentColor" />
                    </div>
                  </div>
                  {video.duration && (
                    <div className="absolute bottom-3 right-3 bg-black/80 text-white px-2 py-1 text-xs rounded">
                      {video.duration}
                    </div>
                  )}
                </div>
                
                {video.viewCount && (
                  <div className="text-neutral-500 dark:text-neutral-400 text-xs uppercase tracking-wider mb-2">
                    {video.viewCount} views
                  </div>
                )}
                <h3 className="mb-2 dark:text-white group-hover:text-neutral-600 dark:group-hover:text-neutral-400 transition-colors line-clamp-2">
                  {video.title}
                </h3>
              </a>
            </article>
          ))
        )}
      </div>

      <div className="text-center mt-16">
        <a 
          href="https://youtube.com/@mobiledwellings"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block text-white bg-neutral-900 dark:bg-neutral-700 px-8 py-3 rounded hover:bg-neutral-700 dark:hover:bg-neutral-600 transition-colors"
        >
          View All Videos
        </a>
      </div>
    </section>
  );
}