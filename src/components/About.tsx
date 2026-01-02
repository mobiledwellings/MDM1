import { SubmitBanner } from "./SubmitBanner";

export function About() {
  return (
    // We use <section> with an ID so your header links can find it
    <section id="about" className="bg-white dark:bg-neutral-900 border-y border-neutral-200 dark:border-neutral-700">
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 mx-auto">
            <article className="prose prose-lg">
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mb-6 md:text-left text-left">
                Mobile Dwellings is a documentary video series exploring alternative ways of living — From converted school buses and overland rigs to tiny homes on wheels and liveaboard sailboats, we focus on the people behind the builds: the decisions they made, the tradeoffs they accepted, and the freedom they found along the way.
              </p>

              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mb-6 md:text-left text-left">
                Each video is a conversation, not just a tour. We care as much about why someone chose this life as how they built it — the challenges, the risks, and the moments that made it worth it.
              </p>

              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mb-6 md:text-left text-left">
                If you’re living on the road, in the middle of a build, or doing something different that deserves to be documented, you’re exactly who this project is for.
              </p>

              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed md:text-left text-left">
                If you have a mobile dwelling and a story you want to share — whether it’s finished or still unfolding — we’d love to hear from you.
              </p>
            </article>
          </div>

          <div className="mx-auto w-full lg:max-w-md">
            <SubmitBanner compact />
          </div>
        </div>
      </div>
    </section>
  );
}