import { HiExternalLink } from "react-icons/hi";
import { HiLocationMarker } from "react-icons/hi";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useState } from "react";
import { useRigs } from "../contexts/RigsContext";
import { Link } from "react-router-dom";

export function RigsForSale() {
  const { rigs } = useRigs();
  const [filter, setFilter] = useState<string>("featured");

  const filteredRigs = filter === "featured"
    ? rigs.filter(rig => rig.featured).sort((a, b) => (a.featuredOrder || 0) - (b.featuredOrder || 0))
    : filter === "all" 
    ? rigs 
    : rigs.filter(rig => rig.type.toLowerCase().includes(filter.toLowerCase()));

  return (
    <section id="rigs" className="bg-neutral-50 dark:bg-neutral-800 border-y border-neutral-200 dark:border-neutral-700">
      <div className="max-w-7xl mx-auto px-6 py-20 md:py-32">
        <div className="mb-12">
          <h2 className="text-center mb-8 dark:text-white text-[20px] font-bold text-[rgb(89,89,89)]">Rigs For Sale</h2>
          <p className="text-center text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto mb-12">
            Quality mobile dwellings for sale from the community. Each listing links to the seller's marketplace page where you can connect directly.
          </p>
          
          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter("featured")}
              className={`px-4 py-2 rounded transition-colors ${
                filter === "featured"
                  ? "bg-neutral-900 dark:bg-neutral-700 text-white"
                  : "bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-700"
              }`}
            >
              Featured
            </button>
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded transition-colors ${
                filter === "all"
                  ? "bg-neutral-900 dark:bg-neutral-700 text-white"
                  : "bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-700"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("bus")}
              className={`px-4 py-2 rounded transition-colors ${
                filter === "bus"
                  ? "bg-neutral-900 dark:bg-neutral-700 text-white"
                  : "bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-700"
              }`}
            >
              Bus Conversions
            </button>
            <button
              onClick={() => setFilter("tiny")}
              className={`px-4 py-2 rounded transition-colors ${
                filter === "tiny"
                  ? "bg-neutral-900 dark:bg-neutral-700 text-white"
                  : "bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-700"
              }`}
            >
              Tiny Houses
            </button>
            <button
              onClick={() => setFilter("overland")}
              className={`px-4 py-2 rounded transition-colors ${
                filter === "overland"
                  ? "bg-neutral-900 dark:bg-neutral-700 text-white"
                  : "bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-700"
              }`}
            >
              Overland Rigs
            </button>
            <button
              onClick={() => setFilter("boat")}
              className={`px-4 py-2 rounded transition-colors ${
                filter === "boat"
                  ? "bg-neutral-900 dark:bg-neutral-700 text-white"
                  : "bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-700"
              }`}
            >
              Boats
            </button>
            <button
              onClick={() => setFilter("van")}
              className={`px-4 py-2 rounded transition-colors ${
                filter === "van"
                  ? "bg-neutral-900 dark:bg-neutral-700 text-white"
                  : "bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-700"
              }`}
            >
              Vans
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {filteredRigs.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-neutral-500 dark:text-neutral-400">No rigs found in this category.</p>
            </div>
          ) : (
            filteredRigs.map((rig) => (
              <article key={rig.id} className="group bg-white dark:bg-neutral-900 rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-700 hover:shadow-lg transition-shadow">
                <Link
                  to={`/rigs/${rig.id}`}
                  className="block"
                >
                  <div className="relative aspect-video overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                    <ImageWithFallback 
                      src={rig.thumbnail}
                      alt={rig.title}
                      className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                    />
                    {(() => {
                      const currentStatus = rig.status || (rig.sold ? 'sold' : 'available');
                      return (
                        <div className={`absolute top-3 right-3 ${
                          currentStatus === 'sold' ? 'bg-red-600' : 
                          currentStatus === 'pending' ? 'bg-yellow-600' : 
                          'bg-neutral-900 dark:bg-neutral-700'
                        } text-white px-3 py-1 text-sm rounded font-semibold`}>
                          {currentStatus === 'sold' ? 'SOLD' : currentStatus === 'pending' ? 'PENDING' : rig.price}
                        </div>
                      );
                    })()}
                  </div>
                  
                  <div className="p-4">
                    <div className="text-neutral-500 dark:text-neutral-400 text-xs uppercase tracking-wider mb-2">
                      {rig.type}
                    </div>
                    <h3 className="mb-3 dark:text-white group-hover:text-neutral-600 dark:group-hover:text-neutral-400 transition-colors line-clamp-2">
                      {rig.title}
                    </h3>
                    
                    <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400 mb-3">
                      <HiLocationMarker className="w-4 h-4" />
                      <span>{rig.location}</span>
                    </div>

                    {rig.highlights && rig.highlights.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {rig.highlights.map((highlight, index) => (
                          <span
                            key={index}
                            className="text-xs bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 px-2 py-1 rounded"
                          >
                            {highlight}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-sm text-neutral-900 dark:text-white font-medium group-hover:text-neutral-600 dark:group-hover:text-neutral-400 transition-colors">
                      <span>View Details</span>
                      <HiExternalLink className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
              </article>
            ))
          )}
        </div>

        {filteredRigs.length > 0 && (
          <div className="text-center mt-12">
            <Link 
              to="#sell-your-rig"
              onClick={(e) => {
                e.preventDefault();
                const element = document.getElementById('sell-your-rig');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="inline-block text-white bg-neutral-900 dark:bg-neutral-700 px-8 py-3 rounded hover:bg-neutral-700 dark:hover:bg-neutral-600 transition-colors"
            >
              List Your Rig For Sale
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}