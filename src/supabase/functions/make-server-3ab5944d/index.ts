import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2";
import * as kv from "./kv_store.ts";

const app = new Hono();

// Create Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
);

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
    
    return c.json({ success: true, rig });
  } catch (error) {
    console.error("Error creating rig listing:", error);
    return c.json({ error: "Failed to create rig listing", details: String(error) }, 500);
  }
});

// Update rig status
app.put("/make-server-3ab5944d/rigs/:id/status", async (c) => {
  try {
    const rigId = c.req.param("id");
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
    const rigId = c.req.param("id");
    
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
    
    // If we already have 3 featured, unfeature the oldest
    if (featuredRigs.length >= 3) {
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
    const rigId = c.req.param("id");
    
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
        from: 'Mobile Dwellings <onboarding@resend.dev>',
        to: 'gilliganphantom@gmail.com',
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

Deno.serve(app.fetch);