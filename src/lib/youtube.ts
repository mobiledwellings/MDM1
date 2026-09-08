// YouTube Data API v3 integration
// Get your API key from: https://console.cloud.google.com/apis/credentials

const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY || ''
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

// Fallback shown when the YouTube API key is missing or its daily quota is
// exceeded. These are real Mobile Dwellings uploads, not placeholders — the
// previous version of this list was Unsplash stock photography and invented
// titles, and its first entry linked to videoId "dQw4w9WgXcQ", which is a
// rickroll. Any visitor hitting the homepage after a quota trip saw six fake
// videos and a prank link.
//
// Refresh occasionally from the channel feed, which needs no API key:
//   https://www.youtube.com/feeds/videos.xml?channel_id=UC1XsdvycCtX5ZgKrzoZkPvQ
const MOCK_VIDEOS: YouTubeVideo[] = [
  {
    id: "O28edJvMHQI",
    videoId: "O28edJvMHQI",
    title: "Could you live in a bus in Tasmania?",
    description: "Ben built a home inside of a retired school bus on the edge of a cliff in Tasmania as a retreat from society and he's opened it up to anyone who wants to spend some time experiencing his little slice ",
    thumbnail: "https://i.ytimg.com/vi/O28edJvMHQI/maxresdefault.jpg",
    publishedAt: "2026-08-25T04:20:50+00:00",
    viewCount: "9K",
  },
  {
    id: "iJWxQXCMxkU",
    videoId: "iJWxQXCMxkU",
    title: "They Built a Bus to Travel from Alaska to Argentina",
    description: "⚡ Signature Solar Coupon Code (August 2026): MD50OFF",
    thumbnail: "https://i.ytimg.com/vi/iJWxQXCMxkU/maxresdefault.jpg",
    publishedAt: "2026-08-20T19:00:27+00:00",
    viewCount: "26K",
  },
  {
    id: "fVRBa0Rgx9I",
    videoId: "fVRBa0Rgx9I",
    title: "He Built an Off-Grid Sanctuary in Tasmania with a Bus, Cave and Hot Tub",
    description: "⚡ Signature Solar Coupon Code (August 2026): MD50OFF",
    thumbnail: "https://i.ytimg.com/vi/fVRBa0Rgx9I/maxresdefault.jpg",
    publishedAt: "2026-07-31T14:54:10+00:00",
    viewCount: "262K",
  },
  {
    id: "i49aOnV1SXU",
    videoId: "i49aOnV1SXU",
    title: "They Couldn't Afford a Home in Cali. Bought a Yacht Instead",
    description: "⚡ Signature Solar Coupon Code (August 2026): MD50OFF",
    thumbnail: "https://i.ytimg.com/vi/i49aOnV1SXU/maxresdefault.jpg",
    publishedAt: "2026-07-07T19:06:54+00:00",
    viewCount: "27K",
  },
  {
    id: "YpPn_DpFxU4",
    videoId: "YpPn_DpFxU4",
    title: "Their adventure rig has a secret. Can you find it?",
    description: "When Andrea and Jeorg retired in Germany they bought this incredible 2005 MAN expedition truck with a pop-top second story bedroom and a 4 wheeler hanging off the back! They shipped it to North Americ",
    thumbnail: "https://i.ytimg.com/vi/YpPn_DpFxU4/maxresdefault.jpg",
    publishedAt: "2026-07-01T03:18:44+00:00",
    viewCount: "723",
  },
  {
    id: "mOv5pGxmVxE",
    videoId: "mOv5pGxmVxE",
    title: "They Built a Home in a School Bus and Have Some Advice For You",
    description: "Aaron and Sarah and their three kids set out to build a highly capable 4 season worthy school bus conversion and have now lived in their rig, traveling full time for several years.",
    thumbnail: "https://i.ytimg.com/vi/mOv5pGxmVxE/maxresdefault.jpg",
    publishedAt: "2026-06-22T00:29:33+00:00",
    viewCount: "2K",
  },
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
    const searchUrl = `https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&channelId=${CHANNEL_ID}&part=snippet&order=date&type=video&maxResults=${maxResults}`;
    
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
    
    // List of video IDs to exclude
    const excludedVideoIds = [
      'QFJHEmexje0'
    ];
    
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
      const isNotExcluded = !excludedTitles.includes(video.title) && !excludedVideoIds.includes(video.videoId);
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