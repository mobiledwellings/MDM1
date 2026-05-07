import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2";
import * as kv from "./kv_store.ts";

const app = new Hono();

function escapeHtml(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Create Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
);

// Resend "from" — use your verified domain in Resend (same as historically in this repo).
const RESEND_FROM =
  Deno.env.get('RESEND_FROM') ?? 'Mobile Dwellings <notifications@mobiledwellings.media>';

const LISTING_NOTIFY_TO = 'justin@mobiledwellings.media';

/** Max featured rigs allowed (home page shows up to 6 on desktop). */
const MAX_FEATURED_RIGS = 6;

function buildListingNotificationEmailHtml(rig: Record<string, unknown>): string {
  const rigId = String(rig.id ?? "");
  const listingUrl = `https://mobiledwellings.media/rigs/${encodeURIComponent(rigId)}`;
  const highlights = rig.highlights;
  const highlightsList = Array.isArray(highlights) && highlights.length > 0
    ? `<ul>${(highlights as string[]).map((item) =>
      `<li>${escapeHtml(item)}</li>`
    ).join("")}</ul>`
    : "<p>Not provided</p>";
  const galleryImages = rig.galleryImages;
  const galleryLinks = Array.isArray(galleryImages) && galleryImages.length > 0
    ? `<ol>${(galleryImages as string[]).map((img) =>
      `<li><a href="${escapeHtml(img)}">${escapeHtml(img)}</a></li>`
    ).join("")}</ol>`
    : "<p>No gallery images uploaded</p>";
  const payloadJson = escapeHtml(JSON.stringify(rig, null, 2));

  return `
          <h2>New Rig Listing Submitted</h2>
          <p><strong>Listing ID:</strong> ${escapeHtml(rig.id)}</p>
          <p><strong>Created At:</strong> ${escapeHtml(rig.createdAt)}</p>
          <p><strong>Status:</strong> ${escapeHtml(rig.status)}</p>
          <p><strong>Title:</strong> ${escapeHtml(rig.title)}</p>
          <p><strong>Type:</strong> ${escapeHtml(rig.type)}</p>
          <p><strong>Price:</strong> ${escapeHtml(rig.price)}</p>
          <p><strong>Location:</strong> ${escapeHtml(rig.location)}</p>
          <p><strong>Seller Name:</strong> ${escapeHtml(rig.name || "Not provided")}</p>
          <p><strong>External Link:</strong> ${rig.externalLink
    ? `<a href="${escapeHtml(rig.externalLink)}">${escapeHtml(rig.externalLink)}</a>`
    : "Not provided"}</p>
          <p><strong>Length:</strong> ${escapeHtml(rig.length || "Not provided")}</p>
          <p><strong>Mileage:</strong> ${escapeHtml(rig.mileage || "Not provided")}</p>
          <p><strong>YouTube:</strong> ${rig.youtubeVideo
    ? `<a href="https://youtube.com/watch?v=${escapeHtml(rig.youtubeVideo)}">${escapeHtml(rig.youtubeVideo)}</a>`
    : "Not provided"}</p>
          <p><strong>Instagram:</strong> ${escapeHtml(rig.instagram || "Not provided")}</p>
          <h3>Build Description</h3>
          <p>${escapeHtml(rig.buildDescription || "Not provided").replace(/\n/g, "<br/>")}</p>
          <h3>Story</h3>
          <p>${escapeHtml(rig.story || "Not provided").replace(/\n/g, "<br/>")}</p>
          <h3>Highlights</h3>
          ${highlightsList}
          <h3>Gallery Images (${Array.isArray(galleryImages) ? galleryImages.length : 0})</h3>
          ${galleryLinks}
          <h3>Listing URL</h3>
          <p><a href="${listingUrl}">${listingUrl}</a></p>
          <h3>Raw Listing JSON</h3>
          <pre>${payloadJson}</pre>
        `;
}

async function sendListingNotificationEmail(
  rig: Record<string, unknown>,
  subject: string,
): Promise<{ ok: boolean; result: unknown }> {
  const resendApiKey = Deno.env.get("RESEND_API_KEY");
  if (!resendApiKey) {
    return { ok: false, result: null };
  }
  const emailHtml = buildListingNotificationEmailHtml(rig);
  const emailResponse = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: RESEND_FROM,
      to: LISTING_NOTIFY_TO,
      subject,
      html: emailHtml,
    }),
  });
  const emailResult = await emailResponse.json().catch(() => null);
  if (!emailResponse.ok) {
    console.error("Failed to send listing email notification:", emailResult);
    return { ok: false, result: emailResult };
  }
  console.log("Listing email notification sent:", emailResult);
  return { ok: true, result: emailResult };
}

