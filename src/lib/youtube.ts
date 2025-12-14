// YouTube Data API v3 integration
// Get your API key from: https://console.cloud.google.com/apis/credentials

const YOUTUBE_API_KEY = 'AIzaSyAQ9FFrRcD0Qha8LfuKuzmYhVwC-05yzAs'; // Your YouTube API key
const CHANNEL_ID = 'UC1XsdvycCtX5ZgKrzoZkPvQ';

export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  publishedAt: string;
  videoId: string;
  duration?: string;
  viewCount?: string;
}

// Mock video data for when API quota is exceeded
const MOCK_VIDEOS: YouTubeVideo[] = [
  {
    id: 'dQw4w9WgXcQ',
    videoId: 'dQw4w9WgXcQ',
    title: 'Couple Builds Stunning Off-Grid Skoolie with Solar Power',
    description: 'Follow along as we tour this incredible school bus conversion featuring full solar setup, composting toilet, and beautiful wood finishes. This couple spent 18 months building their dream home on wheels.',
    thumbnail: 'https://images.unsplash.com/photo-1464219789935-c2d9d9aba644?w=1280&h=720&fit=crop',
    publishedAt: '2024-11-15T10:00:00Z',
    duration: '18:45',
    viewCount: '245K'
  },
  {
    id: 'mock-video-2',
    videoId: 'mock-video-2',
    title: 'Overland Rig Tour: Toyota Land Cruiser Expedition Build',
    description: 'An in-depth look at a custom built Toyota Land Cruiser set up for long-term overlanding. Rooftop tent, fridge setup, water storage, and everything needed for months off-grid.',
    thumbnail: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=1280&h=720&fit=crop',
    publishedAt: '2024-11-10T14:30:00Z',
    duration: '22:15',
    viewCount: '189K'
  },
  {
    id: 'mock-video-3',
    videoId: 'mock-video-3',
    title: 'Living Full-Time in a Vintage Airstream: 1 Year Update',
    description: 'One year ago we moved into our restored 1976 Airstream. Here\'s what we\'ve learned about full-time RV living, our biggest challenges, and why we wouldn\'t change a thing.',
    thumbnail: 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=1280&h=720&fit=crop',
    publishedAt: '2024-11-05T09:15:00Z',
    duration: '15:32',
    viewCount: '312K'
  },
  {
    id: 'mock-video-4',
    videoId: 'mock-video-4',
    title: 'From Empty Van to Cozy Home: Sprinter Conversion Build',
    description: 'Complete build series of converting a Mercedes Sprinter van into a fully functional tiny home. See the entire process from insulation to installing a wet bath.',
    thumbnail: 'https://images.unsplash.com/photo-1527786356703-4b100091cd2c?w=1280&h=720&fit=crop',
    publishedAt: '2024-10-28T11:00:00Z',
    duration: '25:18',
    viewCount: '427K'
  },
  {
    id: 'mock-video-5',
    videoId: 'mock-video-5',
    title: 'Boondocking in the Desert: Off-Grid Living Tips',
    description: 'Join us as we spend two weeks completely off-grid in the Arizona desert. Learn our tips for water conservation, solar power management, and finding the best free camping spots.',
    thumbnail: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=1280&h=720&fit=crop',
    publishedAt: '2024-10-20T16:45:00Z',
    duration: '19:07',
    viewCount: '156K'
  },
  {
    id: 'mock-video-6',
    videoId: 'mock-video-6',
    title: 'School Bus Conversion Tour: Family of Four Goes Tiny',
    description: 'A young family of four traded their suburban home for a converted school bus. See how they designed efficient storage, sleeping spaces for kids, and homeschool area.',
    thumbnail: 'https://images.unsplash.com/photo-1527786356703-4b100091cd2c?w=1280&h=720&fit=crop',
    publishedAt: '2024-10-12T13:20:00Z',
    duration: '21:43',
    viewCount: '298K'
  },
  {
    id: 'mock-video-7',
    videoId: 'mock-video-7',
    title: 'Tiny House on Wheels: Modern Minimalist Design',
    description: 'This custom tiny house features a clean modern aesthetic with clever space-saving solutions. Full kitchen, bathroom with shower, and a sleeping loft with standing room.',
    thumbnail: 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=1280&h=720&fit=crop',
    publishedAt: '2024-10-05T10:30:00Z',
    duration: '17:25',
    viewCount: '381K'
  },
  {
    id: 'mock-video-8',
    videoId: 'mock-video-8',
    title: 'Converted Ambulance to Adventure Rig',
    description: 'See this unique conversion of a retired ambulance into the ultimate adventure vehicle. Custom bed platform, full kitchen, and 4x4 capabilities for serious off-roading.',
    thumbnail: 'https://images.unsplash.com/photo-1464219789935-c2d9d9aba644?w=1280&h=720&fit=crop',
    publishedAt: '2024-09-28T15:00:00Z',
    duration: '20:11',
    viewCount: '203K'
  },
  {
    id: 'mock-video-9',
    videoId: 'mock-video-9',
    title: 'Van Life Reality Check: The Good, Bad, and Ugly',
    description: 'An honest conversation about the realities of van life. We cover the challenges nobody talks about, from finding places to shower to dealing with vehicle breakdowns.',
    thumbnail: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=1280&h=720&fit=crop',
    publishedAt: '2024-09-20T12:15:00Z',
    duration: '16:52',
    viewCount: '512K'
  }
];

