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
              <strong>Mobile Dwellings</strong> is a documentary video series exploring the diverse world of alternative living. 
              From converted school buses and overland rigs to tiny houses on wheels and liveaboard sailboats, 
              we showcase the creativity, craftsmanship, and courage it takes to embrace a mobile lifestyle.
            </p>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mb-6 md:text-left text-center">
              Each video is an intimate portrait—a conversation with individuals who've chosen to live differently. 
              We're interested in the "why" as much as the "how." What drives someone to downsize, simplify, and 
              hit the road? What challenges do they face? What freedoms have they discovered? We believe these stories 
              matter, and we're committed to telling them with care.
            </p>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed md:text-left text-center">
              Whether you're already living on the road, dreaming of your first build, or simply curious about 
              alternative lifestyles, Mobile Dwellings is here to inspire, inform, and connect you with a community of nomadic explorers.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}