// Initialize storage bucket on startup
const BUCKET_NAME = 'make-3ab5944d-rig-images';
(async () => {
  const { data: buckets } = await supabase.storage.listBuckets();
  const bucketExists = buckets?.some(bucket => bucket.name === BUCKET_NAME);
  if (!bucketExists) {
    await supabase.storage.createBucket(BUCKET_NAME, { public: false });
    console.log('Created storage bucket:', BUCKET_NAME);
  }
})();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-3ab5944d/health", (c) => {
  return c.json({ status: "ok" });
});

// Verify admin password
app.post("/make-server-3ab5944d/verify-admin", async (c) => {
  try {
    const { password } = await c.req.json();
    const adminPassword = Deno.env.get('ADMIN_PASSWORD');
    
    console.log('Password verification attempt');
    console.log('Admin password configured:', !!adminPassword);
    console.log('Admin password length:', adminPassword?.length || 0);
    console.log('Received password length:', password?.length || 0);
    
    if (!adminPassword) {
      console.error('ADMIN_PASSWORD environment variable not set');
      return c.json({ success: false, error: 'Admin password not configured' }, 500);
    }
    
    if (password === adminPassword) {
      console.log('Password match - access granted');
      return c.json({ success: true });
    } else {
      console.log('Password mismatch - access denied');
      return c.json({ success: false });
    }
  } catch (error) {
    console.error('Error verifying admin password:', error);
    return c.json({ success: false, error: 'Failed to verify password' }, 500);
  }
});

// Get all rigs
app.get("/make-server-3ab5944d/rigs", async (c) => {
  try {
    const rigs = await kv.getByPrefix("rig:");
    return c.json({ rigs: rigs || [] });
  } catch (error) {
    console.error("Error fetching rigs:", error);
    return c.json({ error: "Failed to fetch rigs", details: String(error) }, 500);
  }
});

