/**
 * Shared story content.
 *
 * Plain ESM (.mjs) rather than TypeScript because scripts/prerender-seo.js
 * imports it directly in Node at build time to bake each story's real copy
 * into the static HTML — Node can't import .ts. Types live in stories.d.mts.
 *
 * Blocks mirror the structure the draft is edited in, so a story can be
 * revised without touching the renderer. Inline markup is limited on purpose
 * to **bold**, *italic* and [text](url).
 */

export const SITE_URL = "https://mobiledwellings.media";

export const STORIES = [
  {
    "slug": "seven-years-in-a-school-bus",
    "title": "Seven Years in a School Bus: Inside the Rig Driving From Alaska to Argentina",
    "dek": "Cora and José bought a school bus for a one-year trip. Seven years later they're still in it, still heading south, with a recording studio in the back.",
    "hero": "/blog/art-we-there-yet/bus-mural-sierra-nevada.jpg",
    "heroAlt": "A converted school bus painted with an abstract mural of hills and waves, parked in sagebrush below the snow-streaked Sierra Nevada.",
    "category": "Bus Tours",
    "date": "2026-09-09",
    "readingTime": "5 min",
    "photoCredit": "Art We There Yet",
    "keywords": "school bus conversion tour, skoolie build cost, bus conversion solar setup, living in a school bus full time, alaska to argentina bus",
    "blocks": [
      {
        "t": "standfirst",
        "v": "This article is about Cora and José from the legendary YouTube channel: [Art We There Yet](https://www.youtube.com/@ArtWeThereYet). This article was written by an LLM in the style of the extremely talented and entertaining Bill Bryson. It was edited and modified by Justin from Mobile Dwellings."
      },
      {
        "t": "p",
        "v": "The distance from Deadhorse, Alaska to Ushuaia, Argentina is roughly 14,000 miles, and Cora and José have been driving it since 2019. They are currently somewhere far north of the middle. At their present rate they expect to arrive in about ten years, which works out to just under four miles a day. This pace would embarrass a tortoise, and this was supposed to be just a one year trip. Though in fairness the tortoise is not stopping to record an album (spoiler alert this bus has an entire recording studio inside)."
      },
      {
        "t": "hr"
      },
      {
        "t": "h2",
        "v": "The one-year plan"
      },
      {
        "t": "p",
        "v": "The bus is a 2001 [school bus](/rigs-for-sale), bought for $6,500 with gum under the seats and graffiti on the walls, which is the condition in which all school buses are sold and possibly the condition in which they are manufactured. José had wanted to do this since he was in school himself: drive the length of the Americas, in a bus, with friends. The friends, as friends do, said yes enthusiastically and then didn't come. So he met Cora in China and talked her into it instead, which is a considerably more efficient recruitment strategy."
      },
      {
        "t": "img",
        "src": "/blog/art-we-there-yet/cora-and-jose-art-we-there-yet.jpg",
        "alt": "Cora and José stand together in front of the teal nose of their bus, José holding a saxophone and Cora holding an acoustic guitar.",
        "cap": "The instruments are not a prop. There are eleven of them on board."
      },
      {
        "t": "hr"
      },
      {
        "t": "h2",
        "v": "The build took a year, which ended the one-year plan"
      },
      {
        "t": "p",
        "v": "They had no workshop. The bus was the storage space for the tools required to work on the bus, an arrangement that is fine right up until the moment you need to live inside it. [Neither had built anything like it](/skoolie-support), so they used the internet and, as Cora puts it, \"our brains.\""
      },
      {
        "t": "img",
        "src": "/blog/art-we-there-yet/school-bus-conversion-before-and-after.jpg",
        "alt": "A two-panel before and after: below, a plain yellow school bus on grass; above, the same bus painted with a full-length mural, the Houston skyline behind it.",
        "cap": "Same bus, about a year apart."
      },
      {
        "t": "p",
        "v": "The result is the experience every bus converter eventually describes in the same slightly haunted tone: \"We're going to do this one thing today and then you realize that to do that one thing you need to do four things before it, and the first thing is actually going to take a week.\""
      },
      {
        "t": "img",
        "src": "/blog/art-we-there-yet/bus-interior-before-and-after.jpg",
        "alt": "A two-panel before and after of the interior: below, rows of blue vinyl school bus seats; above, the finished living space with couch, kitchen and dinette.",
        "cap": "Forty-four seats out, one house in."
      },
      {
        "t": "p",
        "v": "It took a year, and would have taken three without a rotating cast of family who kept turning up to help. This also quietly killed the original plan. \"When you spend a year building something, the idea of living in it for just one year starts to not really make sense,\" Cora says."
      },
      {
        "t": "p",
        "v": "Seven years later, she's definitely made her point."
      },
      {
        "t": "hr"
      },
      {
        "t": "h2",
        "v": "Nothing went according to plan"
      },
      {
        "t": "p",
        "v": "They hit the road in 2019 and drove north, the idea being to reach Alaska and start the real trip from the top. Winter stopped them. No problem, they would go in summer 2020, a sentence that has aged the way all sentences containing \"summer 2020\" have aged."
      },
      {
        "t": "img",
        "src": "/blog/art-we-there-yet/bus-mural-grand-tetons.jpg",
        "alt": "The bus parked in sagebrush directly below the jagged peaks of the Grand Tetons, its mural echoing the shapes of the range.",
        "cap": ""
      },
      {
        "t": "p",
        "v": "With the border shut, they spent two years ping-ponging around the lower 48. When it opened they were on the East Coast, which is about as far from Alaska as it is possible to be while remaining in the correct country, and they went anyway."
      },
      {
        "t": "p",
        "v": "They planned to stay three to six months. They stayed two years. \"Alaska, hands down, was our favorite,\" Cora says. Then they turned around and started south, which brings us back to the tortoise."
      },
      {
        "t": "hr"
      },
      {
        "t": "h2",
        "v": "The bus itself"
      },
      {
        "t": "p",
        "v": "The mural was designed by their friend Megan Price and changes as you walk around it: farmland one side, cityscape toward the back, a wave down the flank, and the map of the Americas across the rear door. Three northern winters have done a number on the map."
      },
      {
        "t": "img",
        "src": "/blog/art-we-there-yet/bus-rear-map-of-the-americas.jpg",
        "alt": "The rear of the bus, painted with a map of North and South America and the words Art We There Yet, parked on a bluff with the Tetons in the distance.",
        "cap": ""
      },
      {
        "t": "p",
        "v": "On the roof: [a kilowatt of solar](/signature-solar-coupon), an air conditioner, Starlink, one original school bus hatch over the bedroom, and a deck they nearly didn't build because it was extra money and extra work. They now describe it as the best decision they made."
      },
      {
        "t": "img",
        "src": "/blog/art-we-there-yet/rooftop-deck-padre-island.jpg",
        "alt": "Cora and José stand on the rooftop deck of their bus with their arms raised, parked on an empty beach with waves breaking behind them.",
        "cap": "Padre Island, Texas, proving that the deck was worth it,"
      },
      {
        "t": "hr"
      },
      {
        "t": "h2",
        "v": "The argument about the microwave"
      },
      {
        "t": "p",
        "v": "The cabinets were built by one of José's siblings, a professional carpenter who builds kitchens for large houses and who arrived with professional opinions. Chief among them was that the microwave belonged centered above the fridge, because symmetry demands it."
      },
      {
        "t": "img",
        "src": "/blog/art-we-there-yet/jose-cooking-in-bus-kitchen.jpg",
        "alt": "José stands at the gas range in the bus kitchen with a wok in hand, grinning at the camera, a stop sign mounted on the wall behind him.",
        "cap": "José cooks, Cora does the dishes. This has been the arrangement for their entire relationship."
      },
      {
        "t": "p",
        "v": "José, an artist, and now a bus builder pointed out that centering it would waste a strip of wall roughly the width of a microwave, and in a bus space is not a renewable resource. His brother said the alternative would look ugly. José said it would look great. His brother built it, under protest, in the manner of a man being asked to hang a painting crooked."
      },
      {
        "t": "p",
        "v": "Fortunately they are still friends."
      },
      {
        "t": "hr"
      },
      {
        "head": "A note on the power system",
        "paras": [
          "Mobile Dwellings is supported by **Signature Solar**, the Texas-based supplier which is our go to for solar panels, lithium batteries, mini splits, and Victron gear.",
          "Our curated list of the gear worth looking at, plus the current code, is at **[mobiledwellings.media/signature-solar-coupon](https://mobiledwellings.media/signature-solar-coupon)** currently **MD50OFF** for $50 off."
        ],
        "t": "quote"
      },
      {
        "t": "hr"
      },
      {
        "t": "h2",
        "v": "There is a recording studio in the back"
      },
      {
        "t": "p",
        "v": "This is not a figure of speech. The rear of the bus is a soundproofed studio with three-inch walls, a two-inch ceiling, an inch and a half of floor, built as a room within a room. Shut the doors, drop the hatch, throw the locks that cinch it all down, and it gets quiet enough that Cora has recorded entire albums in it, in a vehicle, on the side of the road."
      },
      {
        "t": "img",
        "src": "/blog/art-we-there-yet/recording-studio-from-above.jpg",
        "alt": "Looking straight down into the rear studio: a pine desk with studio monitors and a laptop, a digital piano below it, and a saxophone, mandolin and two guitars leaning against the walls.",
        "cap": "\"It's like three-dimensional Tetris in this room.\""
      },
      {
        "t": "p",
        "v": "Eleven instruments live back here: piano, two guitars, bass, saxophone, clarinet, flute, mandolin, ukulele plus a PA system under the desk."
      },
      {
        "t": "p",
        "v": "It is also the bedroom. The wall folds down into a Murphy bed, and the space beneath that holds stickers and candle-making supplies, because of course it does."
      },
      {
        "t": "img",
        "src": "/blog/art-we-there-yet/murphy-bed-with-instruments.jpg",
        "alt": "Cora and José lying on the Murphy bed folded down in the studio, seen from above, with a guitar case and laptop stowed on the underside of the bed.",
        "cap": ""
      },
      {
        "t": "p",
        "v": "\"It's just like sleeping in a little womb,\" Cora says, and having seen the photographs, I believe her."
      },
      {
        "t": "hr"
      },
      {
        "t": "h2",
        "v": "The loo with a view"
      },
      {
        "t": "p",
        "v": "They relocated one of the bus's original emergency windows so it would sit beside the toilet. This was the correct decision."
      },
      {
        "t": "img",
        "src": "/blog/art-we-there-yet/composting-toilet-teton-window.jpg",
        "alt": "A Nature's Head composting toilet in a bathroom painted in bold blocks of red, teal and orange, with an open window framing the Grand Tetons.",
        "cap": ""
      },
      {
        "t": "hr"
      },
      {
        "t": "h2",
        "v": "What it cost"
      },
      {
        "rows": [
          [
            "**The bus**",
            "~$6,500"
          ],
          [
            "**Full conversion** (including the bus)",
            "~$29,000"
          ],
          [
            "**Spent since 2019**",
            "~$13,500"
          ],
          [
            "**Total, to date**",
            "~$42,500"
          ]
        ],
        "t": "table"
      },
      {
        "t": "p",
        "v": "Neither figure includes [mechanical work](/skoolie-support) such as Engine and drivetrain repair and maintenance."
      },
      {
        "t": "h2",
        "v": "The bus, at a glance"
      },
      {
        "rows": [
          [
            "**Chassis**",
            "2001 dog-nose school bus, tows a Jeep"
          ],
          [
            "**Solar**",
            "10 × 100W panels — 1 kW"
          ],
          [
            "**Fresh water**",
            "Two 40-gallon tanks — 10 to 14 days for two"
          ],
          [
            "**Propane**",
            "~9 gallons"
          ],
          [
            "**Heat / hot water**",
            "Diesel heater, on-demand hot water"
          ],
          [
            "**Bathroom**",
            "Composting toilet, 24\" × 24\" shower"
          ],
          [
            "**Connectivity**",
            "Starlink"
          ]
        ],
        "t": "table"
      },
      {
        "t": "hr"
      },
      {
        "t": "h2",
        "v": "Still heading south"
      },
      {
        "t": "p",
        "v": "Both of them say it turned out easier than expected. Cora had braced for stress and found instead that the American West is largely made of public land. \"A person could live their life traveling from Baja to Alaska and back, and there's not a single mile along that stretch that isn't gorgeous.\""
      },
      {
        "t": "p",
        "v": "José, who had previously backpacked seventeen countries carrying a saxophone, and everything else he owned, had a simpler basis for comparison. He expected the bus to be easier than that. It is."
      },
      {
        "t": "p",
        "v": "His advice to his younger self is almost entirely about temperament: be patient, be kinder to the people helping you, accept that you will do some things twice. He would also vent the range hood outside instead of recirculating it. Seven years of cooking will teach you that."
      },
      {
        "t": "img",
        "src": "/blog/art-we-there-yet/baja-highway-heading-south.jpg",
        "alt": "The bus coming down a two-lane highway toward the camera, a turquoise bay and a moored sailboat behind it in Baja California.",
        "cap": ""
      },
      {
        "t": "p",
        "v": "Ushuaia is still 7,000 miles away, but there is no particular hurry."
      },
      {
        "t": "hr"
      },
      {
        "t": "note",
        "v": "Follow Cora and José's drive to Argentina on their YouTube channel, **[Art We There Yet](https://www.youtube.com/@ArtWeThereYet)**. All photographs courtesy of [Art We There Yet](https://www.instagram.com/art_we_there_yet/)."
      },
      {
        "t": "hr"
      }
    ]
  }
];

