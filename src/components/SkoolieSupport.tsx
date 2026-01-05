import skoolieSupportImage from "@/assets/skoolie-support/hero.jpg";
import chuckCassadyImage from "@/assets/skoolie-support/chuck.jpg";
import justinSmithImage from "@/assets/skoolie-support/justin.jpg";

export function SkoolieSupport() {
  return (
    <section id="skoolie-support" className="bg-white dark:bg-neutral-900">
      <div className="max-w-6xl mx-auto px-6 py-12 md:py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="mb-6 dark:text-white text-[20px] text-[rgb(89,89,89)] font-bold">Skoolie Support</h2>
          <p className="text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto text-lg leading-relaxed">
            Get personalized guidance for your skoolie conversion from experienced builders. Whether you're planning your first build or troubleshooting a complex system, we're here to help.
          </p>
        </div>

        {/* Hero Image - Clickable */}
        <div className="mb-16">
          <a 
            href="http://patreon.com/skooliesupport" 
            target="_blank" 
            rel="noopener noreferrer"
            className="block transition-opacity hover:opacity-90"
          >
            <img 
              src={skoolieSupportImage} 
              alt="Join Skoolie Support on Patreon" 
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </a>
        </div>

        {/* About Section */}
        <div className="max-w-4xl mx-auto mb-20">
          <div className="prose prose-lg max-w-none">
            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed text-center mb-6">
              Skoolie Support is a <a 
                href="http://patreon.com/skooliesupport" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-neutral-900 dark:text-white underline hover:text-neutral-600 dark:hover:text-neutral-400 transition-colors"
              >Patreon community</a> offering direct access to both professional and amateur perspectives on school bus conversions. Get one-on-one consultations, build advice, and ongoing support throughout your conversion journey.
              Whether you need help with electrical systems, layout planning, mechanical issues, or just want someone to review your build plans, we bring professional expertise and real-world amateur experience to guide you through every step.
            </p>
          </div>
        </div>

        {/* Builders Section */}
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          {/* Chuck Cassady */}
          <div className="border border-neutral-200 dark:border-neutral-700 rounded-lg overflow-hidden">
            <img 
              src={chuckCassadyImage} 
              alt="Chuck Cassady - Professional Skoolie Builder" 
              className="w-full h-auto"
            />
            <div className="p-8 dark:bg-neutral-800">
              <h3 className="mb-4 dark:text-white text-center">Chuck Cassady</h3>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-6 text-center" style={{ fontFamily: "'Neue Haas Grotesk Display Pro', 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif" }}>The Professional</p>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4 text-center">
                Chuck is a professional builder with years of experience constructing custom skoolie conversions. From structural modifications to complex electrical and plumbing systems, Chuck brings technical expertise and industry knowledge to help you build safely and efficiently.
              </p>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed text-center">
                His professional insight ensures your build meets safety standards while achieving your design goals.
              </p>
            </div>
          </div>

          {/* Justin from Mobile Dwellings */}
          <div className="border border-neutral-200 dark:border-neutral-700 rounded-lg overflow-hidden">
            <img 
              src={justinSmithImage} 
              alt="Justin Smith - Mobile Dwellings / Amateur Builder" 
              className="w-full h-auto"
            />
            <div className="p-8 dark:bg-neutral-800">
              <h3 className="mb-4 dark:text-white text-center">Justin Smith</h3>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-6 text-center" style={{ fontFamily: "'Neue Haas Grotesk Display Pro', 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif" }}>The Amateur</p>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4 text-center">
                Justin is the creator of Mobile Dwellings and an amateur builder who's been through the conversion process himself. He understands the challenges of learning on the fly, working with limited budgets, and making decisions without professional training.
              </p>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed text-center">
                His perspective offers relatable advice and creative problem-solving for DIY builders at any skill level.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-12">
          <h2 className="mb-6 dark:text-white">Ready to Get Started?</h2>
          <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mb-8 max-w-2xl mx-auto">
            Join our Patreon community to get personalized support for your skoolie conversion. Access private messaging, build reviews, video consultations, and a community of fellow builders.
          </p>
          <a 
            href="http://patreon.com/skooliesupport" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-block bg-neutral-900 dark:bg-neutral-700 text-white px-8 py-4 rounded hover:bg-neutral-700 dark:hover:bg-neutral-600 transition-colors"
            style={{ fontFamily: "'Neue Haas Grotesk Display Pro', 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif" }}
          >
            Join Skoolie Support on Patreon
          </a>
        </div>
      </div>
    </section>
  );
}