// Create a new rig listing
app.post("/make-server-3ab5944d/rigs", async (c) => {
  try {
    const rigData = await c.req.json();
    const rigId = `rig:${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    console.log('Received rig data, processing images...');
    console.log('Number of images to process:', rigData.galleryImages?.length || 0);
    
    // Upload images to storage and get URLs
    const imageUrls: string[] = [];
    if (rigData.galleryImages && Array.isArray(rigData.galleryImages)) {
      // Process images in batches of 3 to reduce memory usage
      const batchSize = 3;
      for (let batchStart = 0; batchStart < rigData.galleryImages.length; batchStart += batchSize) {
        const batch = rigData.galleryImages.slice(batchStart, batchStart + batchSize);
        
        for (let i = 0; i < batch.length; i++) {
          const actualIndex = batchStart + i;
          const base64Image = batch[i];
          
          try {
            // Extract base64 data
            const matches = base64Image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
            if (!matches || matches.length !== 3) {
              console.error('Invalid base64 image format at index', actualIndex);
              continue;
            }
            
            const mimeType = matches[1];
            const base64Data = matches[2];
            
            // Convert base64 to buffer in smaller chunks to reduce memory
            const imageBuffer = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
            
            // Generate unique filename
            const fileName = `${rigId.replace('rig:', '')}/image-${actualIndex}.jpg`;
            
            console.log(`Uploading image ${actualIndex + 1}/${rigData.galleryImages.length}...`);
            
            // Upload to Supabase Storage
            const { data, error } = await supabase.storage
              .from(BUCKET_NAME)
              .upload(fileName, imageBuffer, {
                contentType: 'image/jpeg',
                upsert: false,
              });
            
            if (error) {
              console.error('Error uploading image:', error);
              continue;
            }
            
            // Get signed URL (valid for 10 years)
            const { data: signedUrlData } = await supabase.storage
              .from(BUCKET_NAME)
              .createSignedUrl(fileName, 315360000); // 10 years in seconds
            
            if (signedUrlData?.signedUrl) {
              imageUrls.push(signedUrlData.signedUrl);
              console.log(`Successfully uploaded image ${actualIndex + 1}`);
            }
          } catch (imageError) {
            console.error(`Error processing image ${actualIndex}:`, imageError);
          }
        }
        
        // Small delay between batches to allow garbage collection
        if (batchStart + batchSize < rigData.galleryImages.length) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }
    }
    
    console.log(`Successfully uploaded ${imageUrls.length} images to storage`);
    
    // Create rig object with image URLs instead of base64
    const rig = {
      id: rigId,
      title: rigData.title,
      type: rigData.type,
      price: rigData.price,
      location: rigData.location,
      externalLink: rigData.externalLink,
      name: rigData.name,
      mileage: rigData.mileage,
      length: rigData.length,
      buildDescription: rigData.buildDescription,
      story: rigData.story,
      youtubeVideo: rigData.youtubeVideo,
      instagram: rigData.instagram,
      highlights: rigData.highlights,
      galleryImages: imageUrls,
      thumbnail: imageUrls[0],
      createdAt: new Date().toISOString(),
      status: rigData.status || 'available',
      featured: false,
    };
    
    await kv.set(rigId, rig);
    
    console.log('Rig listing created successfully:', rigId);
    
    try {
      await sendListingNotificationEmail(
        rig as Record<string, unknown>,
        `🚐 New Listing Submitted: ${rig.title}`,
      );
    } catch (emailError) {
      console.error('Failed to send email notification:', emailError);
    }
    
    return c.json({ success: true, rig });
  } catch (error) {
    console.error("Error creating rig listing:", error);
    return c.json({ error: "Failed to create rig listing", details: String(error) }, 500);
  }
});

// Upload new gallery images for an existing listing (base64 JPEG data URLs → signed URLs).
// Client merges urls into listing and saves via /rigs/update.
app.post("/make-server-3ab5944d/rigs/append-gallery-images", async (c) => {
  try {
    const { rigId, newImagesBase64 } = await c.req.json() as {
      rigId?: string;
      newImagesBase64?: string[];
    };
    if (!rigId || typeof rigId !== "string") {
      return c.json({ error: "rigId required" }, 400);
    }
    if (!Array.isArray(newImagesBase64) || newImagesBase64.length === 0) {
      return c.json({ error: "newImagesBase64 must be a non-empty array" }, 400);
    }
    const rig = await kv.get(rigId);
    if (!rig) {
      return c.json({ error: "Rig not found" }, 404);
    }

    /** Per-request batch cap; frontend enforces 20 photos total per listing before save */
    const maxAppendBatch = 20;
    if (newImagesBase64.length > maxAppendBatch) {
      return c.json({ error: `At most ${maxAppendBatch} images per upload` }, 400);
    }

    const folder = rigId.replace(/^rig:/, "");
    const imageUrls: string[] = [];

    const batchSize = 3;
    for (let batchStart = 0; batchStart < newImagesBase64.length; batchStart += batchSize) {
      const batch = newImagesBase64.slice(batchStart, batchStart + batchSize);
      for (let j = 0; j < batch.length; j++) {
        const i = batchStart + j;
        const base64Image = batch[j];
        try {
          const matches = base64Image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
          if (!matches || matches.length !== 3) {
            console.error("Invalid base64 format for appended image at index", i);
            continue;
          }
          const base64Data = matches[2];
          const imageBuffer = Uint8Array.from(atob(base64Data), (ch) => ch.charCodeAt(0));
          const uniqueSuffix = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
          const fileName = `${folder}/add-${uniqueSuffix}-${i}.jpg`;

          const { error } = await supabase.storage.from(BUCKET_NAME).upload(fileName, imageBuffer, {
            contentType: "image/jpeg",
            upsert: false,
          });
          if (error) {
            console.error("Error uploading appended gallery image:", error);
            continue;
          }
          const { data: signedUrlData } = await supabase.storage
            .from(BUCKET_NAME)
            .createSignedUrl(fileName, 315360000);
          if (signedUrlData?.signedUrl) {
            imageUrls.push(signedUrlData.signedUrl);
          }
        } catch (e) {
          console.error(`Error processing appended image ${i}:`, e);
        }
      }
      if (batchStart + batchSize < newImagesBase64.length) {
        await new Promise((r) => setTimeout(r, 100));
      }
    }

    return c.json({ success: true, urls: imageUrls });
  } catch (error) {
    console.error("Error appending gallery images:", error);
    return c.json({ error: "Failed to append gallery images", details: String(error) }, 500);
  }
});

// Admin: send full listing-detail emails again for existing rigs (requires ADMIN_PASSWORD).
// Body: { password: string, rigIds?: string[] } — omit rigIds to notify for every stored listing.
app.post("/make-server-3ab5944d/rigs/resend-notification-emails", async (c) => {
  try {
    const { password, rigIds } = await c.req.json() as {
      password?: string;
      rigIds?: string[];
    };
    const adminPassword = Deno.env.get("ADMIN_PASSWORD");
    if (!adminPassword || password !== adminPassword) {
      return c.json({ success: false, error: "Unauthorized" }, 401);
    }
    if (!Deno.env.get("RESEND_API_KEY")) {
      return c.json({ success: false, error: "RESEND_API_KEY not configured" }, 500);
    }

    const allRigs = (await kv.getByPrefix("rig:")) as Record<string, unknown>[];
    let rigs = allRigs || [];
    if (Array.isArray(rigIds) && rigIds.length > 0) {
      const want = new Set(rigIds);
      rigs = rigs.filter((r) => typeof r.id === "string" && want.has(r.id));
    }

    const results: { id: string; ok: boolean; detail?: unknown }[] = [];
    for (let i = 0; i < rigs.length; i++) {
      const rig = rigs[i];
      const id = String(rig.id ?? "");
      const title = String(rig.title ?? "Untitled");
      const { ok, result } = await sendListingNotificationEmail(
        rig,
        `🚐 [Resent] Listing: ${title}`,
      );
      results.push({ id, ok, detail: ok ? undefined : result });
      if (i < rigs.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 600));
      }
    }

    const sent = results.filter((r) => r.ok).length;
    return c.json({
      success: true,
      total: rigs.length,
      sent,
      failed: results.length - sent,
      results,
    });
  } catch (error) {
    console.error("Error resending listing notification emails:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Update rig listing (full update) - OLD PUT method (deprecated)
app.put("/make-server-3ab5944d/rigs/:id", async (c) => {
  try {
    const rigId = decodeURIComponent(c.req.param("id"));
    const updates = await c.req.json();
    
    const existingRig = await kv.get(rigId);
    if (!existingRig) {
      return c.json({ error: "Rig not found" }, 404);
    }
    
    // Merge existing rig with updates, preserving id
    const updatedRig = { 
      ...existingRig, 
      ...updates,
      id: rigId // Ensure id is preserved
    };
    
    await kv.set(rigId, updatedRig);
    
    console.log('Rig listing updated successfully:', rigId);
    
    return c.json({ success: true, rig: updatedRig });
  } catch (error) {
    console.error("Error updating rig listing:", error);
    return c.json({ error: "Failed to update rig listing", details: String(error) }, 500);
  }
});

// Update rig listing (POST-based to avoid URL routing issues with colons)
app.post("/make-server-3ab5944d/rigs/update", async (c) => {
  try {
    const { rigId, updates } = await c.req.json();
    
    const existingRig = await kv.get(rigId);
    if (!existingRig) {
      return c.json({ error: "Rig not found" }, 404);
    }
    
    // Merge existing rig with updates, preserving id
    const updatedRig = { 
      ...existingRig, 
      ...updates,
      id: rigId // Ensure id is preserved
    };
    
    await kv.set(rigId, updatedRig);
    
    console.log('Rig listing updated successfully:', rigId);
    
    return c.json({ success: true, rig: updatedRig });
  } catch (error) {
    console.error("Error updating rig listing:", error);
    return c.json({ error: "Failed to update rig listing", details: String(error) }, 500);
  }
});

// Update rig status (POST-based)
app.post("/make-server-3ab5944d/rigs/update-status", async (c) => {
  try {
    const { rigId, status } = await c.req.json();
    
    const rig = await kv.get(rigId);
    if (!rig) {
      return c.json({ error: "Rig not found" }, 404);
    }
    
    const updatedRig = { ...rig, status };
    await kv.set(rigId, updatedRig);
    
    console.log('Rig status updated successfully:', rigId, status);
    
    return c.json({ success: true, rig: updatedRig });
  } catch (error) {
    console.error("Error updating rig status:", error);
    return c.json({ error: "Failed to update rig status", details: String(error) }, 500);
  }
});

// Toggle featured status (POST-based)
app.post("/make-server-3ab5944d/rigs/toggle-featured", async (c) => {
  try {
    const { rigId } = await c.req.json();
    
    const rig = await kv.get(rigId);
    if (!rig) {
      return c.json({ error: "Rig not found" }, 404);
    }
    
    // If rig is already featured, unfeature it
    if (rig.featured) {
      const updatedRig = { ...rig, featured: false, featuredOrder: undefined };
      await kv.set(rigId, updatedRig);
      return c.json({ success: true, rig: updatedRig });
    }
    
    // Get all rigs to check featured count
    const allRigs = await kv.getByPrefix("rig:");
    const featuredRigs = allRigs
      .filter((r: any) => r.featured)
      .sort((a: any, b: any) => (a.featuredOrder || 0) - (b.featuredOrder || 0));
    
    // If we already have MAX_FEATURED_RIGS featured, unfeature the oldest
    if (featuredRigs.length >= MAX_FEATURED_RIGS) {
      const oldestFeatured = featuredRigs[0];
      await kv.set(oldestFeatured.id, { 
        ...oldestFeatured, 
        featured: false, 
        featuredOrder: undefined 
      });
    }
    
    // Feature the new rig
    const updatedRig = { 
      ...rig, 
      featured: true, 
      featuredOrder: Date.now() 
    };
    await kv.set(rigId, updatedRig);
    
    console.log('Rig featured status toggled:', rigId);
    
    return c.json({ success: true, rig: updatedRig });
  } catch (error) {
    console.error("Error toggling featured status:", error);
    return c.json({ error: "Failed to toggle featured status", details: String(error) }, 500);
  }
});

// Delete a rig listing (POST-based)
app.post("/make-server-3ab5944d/rigs/delete", async (c) => {
  try {
    const { rigId } = await c.req.json();
    
    const rig = await kv.get(rigId);
    if (!rig) {
      return c.json({ error: "Rig not found" }, 404);
    }
    
    await kv.del(rigId);
    
    console.log('Rig deleted successfully:', rigId);
    
    return c.json({ success: true });
  } catch (error) {
    console.error("Error deleting rig listing:", error);
    return c.json({ error: "Failed to delete rig listing", details: String(error) }, 500);
  }
});

// Update rig status - OLD PUT method (deprecated)
app.put("/make-server-3ab5944d/rigs/:id/status", async (c) => {
  try {
    const rigId = decodeURIComponent(c.req.param("id"));
    const { status } = await c.req.json();
    
    const rig = await kv.get(rigId);
    if (!rig) {
      return c.json({ error: "Rig not found" }, 404);
    }
    
    const updatedRig = { ...rig, status };
    await kv.set(rigId, updatedRig);
    
    return c.json({ success: true, rig: updatedRig });
  } catch (error) {
    console.error("Error updating rig status:", error);
    return c.json({ error: "Failed to update rig status", details: String(error) }, 500);
  }
});

// Toggle featured status
app.put("/make-server-3ab5944d/rigs/:id/featured", async (c) => {
  try {
    const rigId = decodeURIComponent(c.req.param("id"));
    
    const rig = await kv.get(rigId);
    if (!rig) {
      return c.json({ error: "Rig not found" }, 404);
    }
    
    // If rig is already featured, unfeature it
    if (rig.featured) {
      const updatedRig = { ...rig, featured: false, featuredOrder: undefined };
      await kv.set(rigId, updatedRig);
      return c.json({ success: true, rig: updatedRig });
    }
    
    // Get all rigs to check featured count
    const allRigs = await kv.getByPrefix("rig:");
    const featuredRigs = allRigs
      .filter((r: any) => r.featured)
      .sort((a: any, b: any) => (a.featuredOrder || 0) - (b.featuredOrder || 0));
    
    // If we already have MAX_FEATURED_RIGS featured, unfeature the oldest
    if (featuredRigs.length >= MAX_FEATURED_RIGS) {
      const oldestFeatured = featuredRigs[0];
      await kv.set(oldestFeatured.id, { 
        ...oldestFeatured, 
        featured: false, 
        featuredOrder: undefined 
      });
    }
    
    // Feature the new rig
    const updatedRig = { 
      ...rig, 
      featured: true, 
      featuredOrder: Date.now() 
    };
    await kv.set(rigId, updatedRig);
    
    return c.json({ success: true, rig: updatedRig });
  } catch (error) {
    console.error("Error toggling featured status:", error);
    return c.json({ error: "Failed to toggle featured status", details: String(error) }, 500);
  }
});

// Delete a rig listing
app.delete("/make-server-3ab5944d/rigs/:id", async (c) => {
  try {
    const rigId = decodeURIComponent(c.req.param("id"));
    
    const rig = await kv.get(rigId);
    if (!rig) {
      return c.json({ error: "Rig not found" }, 404);
    }
    
    await kv.del(rigId);
    
    return c.json({ success: true });
  } catch (error) {
    console.error("Error deleting rig listing:", error);
    return c.json({ error: "Failed to delete rig listing", details: String(error) }, 500);
  }
});

// Feature submission endpoint
app.post("/make-server-3ab5944d/feature-submission", async (c) => {
  try {
    const body = await c.req.json();
    console.log('Received feature submission:', body);
    
    const { name, email, location, dwellingType, story, socials, exteriorImage, interiorImage } = body;
    
    // Helper function to compress and upload image
    const uploadImage = async (base64Image: string, imageName: string) => {
      if (!base64Image) return null;
      
      try {
        // Remove data URL prefix
        const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, '');
        const imageBuffer = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
        
        const fileName = `feature-submissions/${Date.now()}-${imageName}.jpg`;
        
        const { data, error } = await supabase.storage
          .from(BUCKET_NAME)
          .upload(fileName, imageBuffer, {
            contentType: 'image/jpeg',
            upsert: false
          });
        
        if (error) {
          console.error('Error uploading image:', error);
          return null;
        }
        
        // Get signed URL
        const { data: signedUrlData } = await supabase.storage
          .from(BUCKET_NAME)
          .createSignedUrl(fileName, 60 * 60 * 24 * 365); // 1 year
        
        return signedUrlData?.signedUrl || null;
      } catch (error) {
        console.error('Error processing image:', error);
        return null;
      }
    };
    
    // Upload images
    const exteriorUrl = await uploadImage(exteriorImage, 'exterior');
    const interiorUrl = await uploadImage(interiorImage, 'interior');
    
    // Send email using Resend
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    
    if (!resendApiKey) {
      console.error('RESEND_API_KEY not found');
      return c.json({ error: 'Email service not configured' }, 500);
    }
    
    // Format email HTML
    const emailHtml = `
      <h2>New Feature Submission from Mobile Dwellings</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Location/Destination:</strong> ${location}</p>
      <p><strong>Dwelling Type:</strong> ${dwellingType}</p>
      <p><strong>Socials:</strong> ${socials || 'Not provided'}</p>
      <p><strong>Story:</strong></p>
      <p>${story.replace(/\n/g, '<br>')}</p>
      ${exteriorUrl ? `<p><strong>Exterior Photo:</strong><br><img src="${exteriorUrl}" style="max-width: 500px; height: auto;"></p>` : ''}
      ${interiorUrl ? `<p><strong>Interior Photo:</strong><br><img src="${interiorUrl}" style="max-width: 500px; height: auto;"></p>` : ''}
    `;
    
    // Send email with Resend
    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: RESEND_FROM,
        to: 'justin@mobiledwellings.media',
        reply_to: email,
        subject: `New Feature Submission - ${dwellingType} from ${name}`,
        html: emailHtml
      })
    });
    
    const emailResult = await emailResponse.json();
    
    console.log('Resend API response status:', emailResponse.status);
    console.log('Resend API response:', emailResult);
    
    if (!emailResponse.ok) {
      console.error('Error sending email:', emailResult);
      return c.json({ error: 'Failed to send email', details: emailResult }, 500);
    }
    
    console.log('Email sent successfully:', emailResult);
    
    return c.json({ success: true, message: 'Submission received and email sent' });
  } catch (error) {
    console.error('Error processing feature submission:', error);
    return c.json({ error: 'Failed to process submission', details: String(error) }, 500);
  }
});

// Deals image upload endpoint
app.post("/make-server-3ab5944d/deals/upload-image", async (c) => {
  try {
    const body = await c.req.json();
    const { base64Image, productId } = body;
    
    if (!base64Image) {
      return c.json({ error: 'No image provided' }, 400);
    }
    
    // Remove data URL prefix
    const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, '');
    const imageBuffer = Uint8Array.from(atob(base64Data), ch => ch.charCodeAt(0));
    
    const fileName = `deals/${productId || Date.now()}-${Date.now()}.jpg`;
    
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, imageBuffer, {
        contentType: 'image/jpeg',
        upsert: true
      });
    
    if (error) {
      console.error('Error uploading deals image:', error);
      return c.json({ error: 'Failed to upload image', details: String(error) }, 500);
    }
    
    // Get signed URL (1 year expiry)
    const { data: signedUrlData } = await supabase.storage
      .from(BUCKET_NAME)
      .createSignedUrl(fileName, 60 * 60 * 24 * 365);
    
    return c.json({ 
      success: true, 
      url: signedUrlData?.signedUrl || null,
      path: fileName
    });
  } catch (error) {
    console.error('Error processing deals image upload:', error);
    return c.json({ error: 'Failed to process image upload', details: String(error) }, 500);
  }
});

// Get all deals products
app.get("/make-server-3ab5944d/deals", async (c) => {
  try {
    const products = await kv.getByPrefix("deal:");
    return c.json(products || []);
  } catch (error) {
    console.error('Error fetching deals:', error);
    return c.json({ error: 'Failed to fetch deals', details: String(error) }, 500);
  }
});

// Save a deal product
app.post("/make-server-3ab5944d/deals", async (c) => {
  try {
    const product = await c.req.json();
    const productId = product.id || `deal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const productWithId = { ...product, id: productId };
    
    await kv.set(`deal:${productId}`, productWithId);
    
    return c.json({ success: true, product: productWithId });
  } catch (error) {
    console.error('Error saving deal:', error);
    return c.json({ error: 'Failed to save deal', details: String(error) }, 500);
  }
});

