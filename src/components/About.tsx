export function About() {
  return (
    // We use <section> with an ID so your header links can find it
    <section id="about" className="bg-white dark:bg-neutral-900 border-y border-neutral-200 dark:border-neutral-700">
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-20">
        <div className="text-center mb-12">
          <h2 className="mb-6 dark:text-white normal-case text-neutral-800 dark:text-neutral-100 text-3xl font-bold text-center">
            About Mobile Dwellings
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <article className="prose prose-lg lg:col-span-2 mx-auto">
            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mb-6 md:text-left text-center">
              <strong>Mobile Dwellings</strong> is a documentary video series exploring alternative ways of living. From converted school buses and overland rigs to tiny homes and liveaboard sailboats, we focus on the people behind the builds: the decisions they made, the tradeoffs they accepted, and the freedom they found along the way.
            </p>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mb-6 md:text-left text-center">
              Each video is a conversation, not just a tour. We care about why someone chose this life and the challenges, risks, and personal growth that made it either worth it or not.
            </p>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed md:text-left text-center">
              If you have a mobile dwelling and a story you want to share we'd love to hear from you.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}