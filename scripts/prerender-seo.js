/**
 * Prerender SEO Meta Tags
 * 
 * Creates a separate HTML file for each route with the correct
 * <title>, meta description, OG tags, canonical URL, and structured data
 * pre-baked into the HTML. This way Google's crawler sees the right
 * SEO content immediately without waiting for JavaScript to execute.
 * 
 * Zero external dependencies — just Node.js built-ins.
 * 
 * Run after build: node scripts/prerender-seo.js
 */

const fs = require('fs');
const path = require('path');

const BUILD_DIR = path.resolve(__dirname, '../build');
const SITE_URL = 'https://mobiledwellings.media';

// ---------------------------------------------------------------------------
// Page-specific SEO data
// Keep this in sync with the <SEO> components in your React pages.
// When you update a page's SEO component, update the matching entry here.
// ---------------------------------------------------------------------------
const pages = [
  // Homepage — already has the correct meta from index.html, skip it
  {
    route: '/rigs-for-sale',
    title: 'Skoolies For Sale | Converted Buses, Vans & Tiny Homes | Mobile Dwellings',
    description: 'Browse skoolies, converted school buses, camper vans, and tiny homes for sale. Find your perfect mobile dwelling from verified sellers. New listings added weekly.',
    keywords: 'skoolies for sale, school bus conversion for sale, converted bus for sale, skoolie marketplace, buy skoolie, camper van for sale, van conversion for sale, tiny home on wheels, mobile home for sale, RV for sale, bus conversion, skoolie bus, finished skoolie for sale',
    noscript: 'Browse converted school buses, skoolies, camper vans, overland rigs, and tiny homes for sale on Mobile Dwellings — the skoolie marketplace.',
  },
  {
    route: '/sell-your-rig',
    title: 'Sell Your Rig | List Your Skoolie, Van, or Tiny Home | Mobile Dwellings',
    description: 'Reach thousands of buyers in the mobile dwelling community. List your school bus conversion, camper van, or tiny home on Mobile Dwellings today.',
    keywords: 'sell skoolie, sell bus conversion, sell camper van, list skoolie for sale, sell tiny home, skoolie marketplace seller',
    noscript: 'Sell your skoolie, bus conversion, camper van, or tiny home to thousands of active buyers on Mobile Dwellings.',
  },
  {
    route: '/deals',
    title: 'Signature Solar Coupon Code MD50OFF – Best Gear for Skoolies & Overland Rigs | Mobile Dwellings',
    description: 'Exclusive Signature Solar coupon code: MD50OFF. Save on EG4 inverters, lithium batteries, solar panels, and more. Best gear for skoolies, bus conversions, and overland rigs — tested in real builds.',
    keywords: 'Signature Solar coupon code, Signature Solar discount code, Signature Solar promo code, EG4 coupon code, Signature Solar deals, best inverter for skoolie, best lithium battery for bus conversion, skoolie solar panels, best mini split for skoolie, overland rig solar setup',
    noscript: 'Signature Solar coupon code MD50OFF — save on EG4 inverters, lithium batteries, solar panels, and more. Tested gear for skoolies, bus conversions, and overland rigs.',
    // FAQPage schema is injected at runtime by DealsPage.tsx via
    // dangerouslySetInnerHTML. Don't duplicate it here — Google flags duplicate
    // FAQPage entries on the same URL as a critical issue.
  },
  {
    route: '/skoolie-support',
    title: 'Skoolie Support | Bus Conversion Help & Build Consulting | Mobile Dwellings',
    description: 'Need help with your skoolie build? Get one-on-one consulting from professional and amateur bus conversion builders. Expert advice on electrical, plumbing, layout planning, and mechanical issues.',
    keywords: 'skoolie help, bus conversion help, skoolie builder, school bus conversion advice, skoolie electrical, skoolie plumbing, skoolie layout, bus conversion consulting, DIY skoolie, skoolie build guide',
    noscript: 'Skoolie Support — get one-on-one consulting from professional bus conversion builders. Expert advice on electrical, plumbing, layout, and mechanical issues for your skoolie build.',
    extraStructuredData: `
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "Skoolie Support - Bus Conversion Consulting",
      "description": "Get expert help with your school bus conversion. One-on-one consultations for skoolie electrical systems, layout planning, plumbing, and mechanical issues.",
      "url": "https://mobiledwellings.media/skoolie-support",
      "provider": { "@type": "Organization", "name": "Mobile Dwellings" },
      "serviceType": "Bus Conversion Consulting",
      "areaServed": "US"
    }
    </script>`,
  },
  {
    route: '/signature-solar-coupon',
    title: 'Signature Solar Coupon Code 2026 – MD50OFF Gets $50 Off | Mobile Dwellings',
    description: 'Use coupon code MD50OFF at Signature Solar for $50 off. Re-tested weekly by Justin Smith of Mobile Dwellings, who runs EG4 gear in a 40-foot skoolie. Works on EG4 batteries, inverters, solar panels, charge controllers & more at signaturesolar.com. $500 minimum order.',
    keywords: 'signature solar coupon code, signature solar coupon code 2026, signature solar discount code, MD50OFF, signature solar promo code, EG4 coupon code, signature solar off grid discount, skoolie solar discount, van life solar coupon, mobile dwellings coupon, EG4 battery discount, signature solar deals',
    noscript: 'Mobile Dwellings exclusive Signature Solar coupon code MD50OFF — $50 off at signaturesolar.com, $500 minimum order. Re-tested weekly. Works on EG4 batteries, inverters, solar panels, and more.',
    // The full schema graph (WebPage, Person, Organization, Offer, FAQPage,
    // VideoObject(s), ImageObject(s)) is injected at runtime by
    // SignatureSolarCouponPage.tsx via react-helmet-async. Don't duplicate
    // any of those entities here — Google flags duplicate FAQPage / Offer
    // entries on the same URL as a critical structured-data issue.
  },
  {
    route: '/partners',
    title: 'Our Partners — Brands We Trust | Mobile Dwellings',
    description: 'The brands Mobile Dwellings partners with for skoolie, van, and overland builds — Signature Solar, onX Offroad, and WattCycle. Each offers an exclusive discount.',
    keywords: 'mobile dwellings partners, skoolie gear, van life brands, overland gear, signature solar, onx offroad, wattcycle, skoolie discount codes, off grid gear deals',
    noscript: 'Mobile Dwellings partners — the brands we trust for skoolie, van, and overland builds, each with an exclusive discount code.',
  },
  {
    route: '/partners/onx-offroad',
    title: 'onX Offroad Discount Code JUICEBOX – 20% Off | Mobile Dwellings',
    description: 'Save 20% on onX Offroad with code JUICEBOX. The GPS trail and route-planning app we use for off-road navigation, dispersed camping, and offline maps.',
    keywords: 'onx offroad, onx offroad discount, onx offroad coupon code, offline trail maps, overland gps app, route planning app, boondocking app, public land map, dispersed camping app, van life navigation, onx offroad review',
    noscript: 'onX Offroad — trail maps, route planning, and offline GPS for overlanding and boondocking, with public land and dispersed-camping layers. A Mobile Dwellings partner with an exclusive discount.',
    image: 'https://mobiledwellings.media/onx-mexican-hat-hero.jpg',
    // Full schema graph baked into the static HTML so non-JS crawlers (incl. AI
    // bots) and Google's first pass see it. The runtime react-helmet injection
    // in PartnerPage.tsx was removed to avoid duplicate FAQPage/Offer entries.
    extraStructuredData: `
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebPage",
          "@id": "https://mobiledwellings.media/partners/onx-offroad#webpage",
          "url": "https://mobiledwellings.media/partners/onx-offroad",
          "name": "onX Offroad Discount Code JUICEBOX – 20% Off",
          "description": "Save 20% on onX Offroad with code JUICEBOX. The GPS trail and route-planning app we use for off-road navigation, dispersed camping, and offline maps.",
          "publisher": { "@id": "https://mobiledwellings.media/#organization" }
        },
        {
          "@type": "Organization",
          "@id": "https://mobiledwellings.media/#organization",
          "name": "Mobile Dwellings",
          "url": "https://mobiledwellings.media",
          "logo": "https://mobiledwellings.media/logo.png"
        },
        {
          "@type": "Brand",
          "name": "onX Offroad",
          "description": "Trail maps, route planning & offline GPS for off road adventures."
        },
        {
          "@type": "Offer",
          "name": "onX Offroad discount — code JUICEBOX",
          "description": "20% off any onX Offroad membership — Premium or Elite.",
          "url": "https://www.onxmaps.com/purchase/offroad/membership?promo=juicebox&utm_source=or_ic_partnerships&utm_medium=ambassador&utm_campaign=mobiledwellings",
          "seller": { "@type": "Organization", "name": "onX Offroad" }
        },
        {
          "@type": "FAQPage",
          "@id": "https://mobiledwellings.media/partners/onx-offroad#faq",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "Is there an onX Offroad coupon code?",
              "acceptedAnswer": { "@type": "Answer", "text": "Yes — use code JUICEBOX at checkout for 20% off an onX Offroad membership. When the checkout survey asks how you heard about onX, please reference Mobile Dwellings so we get the credit. We update this page whenever the offer changes." }
            },
            {
              "@type": "Question",
              "name": "What's the difference between onX Offroad Premium and Elite?",
              "acceptedAnswer": { "@type": "Answer", "text": "Premium covers trail maps, difficulty ratings, offline maps, route planning, and dispersed camping — everything most boondockers need. Elite adds private property boundaries, landowner info, and partner discounts. Your JUICEBOX code takes 20% off either tier; check onX for current pricing." }
            },
            {
              "@type": "Question",
              "name": "Is onX Offroad worth it for Bus Conversions and Skoolies?",
              "acceptedAnswer": { "@type": "Answer", "text": "For just $28 per year with our 20% discount it's absolutely worth it to have a navigation app that will help you find off road adventures and to provide route planning and navigation outside of cell service." }
            }
          ]
        },
        {
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://mobiledwellings.media" },
            { "@type": "ListItem", "position": 2, "name": "Partners", "item": "https://mobiledwellings.media/partners" },
            { "@type": "ListItem", "position": 3, "name": "onX Offroad", "item": "https://mobiledwellings.media/partners/onx-offroad" }
          ]
        }
      ]
    }
    </script>`,
  },
  {
    route: '/about',
    title: 'About | Skoolie & Van Life Documentary Series | Mobile Dwellings',
    description: 'Mobile Dwellings is a documentary video series featuring converted school buses, overland rigs, van conversions, tiny homes, and liveaboard sailboats. Meet the people behind the builds.',
    keywords: 'mobile dwellings, skoolie documentary, van life videos, bus conversion tours, overland rig tours, tiny home videos, alternative living, mobile living stories',
    noscript: 'Mobile Dwellings is a documentary video series exploring alternative ways of living through skoolies, bus conversions, overland rigs, van conversions, tiny homes, and liveaboard sailboats.',
  },
];

