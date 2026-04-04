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
    title: 'Signature Solar Coupon Code & Best Gear for Skoolies & Overland Rigs | Mobile Dwellings',
    description: 'Exclusive Signature Solar coupon code: SAVE50MD. Save on EG4 inverters, lithium batteries, solar panels, and more. Best gear for skoolies, bus conversions, and overland rigs — tested in real builds.',
    keywords: 'Signature Solar coupon code, Signature Solar discount code, Signature Solar promo code, EG4 coupon code, Signature Solar deals, best inverter for skoolie, best lithium battery for bus conversion, skoolie solar panels, best mini split for skoolie, overland rig solar setup',
    noscript: 'Signature Solar coupon code SAVE50MD — save on EG4 inverters, lithium batteries, solar panels, and more. Tested gear for skoolies, bus conversions, and overland rigs.',
    extraStructuredData: `
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is the Signature Solar coupon code?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Use coupon code SAVE50MD at signaturesolar.com for an exclusive discount on EG4 inverters, lithium batteries, solar panels, and more."
          }
        },
        {
          "@type": "Question",
          "name": "Does Signature Solar offer discount codes?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. Mobile Dwellings has an exclusive Signature Solar coupon code: SAVE50MD. Enter it at checkout on signaturesolar.com to save."
          }
        },
        {
          "@type": "Question",
          "name": "What is the best inverter for a skoolie?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "For most skoolie builds, a 3000W pure sine wave inverter is ideal. The EG4 6000XP from Signature Solar is popular. Use code SAVE50MD at signaturesolar.com to save."
          }
        },
        {
          "@type": "Question",
          "name": "What are the best lithium batteries for a bus conversion?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "LiFePO4 (lithium iron phosphate) batteries are the gold standard for bus conversions and skoolies. They offer longer lifespan, lighter weight, and deeper discharge than AGM."
          }
        }
      ]
    }
    </script>`,
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

    // Write to build/[route]/index.html
    const dir = path.join(BUILD_DIR, page.route);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'index.html'), html, 'utf-8');

    count++;
    console.log(`   ✅ ${page.route} → build${page.route}/index.html`);
  }

  console.log(`\n   📄 Prerendered ${count} pages with unique SEO meta tags`);
}

console.log('🔍 Prerendering SEO meta tags...');
prerender();
