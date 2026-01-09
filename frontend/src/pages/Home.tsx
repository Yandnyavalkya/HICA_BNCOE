import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';
import { fallbackEvents, fallbackConfig } from '../data/fallbackData';

export default function Home() {
  const [timeLeft, setTimeLeft] = useState('');

  // Fetch next event from API
  const { data: events } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      try {
        const res = await api.get('/events');
        return res.data;
      } catch (error) {
        console.warn('Using fallback events data');
        return fallbackEvents;
      }
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
    placeholderData: fallbackEvents,
  });

  // Get site config for hero content
  const { data: config } = useQuery({
    queryKey: ['config'],
    queryFn: async () => {
      try {
        const res = await api.get('/config');
        return res.data && res.data.length > 0 ? res.data[0] : fallbackConfig;
      } catch (error) {
        console.warn('Using fallback config data');
        return fallbackConfig;
      }
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
    placeholderData: fallbackConfig,
  });

  useEffect(() => {
    // If showing recruitment, use deadline date
    if (config?.show_recruitment && config?.recruitment_deadline) {
      const deadlineDate = new Date(config.recruitment_deadline);
      const interval = setInterval(() => {
        const now = Date.now();
        const distance = deadlineDate.getTime() - now;

        if (distance <= 0) {
          setTimeLeft('Application deadline has passed');
          clearInterval(interval);
          return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
      }, 1000);

      return () => clearInterval(interval);
    } else {
      // Find next upcoming event or use default
      let eventDate: Date;
      
      if (events && events.length > 0) {
        // Sort events by date and find next upcoming
        const sortedEvents = [...events].sort((a, b) => 
          new Date(a.date).getTime() - new Date(b.date).getTime()
        );
        const nextEvent = sortedEvents.find(e => new Date(e.date) > new Date());
        if (nextEvent) {
          eventDate = new Date(nextEvent.date);
        } else {
          // Use first event if all are past
          eventDate = new Date(sortedEvents[0].date);
        }
      } else {
        // Default event date if no events
        eventDate = new Date('March 5, 2025 11:30:00');
      }

      const interval = setInterval(() => {
        const now = Date.now();
        const distance = eventDate.getTime() - now;

        if (distance <= 0) {
          setTimeLeft('The event has started!');
          clearInterval(interval);
          return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [events, config]);

  // Show recruitment notice if enabled
  if (config?.show_recruitment && config.recruitment_title) {
    return (
      <section className="min-h-screen flex flex-col items-center justify-center px-4 py-20">
        <div className="text-center space-y-8 max-w-4xl mx-auto animate-fade-in">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold uppercase tracking-wider bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent animate-gradient-shift">
            {config.recruitment_title}
          </h1>
          
          {config.recruitment_deadline && (
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-cyan-500/20 blur-2xl rounded-2xl"></div>
              <div className="relative px-8 py-6 bg-black/50 backdrop-blur-sm border-2 border-white/20 rounded-2xl">
                <div className="text-sm sm:text-base text-purple-300 mb-2">Last date to apply</div>
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white animate-countdown">
                  {timeLeft || 'Loading...'}
                </div>
                <div className="text-sm sm:text-base text-cyan-300 mt-2">
                  {new Date(config.recruitment_deadline).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>
            </div>
          )}

          {config.recruitment_subtitle && (
            <p className="text-lg sm:text-xl lg:text-2xl text-white/90 max-w-2xl mx-auto leading-relaxed">
              {config.recruitment_subtitle}
            </p>
          )}

          {config.recruitment_message && (
            <div className="bg-purple-900/30 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-6 max-w-2xl mx-auto">
              <p className="text-white/80 leading-relaxed whitespace-pre-line">
                {config.recruitment_message}
              </p>
            </div>
          )}

          {config.recruitment_form_url && (
            <a
              href={config.recruitment_form_url}
              target="_blank"
              rel="noreferrer"
              className="inline-block px-8 py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 rounded-lg font-bold text-white text-lg hover:from-purple-500 hover:via-pink-500 hover:to-cyan-500 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/50"
            >
              👉 Apply Here
            </a>
          )}
        </div>
      </section>
    );
  }

  // Default event display
  const heroTitle = config?.hero_title || "HICA's First Event";
  const heroSubtitle = config?.hero_subtitle || 
    "Join us for our first Technical event at HICA BNCOE. Experience an exciting gathering of tech enthusiasts!";

  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-4 py-20">
      <div className="text-center space-y-8 max-w-4xl mx-auto animate-fade-in">
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold uppercase tracking-wider bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent animate-gradient-shift">
          {heroTitle}
        </h1>
        
        <div className="relative inline-block">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-cyan-500/20 blur-2xl rounded-2xl"></div>
          <div className="relative px-8 py-6 bg-black/50 backdrop-blur-sm border-2 border-white/20 rounded-2xl">
            <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white animate-countdown">
              {timeLeft || 'Loading...'}
            </div>
          </div>
        </div>

        <p className="text-lg sm:text-xl lg:text-2xl text-white/90 max-w-2xl mx-auto leading-relaxed">
          {heroSubtitle}
        </p>

        <a
          href="https://bloggersconvision.com/hica/"
          target="_blank"
          rel="noreferrer"
          className="inline-block px-8 py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 rounded-lg font-bold text-white text-lg hover:from-purple-500 hover:via-pink-500 hover:to-cyan-500 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/50"
        >
          Register Now
        </a>
      </div>
    </section>
  );
}