// Update a deal product
app.put("/make-server-3ab5944d/deals/:id", async (c) => {
  try {
    const productId = c.req.param("id");
    const updates = await c.req.json();
    
    const existing = await kv.get(`deal:${productId}`);
    if (!existing) {
      return c.json({ error: 'Deal not found' }, 404);
    }
    
    const updated = { ...existing, ...updates };
    await kv.set(`deal:${productId}`, updated);
    
    return c.json({ success: true, product: updated });
  } catch (error) {
    console.error('Error updating deal:', error);
    return c.json({ error: 'Failed to update deal', details: String(error) }, 500);
  }
});

// Delete a deal product
app.delete("/make-server-3ab5944d/deals/:id", async (c) => {
  try {
    const productId = c.req.param("id");
    await kv.del(`deal:${productId}`);
    return c.json({ success: true });
  } catch (error) {
    console.error('Error deleting deal:', error);
    return c.json({ error: 'Failed to delete deal', details: String(error) }, 500);
  }
});

// =============================================
// LEAD FINDER ENDPOINTS
// =============================================

// Get all leads
app.get("/make-server-3ab5944d/leads", async (c) => {
  try {
    const leads = await kv.getByPrefix("lead:");
    return c.json({ leads: leads || [] });
  } catch (error) {
    console.error("Error fetching leads:", error);
    return c.json({ error: "Failed to fetch leads", details: String(error) }, 500);
  }
});