// Decode HTML entities from YouTube text
function decodeHTMLEntities(text: string): string {
  const textarea = document.createElement('textarea');
  textarea.innerHTML = text;
  return textarea.value;
}

export async function fetchLatestVideos(maxResults: number = 3): Promise<YouTubeVideo[]> {
  try {
    // Fetch latest uploads from the channel
    const searchUrl = `https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&channelId=${CHANNEL_ID}&part=snippet&order=viewCount&type=video&maxResults=${maxResults}`;
    
    const searchResponse = await fetch(searchUrl);
    
    if (!searchResponse.ok) {
      const errorData = await searchResponse.json().catch(() => ({}));
      
      // Check if it's a quota exceeded error
      if (errorData?.error?.errors?.[0]?.reason === 'quotaExceeded') {
        console.log('YouTube API quota exceeded. Using cached video content.');
        return MOCK_VIDEOS.slice(0, maxResults);
      }
      
      console.error('YouTube API error:', errorData);
      throw new Error(`Failed to fetch videos from YouTube: ${searchResponse.status}`);
    }
    
    const searchData = await searchResponse.json();
    
    if (!searchData.items || searchData.items.length === 0) {
      return MOCK_VIDEOS.slice(0, maxResults);
    }
    
    // Get video IDs to fetch additional details
    const videoIds = searchData.items.map((item: any) => item.id.videoId).join(',');
    
    // Fetch video details (duration, view count, etc.)
    const videoUrl = `https://www.googleapis.com/youtube/v3/videos?key=${YOUTUBE_API_KEY}&id=${videoIds}&part=contentDetails,statistics`;
    
    const videoResponse = await fetch(videoUrl);
    
    if (!videoResponse.ok) {
      const errorData = await videoResponse.json().catch(() => ({}));
      
      // Check if it's a quota exceeded error
      if (errorData?.error?.errors?.[0]?.reason === 'quotaExceeded') {
        console.log('YouTube API quota exceeded. Using cached video content.');
        return MOCK_VIDEOS.slice(0, maxResults);
      }
      
      console.error('YouTube API error (video details):', errorData);
      throw new Error(`Failed to fetch video details: ${videoResponse.status}`);
    }
    
    const videoData = await videoResponse.json();
    
    // Combine the data
    const videos: YouTubeVideo[] = searchData.items.map((item: any, index: number) => {
      const videoDetails = videoData.items?.[index];
      
      // Use YouTube's direct maxresdefault URL for the sharpest quality
      // This gives us 1280x720 thumbnails which are much sharper than API-provided URLs
      const videoId = item.id.videoId;
      const thumbnail = `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;
      
      return {
        id: item.id.videoId,
        videoId: item.id.videoId,
        title: decodeHTMLEntities(item.snippet.title),
        description: decodeHTMLEntities(item.snippet.description),
        thumbnail: thumbnail,
        publishedAt: item.snippet.publishedAt,
        duration: videoDetails ? formatDuration(videoDetails.contentDetails.duration) : undefined,
        viewCount: videoDetails ? formatViewCount(videoDetails.statistics.viewCount) : undefined,
      };
    });
    
    // List of video titles to exclude
    const excludedTitles = [
      "Family Transforms Rare School Bus into STUNNING Tiny House: 2 Year Timelapse!",
      "Family Lives with NO BILLS and NO DEBT in a Self-Built Tiny House",
      "A Rare California School Bus Becomes a DREAMY Tiny House",
      "If You See Any of These RVs For Sale BUY THEM"
    ];
    
    // Filter out YouTube Shorts (videos under 3 minutes) and excluded videos
    const longFormVideos = videos.filter(video => {
      if (!video.duration) return true;
      const durationInSeconds = parseDurationToSeconds(videoData.items.find((v: any) => v.id === video.id)?.contentDetails.duration);
      const isLongEnough = durationInSeconds >= 180; // Only include videos 3 minutes or longer
      const isNotExcluded = !excludedTitles.includes(video.title);
      return isLongEnough && isNotExcluded;
    });
    
    return longFormVideos;
  } catch (error) {
    console.error('Error fetching YouTube videos:', error);
    // Return mock videos on error
    return MOCK_VIDEOS.slice(0, maxResults);
  }
}

// Convert ISO 8601 duration to seconds
function parseDurationToSeconds(duration: string): number {
  if (!duration) return 0;
  
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  
  if (!match) return 0;
  
  const hours = match[1] ? parseInt(match[1].replace('H', '')) : 0;
  const minutes = match[2] ? parseInt(match[2].replace('M', '')) : 0;
  const seconds = match[3] ? parseInt(match[3].replace('S', '')) : 0;
  
  return hours * 3600 + minutes * 60 + seconds;
}

// Convert ISO 8601 duration to readable format (e.g., "PT15M30S" to "15:30")
function formatDuration(duration: string): string {
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  
  if (!match) return '0:00';
  
  const hours = match[1] ? parseInt(match[1].replace('H', '')) : 0;
  const minutes = match[2] ? parseInt(match[2].replace('M', '')) : 0;
  const seconds = match[3] ? parseInt(match[3].replace('S', '')) : 0;
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

// Format view count (e.g., "1234567" to "1.2M")
function formatViewCount(count: string): string {
  const num = parseInt(count);
  
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  
  return num.toString();
}