// ---------------------------------------------------------------------------
// Build
// ---------------------------------------------------------------------------
function prerender() {
  const template = fs.readFileSync(path.join(BUILD_DIR, 'index.html'), 'utf-8');
  let count = 0;

  for (const page of pages) {
    let html = template;
    const fullUrl = `${SITE_URL}${page.route}`;

    // Replace <title>
    html = html.replace(
      /<title>.*?<\/title>/,
      `<title>${page.title}</title>`
    );

    // Replace meta name="title"
    html = html.replace(
      /<meta name="title" content=".*?" \/>/,
      `<meta name="title" content="${page.title}" />`
    );

    // Replace meta description
    html = html.replace(
      /<meta name="description" content=".*?" \/>/,
      `<meta name="description" content="${page.description}" />`
    );

    // Replace meta keywords (inject if missing)
    if (html.includes('<meta name="keywords"')) {
      html = html.replace(
        /<meta name="keywords" content=".*?" \/>/,
        `<meta name="keywords" content="${page.keywords}" />`
      );
    } else {
      html = html.replace(
        /<meta name="description"/,
        `<meta name="keywords" content="${page.keywords}" />\n    <meta name="description"`
      );
    }

    // Replace OG tags
    html = html.replace(
      /<meta property="og:url" content=".*?" \/>/,
      `<meta property="og:url" content="${fullUrl}" />`
    );
    html = html.replace(
      /<meta property="og:title" content=".*?" \/>/,
      `<meta property="og:title" content="${page.title}" />`
    );
    html = html.replace(
      /<meta property="og:description" content=".*?" \/>/,
      `<meta property="og:description" content="${page.description}" />`
    );

    // Replace Twitter tags
    html = html.replace(
      /<meta property="twitter:url" content=".*?" \/>/,
      `<meta property="twitter:url" content="${fullUrl}" />`
    );
    html = html.replace(
      /<meta property="twitter:title" content=".*?" \/>/,
      `<meta property="twitter:title" content="${page.title}" />`
    );
    html = html.replace(
      /<meta property="twitter:description" content=".*?" \/>/,
      `<meta property="twitter:description" content="${page.description}" />`
    );

    // Replace OG / Twitter image (only when the page specifies its own)
    if (page.image) {
      html = html.replace(
        /<meta property="og:image" content=".*?" \/>/,
        `<meta property="og:image" content="${page.image}" />`
      );
      html = html.replace(
        /<meta property="twitter:image" content=".*?" \/>/,
        `<meta property="twitter:image" content="${page.image}" />`
      );
    }

    // Replace canonical URL
    html = html.replace(
      /<link rel="canonical" href=".*?" \/>/,
      `<link rel="canonical" href="${fullUrl}" />`
    );

    // Inject page-specific structured data before </head>
    if (page.extraStructuredData) {
      html = html.replace('</head>', `${page.extraStructuredData}\n  </head>`);
    }

    // Replace noscript content
    if (page.noscript) {
      html = html.replace(
        /<noscript>.*?<\/noscript>/,
        `<noscript>${page.noscript}</noscript>`
      );
    }

    // Write to build/[route].html (a flat file, NOT [route]/index.html).
    // Cloudflare Pages serves a flat file at its exact extensionless path
    // (e.g. /partners/onx-offroad) with a 200 and no trailing-slash redirect,
    // so the served URL matches our canonical exactly. The directory form
    // (route/index.html) makes Cloudflare 308-redirect /route -> /route/,
    // which — combined with a no-slash canonical — causes Google to report a
    // "Redirect error" and refuse to index.
    const outPath = path.join(BUILD_DIR, `${page.route}.html`);
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, html, 'utf-8');

    count++;
    console.log(`   ✅ ${page.route} → build${page.route}.html`);
  }

  console.log(`\n   📄 Prerendered ${count} pages with unique SEO meta tags`);
}

console.log('🔍 Prerendering SEO meta tags...');
prerender();