// Create a lead
app.post("/make-server-3ab5944d/leads", async (c) => {
  try {
    const leadData = await c.req.json();
    const leadId = `lead:${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const lead = {
      ...leadData,
      id: leadId,
      discoveredAt: leadData.discoveredAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await kv.set(leadId, lead);
    return c.json({ success: true, lead });
  } catch (error) {
    console.error("Error creating lead:", error);
    return c.json({ error: "Failed to create lead", details: String(error) }, 500);
  }
});

// Update a lead
app.post("/make-server-3ab5944d/leads/update", async (c) => {
  try {
    const { leadId, updates } = await c.req.json();
    const existing = await kv.get(leadId);
    if (!existing) {
      return c.json({ error: "Lead not found" }, 404);
    }
    const updated = { ...existing, ...updates, id: leadId };
    await kv.set(leadId, updated);
    return c.json({ success: true, lead: updated });
  } catch (error) {
    console.error("Error updating lead:", error);
    return c.json({ error: "Failed to update lead", details: String(error) }, 500);
  }
});

// Delete a lead
app.post("/make-server-3ab5944d/leads/delete", async (c) => {
  try {
    const { leadId } = await c.req.json();
    await kv.del(leadId);
    return c.json({ success: true });
  } catch (error) {
    console.error("Error deleting lead:", error);
    return c.json({ error: "Failed to delete lead", details: String(error) }, 500);
  }
});

// Helper: fetch Reddit posts
async function searchReddit(keywords: string[]): Promise<any[]> {
  const results: any[] = [];
  // Search across relevant subreddits
  const subreddits = [
    'skoolies', 'vandwellers', 'vanlife', 'GoRVing', 'rvliving',
    'TinyHouses', 'BusConversions', 'overlanding', 'CamperVans',
    'fulltimerving', 'digitalnomad', 'liveinacar'
  ];

  for (const keyword of keywords.slice(0, 5)) {
    try {
      // Reddit JSON API (no auth needed for public search)
      const url = `https://www.reddit.com/search.json?q=${encodeURIComponent(keyword)}&sort=new&limit=10&t=week`;
      const res = await fetch(url, {
        headers: { 'User-Agent': 'MobileDwellingsLeadFinder/1.0' },
      });
      if (!res.ok) continue;
      const data = await res.json();
      const posts = data?.data?.children || [];

      for (const post of posts) {
        const d = post.data;
        if (!d || d.over_18) continue;
        results.push({
          platform: 'reddit',
          title: d.title || '',
          url: `https://reddit.com${d.permalink}`,
          author: d.author || 'unknown',
          content: (d.selftext || '').slice(0, 1000),
          subreddit: d.subreddit,
          upvotes: d.ups || 0,
          comments: d.num_comments || 0,
        });
      }
    } catch (e) {
      console.error(`Reddit search error for "${keyword}":`, e);
    }
  }

  // Deduplicate by URL
  const seen = new Set<string>();
  return results.filter(r => {
    if (seen.has(r.url)) return false;
    seen.add(r.url);
    return true;
  });
}

