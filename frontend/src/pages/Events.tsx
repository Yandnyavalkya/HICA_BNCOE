import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';
import { fallbackEvents } from '../data/fallbackData';

type Event = {
  _id: string;
  title: string;
  description?: string;
  date?: string;
  location?: string;
  image_url?: string;
  registration_link?: string;
  event_category?: string;
};

export default function Events() {
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
  
  const { data, isLoading } = useQuery<Event[]>({
    queryKey: ['events'],
    queryFn: async () => {
      try {
        const res = await api.get<Event[]>('/events');
        return res.data;
      } catch (error) {
        // Return fallback data if backend is unavailable
        console.warn('Using fallback events data');
        return fallbackEvents as Event[];
      }
    },
    retry: false, // Don't retry if backend is down
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    placeholderData: fallbackEvents as Event[], // Show fallback immediately
  });

  const toggleExpand = (eventId: string) => {
    setExpandedCards((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(eventId)) {
        newSet.delete(eventId);
      } else {
        newSet.add(eventId);
      }
      return newSet;
    });
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
            Events
          </h2>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Join us for exciting technical events and workshops
          </p>
        </div>

        {isLoading && (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            <p className="text-white/70 mt-4">Loading events...</p>
          </div>
        )}

        {!isLoading && (!data || data.length === 0) && (
          <div className="text-center py-20">
            <p className="text-white/70 text-lg">
              Upcoming and past HICA BNCOE events will appear here.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {data?.map((event, index) => (
            <div
              key={event._id}
              className="group relative bg-gradient-to-br from-purple-900/30 to-cyan-900/30 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 hover:border-purple-500/50 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-cyan-500/0 group-hover:from-purple-500/10 group-hover:to-cyan-500/10 transition-all duration-300"></div>
              
              <div className="relative z-10">
                {event.image_url ? (
                  <div className="relative w-full overflow-hidden" style={{ aspectRatio: '4/5' }}>
                    <img
                      src={event.image_url}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  </div>
                ) : (
                  <div className="w-full bg-gradient-to-br from-purple-500/20 to-cyan-500/20 flex items-center justify-center" style={{ aspectRatio: '4/5' }}>
                    <div className="text-6xl text-white/30">📅</div>
                  </div>
                )}

                <div className="p-6">
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-purple-400 transition-colors duration-300">
                    {event.title}
                  </h3>

                  {event.date && (
                    <div className="flex items-center text-cyan-400 mb-3">
                      <i className="far fa-calendar-alt mr-2"></i>
                      <span className="text-sm">
                        {new Date(event.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  )}

                  {event.location && (
                    <div className="flex items-center text-purple-400 mb-4">
                      <i className="fas fa-map-marker-alt mr-2"></i>
                      <span className="text-sm">{event.location}</span>
                    </div>
                  )}

                  {event.description && (
                    <div className="mb-6">
                      <p
                        className={`text-white/70 text-sm leading-relaxed ${
                          expandedCards.has(event._id) ? '' : 'line-clamp-3'
                        }`}
                      >
                        {event.description}
                      </p>
                      {event.description.length > 120 && (
                        <button
                          onClick={() => toggleExpand(event._id)}
                          className="mt-2 text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors duration-300 flex items-center gap-1"
                        >
                          {expandedCards.has(event._id) ? (
                            <>
                              <span>Read Less</span>
                              <i className="fas fa-chevron-up text-xs"></i>
                            </>
                          ) : (
                            <>
                              <span>Read More</span>
                              <i className="fas fa-chevron-down text-xs"></i>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  )}

                  {event.event_category && (
                    <Link
                      to={`/gallery?event=${encodeURIComponent(event.event_category)}`}
                      className="inline-block w-full text-center px-6 py-3 bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 rounded-lg font-semibold text-white hover:from-cyan-500 hover:via-blue-500 hover:to-purple-500 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/50"
                    >
                      📸 View Gallery
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