export const getStory = (slug) => STORIES.find((s) => s.slug === slug);

// --- static HTML rendering (build-time only) -------------------------------
// Mirrors StoryArticle.tsx so crawlers that never run JavaScript receive the
// article's real text. The client mounts with createRoot().render(), which
// replaces #root wholesale, so this is not hydration.
//
// Class names match src/styles/stories.css — NOT Tailwind utilities. The
// project ships a frozen, pre-compiled Tailwind build with no plugin in
// vite.config.ts, so utilities that aren't already in that file do nothing.

const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const HEAD_FONT =
  "font-family:'Morl','Helvetica Neue','Helvetica','Arial',sans-serif;font-weight:700";

/** **bold**, *italic*, [text](url) — recurses so **[text](url)** still links. */
export function renderInlineHtml(text) {
  let out = "";
  let last = 0;
  const re = /\*\*([^*]+)\*\*|\*([^*]+)\*|\[([^\]]+)\]\(([^)]+)\)/g;
  let m;
  while ((m = re.exec(text)) !== null) {
    out += esc(text.slice(last, m.index));
    if (m[1]) {
      out += `<strong>${renderInlineHtml(m[1])}</strong>`;
    } else if (m[2]) {
      out += `<em>${renderInlineHtml(m[2])}</em>`;
    } else {
      const attrs = m[4].startsWith("/") ? "" : ' target="_blank" rel="noopener noreferrer"';
      out += `<a href="${esc(m[4])}"${attrs}>${esc(m[3])}</a>`;
    }
    last = m.index + m[0].length;
  }
  return out + esc(text.slice(last));
}

