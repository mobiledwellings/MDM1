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
    "slug": "flying-circus-bus",
    "title": "A Family of Six, Four Cats and a Dog, in 320 Square Feet",
    "dek": "Morgan had never heard the word skoolie when Glaucio suggested buying a school bus. Six years later their family of six lives in it full time. This is the full tour of the Flying Circus Bus.",
    "hero": "/blog/flying-circus-bus/youtube-thumbnail.jpg",
    "heroAlt": "Morgan, Glaucio and their four children standing in front of their teal and white converted school bus on a forest road.",
    "category": "Bus Tours",
    "date": "2026-09-17",
    "readingTime": "6 min",
    "photoCredit": "Mobile Dwellings",
    "keywords": "school bus conversion family of six, skoolie with kids, bus conversion tour, flying circus bus, bluebird tc2000 skoolie, family skoolie build, homeschool on a bus",
    "blocks": [
      {
        "t": "standfirst",
        "v": "This article is about Morgan and Glaucio of the Flying Circus Bus ([Instagram](https://www.instagram.com/flyingcircusbus/) · [Facebook](https://www.facebook.com/p/Flying-Circus-Bus-61559187452069/)). It was written from the Mobile Dwellings video tour, which was filmed by Felicia of Zia the Bus and edited by Medha. The article was drafted by an LLM from that tour and edited by Justin from Mobile Dwellings. Every photograph here is a still from the video."
      },
      {
        "alt": "The family standing in front of the Flying Circus Bus, the thumbnail for the video tour.",
        "compact": true,
        "id": "JJQ18h5ox_k",
        "label": "Watch the full tour",
        "poster": "/blog/flying-circus-bus/youtube-thumbnail.jpg",
        "t": "video",
        "title": "They Live in a School Bus Full Time With 4 Kids, 4 Cats, and a Dog · 16 min"
      },
      {
        "t": "p",
        "v": "Morgan was sitting on the couch in their living room in Montana when Glaucio walked out of the bathroom and said, \"Babe, let's buy a school bus.\""
      },
      {
        "t": "p",
        "v": "She had never heard the word skoolie. \"Didn't know what they were,\" she says. \"It turned my entire life upside down.\""
      },
      {
        "t": "p",
        "v": "Six years and a nine-month build later, the two of them live on that bus full time with four kids, four cats and a dog. This is the full tour of the Flying Circus Bus."
      },
      {
        "t": "hr"
      },
      {
        "t": "h2",
        "v": "Why a bus"
      },
      {
        "t": "p",
        "v": "They were a family of six with five pets, trying to work out how to travel together. Flying never quite did it. \"You hop on a plane and you go from point A to point B,\" Morgan says. \"You see where you were and you see your destination, but you miss all this incredible stuff in between.\" The slow pace of bus life turned the trip into what she calls a zigzag adventure."
      },
      {
        "alt": "Morgan, Glaucio and their four children sitting together on rugs and chairs under an awning beside their converted school bus.",
        "cap": "The reason for the whole thing: everyone in one place.",
        "src": "/blog/flying-circus-bus/family-outside-the-bus.jpg",
        "t": "img"
      },
      {
        "t": "p",
        "v": "There was another reason, too. In the house, everyone had spread out and gotten busy, and they were looking for a way to get closer again. Now they are in 320 square feet. \"It forces you to get really clear about who you are,\" Morgan says, \"and it brings a lot of things to the surface.\""
      },
      {
        "t": "p",
        "v": "The decision to go full time came after their first trip around the US, when they kept catching themselves saying the same thing in one place after another: I would live here. I would live here. Then they went home to Montana and hit their first twenty-below day, looked at each other, and decided to sell everything."
      },
      {
        "t": "hr"
      },
      {
        "t": "h2",
        "v": "The bus"
      },
      {
        "t": "p",
        "v": "It's a 1996 Bluebird TC2000 with an 8.3-litre Cummins diesel and an Allison 3060 transmission. Along the passenger side are four exterior storage bays."
      },
      {
        "alt": "Glaucio crouching beside an open exterior storage bay on the side of the bus, with the words Flying Circus Bus painted along the panel.",
        "cap": "Four bays along the passenger side hold the batteries and gear.",
        "src": "/blog/flying-circus-bus/exterior-storage-bays.jpg",
        "t": "img"
      },
      {
        "t": "p",
        "v": "Inside those bays is the power system: three 24-volt [batteries](https://signaturesolar.com/wiren-server-rack-battery-48v-100ah-u5/?ref=mobiledwellings) at 280Ah each, a [5,000-watt inverter](https://signaturesolar.com/victron-multiplus-ii-48-5000-70-95-120v/?ref=mobiledwellings&search_query=victron%20multiplus&searchuuid=4767e3a5-08d1-4358-b954-50777286ba7f), and a [Victron Cerbo](https://signaturesolar.com/victron-cerbo-gx-mk2/?ref=mobiledwellings&search_query=victron%20cerbo%20gx&searchuuid=7c43996c-058f-43e6-8976-dc3a8c8654be) that talks to the bus's home automation. On the roof are six 440-watt bifacial [solar panels](https://signaturesolar.com/all-products/solar-panels/?ref=mobiledwellings&sort=priceasc), Starlink, and one of the [two mini splits](https://link.amazon/B06hU1svH)."
      },
      {
        "alt": "An overhead drone view of the bus roof, covered with large solar panels, a rooftop deck and air conditioning units.",
        "cap": "Six 440-watt bifacial panels, seen from above.",
        "src": "/blog/flying-circus-bus/solar-panels-from-above.jpg",
        "t": "img"
      },
      {
        "t": "p",
        "v": "The roof is also a room. There's an observation deck up there for hanging out and for storage: tools, spare parts, the railings themselves. The railings fold up to enclose the space, which makes it somewhere the kids can safely be."
      },
      {
        "t": "hr"
      },
      {
        "t": "h2",
        "v": "The front of the bus"
      },
      {
        "t": "p",
        "v": "Just inside the door is what Morgan calls the catch-all space, and it sets the tone for the whole build: vertical storage, everywhere, using whatever was left over."
      },
      {
        "alt": "The front interior of the bus looking toward the driver's seat, with hooks for coats, overhead cabinets and hats on the wall.",
        "cap": "Backpacks and coats live at the front door.",
        "src": "/blog/flying-circus-bus/front-entry-and-storage.jpg",
        "t": "img"
      },
      {
        "t": "p",
        "v": "The sides of the couch would have been armrests in a house. Here they're the mudroom: each child has a bin that pulls out with their shoes in it. Above, overhead cabinets hold everything the family reaches for day to day. And because four cats live here, there's a litter box built into the cabinetry. Where the cats go to the bathroom is the question, Morgan says, that people ask more than any other, and well there's your answer."
      },
      {
        "alt": "A cat walking along the outside ledge of the yellow school bus.",
        "cap": "Four cats, one dog, six people, 320 square feet.",
        "src": "/blog/flying-circus-bus/cat-on-the-bus.jpg",
        "t": "img"
      },
      {
        "t": "hr"
      },
      {
        "t": "h2",
        "v": "A living room built for drive days"
      },
      {
        "t": "p",
        "v": "With six people, they went with a large couch that seats three plus a love seat, and made the cushions thick and comfortable, not just for evenings in but because the family is sitting on them while the bus is moving. Seat belts pull out of the couch for driving."
      },
      {
        "alt": "The living room of the bus with a large couch, a love seat, wood floors and a table, seen down the length of the interior.",
        "cap": "Seat belts pull out of the couch. The cushions were chosen for long drive days.",
        "src": "/blog/flying-circus-bus/living-room.jpg",
        "t": "img"
      },
      {
        "t": "p",
        "v": "Underneath are drawers for the kids. Behind every cushion is another hidden compartment. And the whole thing converts: lift the cushions, slide the base out, put it together, and the living room becomes a large sofa bed for movie nights and rainy days."
      },
      {
        "t": "hr"
      },
      {
        "t": "h2",
        "v": "One table, three jobs"
      },
      {
        "t": "p",
        "v": "Almost everything in the bus does more than one thing, because living small means you don't get to give a room a single purpose. The kitchen table is also the office, and the monitor above it is both a movie screen and a second display when Glaucio is working."
      },
      {
        "alt": "Morgan pulling out one of the custom wooden stools that store homeschool supplies, with cats nearby.",
        "cap": "Each child has their own stool, and their schoolwork is inside it.",
        "src": "/blog/flying-circus-bus/homeschool-stools.jpg",
        "t": "img"
      },
      {
        "t": "p",
        "v": "The stools were custom built to hold the kids' homeschool things, one each, so nobody has to interrupt anyone else to get at their own work."
      },
      {
        "t": "p",
        "v": "Morgan played cello professionally, so instruments were always going into this build. There's a guitar and a ukulele, plus a purpose-built slot for the keyboard, which never moves and never falls while they drive. When they want it, the cover comes off, it goes up on the table, and it's ready."
      },
      {
        "alt": "Morgan lifting the wooden cover from the built-in keyboard storage slot beside the dining table.",
        "cap": "The keyboard has its own place in the cabinetry.",
        "src": "/blog/flying-circus-bus/keyboard-storage.jpg",
        "t": "img"
      },
      {
        "t": "hr"
      },
      {
        "t": "h2",
        "v": "The kitchen"
      },
      {
        "t": "p",
        "v": "Like most houses, the kitchen is where everyone ends up, and it's the most deliberately planned part of the bus. The fridge is apartment-style and sits higher on purpose, so there's usable storage above and below it. One drawer above the fridge holds the projector, and underneath is the cat food."
      },
      {
        "alt": "A tall pull-out pantry beside the fridge, filled with labelled containers of dry goods.",
        "cap": "The pull-out pantry holds more than it looks like it should.",
        "src": "/blog/flying-circus-bus/pull-out-pantry.jpg",
        "t": "img"
      },
      {
        "t": "p",
        "v": "The pantry pulls out and holds far more than you'd guess, in uniform pop-top containers. The spices above get the same treatment, labelled on top so it's obvious what's running low. Both are reachable from either side, so one person can be cooking while another grabs something, without anyone having to move."
      },
      {
        "t": "p",
        "v": "The counters are L-shaped and deeper than standard, because the 100-gallon fresh water tank sits underneath and so they modified the depth to suit it. They're epoxy, and custom poured. They wanted the look of stone but something lighter. Six years on, they still look new."
      },
      {
        "t": "p",
        "v": "There's no traditional oven. They decided the space was worth more as drawers, and Morgan says she hasn't regretted it once. The drawers are deep: dishes and pots in the middle, a catch-all below, and toe-kick drawers, because for a family of six it's important to use all of the available space in a Skoolie."
      },
      {
        "alt": "Morgan crouching to open a shallow toe-kick drawer beneath the kitchen cabinets, filled with cans.",
        "cap": "The toe kick is a drawer. This one is all cans.",
        "src": "/blog/flying-circus-bus/toe-kick-drawer.jpg",
        "t": "img"
      },
      {
        "t": "p",
        "v": "They went for drawers over cabinets. \"We've traveled enough to know that when you open up a cabinet after driving everything falls out,\" Morgan says. \"That was not something I wanted to be picking up.\" Drawers stay put. The sink is full size, big enough to wash a large pan without water going up the walls."
      },
      {
        "t": "hr"
      },
      {
        "t": "h2",
        "v": "Where four kids sleep"
      },
      {
        "t": "p",
        "v": "Four full-size bunks, two on each side. They were built for the adults the kids will become rather than the children they were. Each one fits a six-foot person, just slightly narrower than a twin, so nothing has to be remodeled as they grow."
      },
      {
        "alt": "A child's bunk with a curtain pulled back, purple LED lighting inside and stuffed animals on the bed.",
        "cap": "Four bunks, each with a curtain, a light and a drawer.",
        "src": "/blog/flying-circus-bus/kids-bunks.jpg",
        "t": "img"
      },
      {
        "t": "p",
        "v": "Every bunk has a curtain. It adds a little insulation on cold nights and gives each kid privacy and darkness when they want it. Under the beds, each child has a drawer for clothes."
      },
      {
        "alt": "Morgan demonstrating zippered bedding on one of the bunks.",
        "cap": "Morgan made zippered bedding for every bed. One zip and it's made.",
        "src": "/blog/flying-circus-bus/zipper-bedding.jpg",
        "t": "img"
      },
      {
        "t": "p",
        "v": "The bedding is Morgan's own solution, and it's the detail worth stealing: every bed has zippers, with the sheet on the inside. One zip and the bed is made."
      },
      {
        "t": "p",
        "v": "The wall between the kids' room and their own became storage too. The cavity is now a medicine cabinet. Because the engine is in the rear, the space around it was turned into more drawers, for laundry and daily things."
      },
      {
        "t": "hr"
      },
      {
        "t": "h2",
        "v": "Nine months of building"
      },
      {
        "t": "p",
        "v": "The build took nine months. \"Every single moment that I was awake, weekends, holidays, it was working on the bus, all in,\" Glaucio says. He describes it as a puzzle that teaches you about yourself, especially doing it as a couple, with kids, and says the real reward was finding out they could do more than they thought they could."
      },
      {
        "t": "p",
        "v": "Morgan's summary is shorter. \"I think it's a lot like pregnancy. You forget how bad it actually was, because we're so far into it now.\""
      },
      {
        "t": "hr"
      },
      {
        "t": "h2",
        "v": "The bathroom"
      },
      {
        "t": "p",
        "v": "The bathroom door does two jobs. Closed one way, it's the bathroom door. Closed the other, it separates the front half of the bus from the bunks, so the kids can be in bed while everyone else carries on with the evening."
      },
      {
        "alt": "A compact bathroom with a composting toilet, hexagonal tile and wood trim.",
        "cap": "The composting toilet is a DIY build.",
        "src": "/blog/flying-circus-bus/composting-toilet.jpg",
        "t": "img"
      },
      {
        "t": "p",
        "v": "The hot water is tankless, and with six people on board they don't run out. It's held up for six years. The toilet is composting and they built it themselves. The sink is small, smaller than Morgan would like, because the wall above it had to hold everything else."
      },
      {
        "alt": "A shower stall lined with small hexagonal tile and a wood threshold.",
        "cap": "Small tiles, chosen to survive the road.",
        "src": "/blog/flying-circus-bus/tiled-shower.jpg",
        "t": "img"
      },
      {
        "t": "p",
        "v": "The shower is real tile, and the tiles are small on purpose: the hope was that smaller pieces would survive years of road vibration without cracking. So far, including the drive down to Baja, they have."
      },
      {
        "t": "hr"
      },
      {
        "t": "h2",
        "v": "Their room"
      },
      {
        "t": "p",
        "v": "The back bedroom closes off with doors, for privacy and for sound. They're not thick, but with both doors shut you can be at the back of the bus while music plays up front and not hear it."
      },
      {
        "alt": "The rear bedroom with a full-size bed made up with grey and tan bedding, and custom cabinetry with open shelving above.",
        "cap": "A full-size bed at the back provides a cozy bed for Morgan and Glaucio.",
        "src": "/blog/flying-circus-bus/rear-bedroom.jpg",
        "t": "img"
      },
      {
        "t": "p",
        "v": "Both of them work remotely, so a table pops up and pulls out to become a desk, then stows away again, and doubles as the step up into the bed. The bed is full size with the same zippered bedding, there's custom cabinetry for daily things, and the second [mini split](https://link.amazon/B01MhrK3N) is back here to keep this end warm or cool independently."
      },
      {
        "t": "hr"
      },
      {
        "t": "h2",
        "v": "What they'd tell you"
      },
      {
        "t": "p",
        "v": "Glaucio's advice is about systems. Start with air conditioning, and don't assume you'll chase fair weather. Put it in. And put your money and effort into the things you won't want to upgrade later."
      },
      {
        "t": "p",
        "v": "Morgan's is about storage. Get really clear on what you need to have with you, and build the space for it before you move in. \"If things don't have a place, your bus is going to be cluttered.\""
      },
      {
        "t": "p",
        "v": "If you're working through those decisions on a build of your own, that's the kind of thing we dig into at [Skoolie Support](/skoolie-support), and if you're still looking for the bus itself, there are [rigs for sale](/rigs-for-sale) here too."
      },
      {
        "alt": "Morgan and Glaucio sitting together on the couch inside the bus, talking to the camera.",
        "cap": "Six years in, with no plans to stop.",
        "src": "/blog/flying-circus-bus/morgan-and-glaucio.jpg",
        "t": "img"
      },
      {
        "t": "p",
        "v": "As for how long they'll keep doing it, the question they get asked more than any other, they want to keep going even after the kids have grown, adapting the lifestyle as they need to. \"There's no end in sight,\" Morgan says. \"Let's just say that.\""
      },
      {
        "t": "hr"
      },
      {
        "t": "h2",
        "v": "The bus, at a glance"
      },
      {
        "rows": [
          [
            "**Chassis**",
            "1996 Bluebird TC2000"
          ],
          [
            "**Drivetrain**",
            "8.3L Cummins diesel, Allison 3060"
          ],
          [
            "**Size**",
            "320 sq ft"
          ],
          [
            "**Build**",
            "Nine months, DIY"
          ],
          [
            "**Batteries**",
            "Three 24V, 280Ah each"
          ],
          [
            "**Inverter**",
            "5,000W, with a Victron Cerbo GX"
          ],
          [
            "**Solar**",
            "Six 440W bifacial panels"
          ],
          [
            "**Climate**",
            "Two mini splits, front and rear"
          ],
          [
            "**Water**",
            "100 gallons fresh, tankless hot water"
          ],
          [
            "**Bathroom**",
            "DIY composting toilet, tiled shower"
          ],
          [
            "**Sleeping**",
            "Four full-size bunks, plus a full bed"
          ],
          [
            "**Connectivity**",
            "Starlink"
          ]
        ],
        "t": "table"
      },
      {
        "head": "A note on the power system",
        "paras": [
          "Our [curated list of the gear worth looking at](/deals) carries the current code, **MD50OFF**, for $50 off.",
          "Some links in this article are affiliate links. If you buy through them, Mobile Dwellings may earn a commission at no extra cost to you."
        ],
        "t": "quote"
      },
      {
        "t": "hr"
      },
      {
        "alt": "The family standing in front of the Flying Circus Bus, the thumbnail for the video tour.",
        "id": "JJQ18h5ox_k",
        "label": "Watch the full tour · 16 min",
        "poster": "/blog/flying-circus-bus/youtube-thumbnail.jpg",
        "t": "video",
        "title": "They Live in a School Bus Full Time With 4 Kids, 4 Cats, and a Dog"
      },
      {
        "t": "note",
        "v": "Follow the Flying Circus Bus on [Instagram](https://www.instagram.com/flyingcircusbus/) and [Facebook](https://www.facebook.com/p/Flying-Circus-Bus-61559187452069/). Watch the full video tour on the Mobile Dwellings YouTube channel."
      }
    ]
  },
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
        "v": "The distance from Deadhorse, Alaska to Ushuaia, Argentina is roughly 19,000 miles, and Cora and José have been driving it since 2019. They are currently somewhere far north of the middle. At their present rate they expect to arrive in about ten years, which works out to roughly three miles a day across the whole trip. This pace would embarrass a tortoise, and this was supposed to be just a one year trip. Though in fairness the tortoise is not stopping to record an album (spoiler alert this bus has an entire recording studio inside)."
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
          "**Signature Solar** is our go-to for solar panels, lithium batteries, mini splits and Victron gear.",
          "Our [curated list of the gear worth looking at](/signature-solar-coupon) carries the current code, **MD50OFF**, for $50 off.",
          "We earn a commission on sales through our links, at no extra cost to you."
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
            "10 × 100W panels, 1 kW"
          ],
          [
            "**Fresh water**",
            "Two 40-gallon tanks, 10 to 14 days for two"
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
        "alt": "The bus parked on a gravel shore beside a wide lake at sunset, mountains low on the far side.",
        "cap": "Still pointed south."
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
    case "video":
      if (b.compact) {
        return (
          `<a class="story-video story-video-compact" href="https://www.youtube.com/watch?v=${esc(b.id)}" target="_blank" rel="noopener noreferrer">` +
          `<span class="story-video-play" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></span>` +
          `<span class="story-video-meta"><span class="story-video-label">${esc(b.label)}</span>` +
          `<span class="story-video-title">${esc(b.title)}</span></span></a>`
        );
      }
      return (
        `<a class="story-video" href="https://www.youtube.com/watch?v=${esc(b.id)}" target="_blank" rel="noopener noreferrer">` +
        `<div class="story-video-frame"><img src="${esc(b.poster)}" alt="${esc(b.alt)}" loading="lazy" />` +
        `<span class="story-video-play" aria-hidden="true"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg></span></div>` +
        `<div class="story-video-meta"><span class="story-video-label">${esc(b.label)}</span>` +
        `<span class="story-video-title">${esc(b.title)}</span></div></a>`
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