// Helper: fetch YouTube videos
async function searchYouTube(keywords: string[]): Promise<any[]> {
  const apiKey = Deno.env.get('YOUTUBE_API_KEY');
  if (!apiKey) {
    console.error('YOUTUBE_API_KEY not set');
    return [];
  }

  const results: any[] = [];
  for (const keyword of keywords.slice(0, 5)) {
    try {
      const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(keyword)}&type=video&order=date&maxResults=10&publishedAfter=${new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()}&key=${apiKey}`;
      const res = await fetch(url);
      if (!res.ok) continue;
      const data = await res.json();

      for (const item of data.items || []) {
        results.push({
          platform: 'youtube',
          title: item.snippet?.title || '',
          url: `https://youtube.com/watch?v=${item.id?.videoId}`,
          author: item.snippet?.channelTitle || 'unknown',
          content: item.snippet?.description || '',
          channelId: item.snippet?.channelId,
          thumbnail: item.snippet?.thumbnails?.medium?.url,
        });
      }
    } catch (e) {
      console.error(`YouTube search error for "${keyword}":`, e);
    }
  }

  const seen = new Set<string>();
  return results.filter(r => {
    if (seen.has(r.url)) return false;
    seen.add(r.url);
    return true;
  });
}

// Helper: score a lead using heuristics (no AI key required)
function scoreLead(raw: any): number {
  let score = 5; // baseline

  const text = `${raw.title} ${raw.content}`.toLowerCase();

  // High-value signals
  const highSignals = ['just finished', 'build complete', 'tour', 'walk through', 'full time', 'living in', 'converted', 'for sale', 'renovation complete'];
  for (const sig of highSignals) {
    if (text.includes(sig)) { score += 1; break; }
  }

  // Content about specific builds
  const buildTypes = ['skoolie', 'bus conversion', 'van build', 'shuttle bus', 'school bus', 'sprinter', 'transit', 'box truck', 'ambulance', 'tiny house'];
  for (const bt of buildTypes) {
    if (text.includes(bt)) { score += 1; break; }
  }

  // Has images or video (longer content usually means more detail)
  if (raw.content && raw.content.length > 300) score += 1;

  // Reddit engagement signals
  if (raw.upvotes && raw.upvotes > 50) score += 1;
  if (raw.comments && raw.comments > 10) score += 1;

  // Penalty for low-effort
  if (text.length < 50) score -= 2;

  // Clamp
  return Math.min(10, Math.max(1, score));
}