function blockHtml(b) {
  switch (b.t) {
    case "standfirst":
      return `<aside class="story-note article-note">${renderInlineHtml(b.v)}</aside>`;
    case "h2":
      return `<h2 style="${HEAD_FONT}">${renderInlineHtml(b.v)}</h2>`;
    case "p":
      return `<p>${renderInlineHtml(b.v)}</p>`;
    case "note":
      return `<p class="story-aside-text">${renderInlineHtml(b.v)}</p>`;
    case "hr":
      return "<hr />";
    case "img":
      return (
        `<figure><img src="${esc(b.src)}" alt="${esc(b.alt)}" loading="lazy" />` +
        (b.cap ? `<figcaption>${renderInlineHtml(b.cap)}</figcaption>` : "") +
        "</figure>"
      );
    case "quote":
      return (
        '<aside class="story-callout">' +
        (b.head ? `<h3 style="${HEAD_FONT}">${esc(b.head)}</h3>` : "") +
        b.paras.map((p) => `<p>${renderInlineHtml(p)}</p>`).join("") +
        "</aside>"
      );
    case "table":
      return (
        '<div class="story-table-wrap"><table class="story-table"><tbody>' +
        b.rows
          .map(
            (row) =>
              "<tr>" +
              row.map((cell) => `<td>${renderInlineHtml(cell)}</td>`).join("") +
              "</tr>"
          )
          .join("") +
        "</tbody></table></div>"
      );
    default:
      return "";
  }
}