// Scan endpoint
app.post("/make-server-3ab5944d/leads/scan", async (c) => {
  try {
    const { platform, keywords } = await c.req.json();

    if (!keywords || !keywords.length) {
      return c.json({ error: "Keywords are required" }, 400);
    }

    let rawResults: any[] = [];

    if (platform === 'reddit') {
      rawResults = await searchReddit(keywords);
    } else if (platform === 'youtube') {
      rawResults = await searchYouTube(keywords);
    } else {
      return c.json({
        message: `${platform} does not support automated scanning. Use "Add Lead" to add leads from this platform manually.`,
        leads: [],
      });
    }

    if (rawResults.length === 0) {
      return c.json({ message: 'No results found. Try different keywords.', leads: [] });
    }

    // Check existing leads to avoid duplicates
    const existingLeads = await kv.getByPrefix("lead:");
    const existingUrls = new Set(existingLeads.map((l: any) => l.url));

    const newLeads: any[] = [];
    for (const raw of rawResults) {
      if (existingUrls.has(raw.url)) continue;

      const score = scoreLead(raw);
      // Only save leads with a minimum score
      if (score < 3) continue;

      const leadId = `lead:${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const lead = {
        id: leadId,
        platform: raw.platform,
        title: raw.title,
        url: raw.url,
        author: raw.author,
        content: raw.content,
        score,
        status: 'new',
        notes: '',
        tags: keywords.filter((k: string) =>
          `${raw.title} ${raw.content}`.toLowerCase().includes(k.toLowerCase())
        ).slice(0, 5),
        discoveredAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await kv.set(leadId, lead);
      newLeads.push(lead);

      // Small delay to avoid KV write contention
      await new Promise(resolve => setTimeout(resolve, 50));
    }

    console.log(`Scan complete: ${rawResults.length} raw results, ${newLeads.length} new leads saved`);

    return c.json({
      message: `Found ${newLeads.length} new leads from ${platform}`,
      leads: newLeads,
      totalScanned: rawResults.length,
      duplicatesSkipped: rawResults.length - newLeads.length,
    });
  } catch (error) {
    console.error("Error scanning for leads:", error);
    return c.json({ error: "Failed to scan for leads", details: String(error) }, 500);
  }
});

Deno.serve(app.fetch);