/** Full article markup for build/stories/<slug>.html */
export function renderStoryHtml(story) {
  const published = new Date(story.date + "T00:00:00").toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const note = story.blocks.find((b) => b.t === "standfirst");
  return (
    '<article class="story">' +
    `<a href="/stories" class="story-back" style="${HEAD_FONT}">&larr; All Stories</a>` +
    `<p class="story-kicker" style="${HEAD_FONT}">${esc(story.category)} &middot; ${esc(story.readingTime)} read</p>` +
    `<h1 class="story-title" style="${HEAD_FONT}">${esc(story.title)}</h1>` +
    `<p class="story-dek">${esc(story.dek)}</p>` +
    `<p class="story-byline"><time datetime="${esc(story.date)}">${published}</time> &middot; Photographs by ${esc(story.photoCredit)}</p>` +
    (note ? blockHtml(note) : "") +
    `<figure><img src="${esc(story.hero)}" alt="${esc(story.heroAlt)}" /></figure>` +
    story.blocks.filter((b) => b.t !== "standfirst").map(blockHtml).join("") +
    "</article>"
  );
}

/** Index markup for build/stories.html */
export function renderStoriesIndexHtml() {
  return (
    '<section class="stories">' +
    `<h1 class="stories-title" style="${HEAD_FONT}">Stories</h1>` +
    '<p class="stories-intro">Long-form tours of the rigs and the people living in them &mdash; what they built, what it cost, and what they&rsquo;d do differently.</p>' +
    '<div class="stories-grid">' +
    STORIES.map(
      (s) =>
        `<a href="/stories/${esc(s.slug)}" class="story-card">` +
        `<div class="story-card-img"><img src="${esc(s.hero)}" alt="${esc(s.heroAlt)}" /></div>` +
        `<p class="story-card-meta" style="${HEAD_FONT}">${esc(s.category)} &middot; ${esc(s.readingTime)} read</p>` +
        `<h2 class="story-card-title" style="${HEAD_FONT}">${esc(s.title)}</h2>` +
        `<p class="story-card-dek">${esc(s.dek)}</p></a>`
    ).join("") +
    "</div></section>"
  );
}

/** schema.org Article graph for one story. */
export function buildStorySchema(story) {
  const url = `${SITE_URL}/stories/${story.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: story.title,
    description: story.dek,
    image: `${SITE_URL}${story.hero}`,
    datePublished: story.date,
    dateModified: story.date,
    author: { "@type": "Organization", name: "Mobile Dwellings" },
    publisher: {
      "@type": "Organization",
      name: "Mobile Dwellings",
      logo: { "@type": "ImageObject", url: `${SITE_URL}/logo.png` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
  };
}

/** schema.org CollectionPage graph for the index. */
export function buildStoriesIndexSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Stories",
    description:
      "Long-form tours of converted school buses, vans and overland rigs — the builds, the costs, and the people living in them.",
    url: `${SITE_URL}/stories`,
    hasPart: STORIES.map((s) => ({
      "@type": "Article",
      headline: s.title,
      url: `${SITE_URL}/stories/${s.slug}`,
      datePublished: s.date,
      image: `${SITE_URL}${s.hero}`,
    })),
  };
}
