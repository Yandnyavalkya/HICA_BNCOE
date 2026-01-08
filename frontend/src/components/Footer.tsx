import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';

export default function Footer() {
  const { data: config } = useQuery({
    queryKey: ['config'],
    queryFn: async () => {
      const res = await api.get('/config');
      return res.data && res.data.length > 0 ? res.data[0] : null;
    },
  });

  const siteName = config?.site_name || 'HICA';
  const siteDescription = config?.site_description || 
    'HICA is a community focused on hands-on learning, collaboration, and real-world impact.';

  const currentYear = new Date().getFullYear();

  const footerLinks = [
    { path: '/', label: 'Home' },
    { path: '/events', label: 'Events' },
    { path: '/gallery', label: 'Gallery' },
    { path: '/team', label: 'Team' },
    { path: '/about', label: 'About' },
  ];

  return (
    <footer className="relative mt-20 border-t border-white/10 bg-black/40 backdrop-blur-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <img
                src="https://res.cloudinary.com/dty4b2yj1/image/upload/v1767880198/logo_new_o6wbpf.jpg"
                alt="HICA Logo"
                className="h-12 w-auto object-contain"
              />
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                {siteName}
              </span>
            </div>
            <p className="text-white/70 text-sm leading-relaxed">
              {siteDescription}
            </p>
            {config?.contact_email && (
              <a
                href={`mailto:${config.contact_email}`}
                className="text-purple-400 hover:text-purple-300 text-sm transition-colors duration-300 inline-block"
              >
                📧 {config.contact_email}
              </a>
            )}
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-white/70 hover:text-purple-400 text-sm transition-colors duration-300 inline-block hover:translate-x-1 transform"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4">Connect With Us</h3>
            <div className="flex space-x-4">
              {config?.social_links?.facebook && (
                <a
                  href={config.social_links.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/10 hover:bg-purple-500/30 text-white hover:text-purple-400 transition-all duration-300 transform hover:scale-110"
                  title="Facebook"
                >
                  <i className="fab fa-facebook-f"></i>
                </a>
              )}
              {config?.social_links?.twitter && (
                <a
                  href={config.social_links.twitter}
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/10 hover:bg-purple-500/30 text-white hover:text-purple-400 transition-all duration-300 transform hover:scale-110"
                  title="Twitter"
                >
                  <i className="fab fa-twitter"></i>
                </a>
              )}
              {config?.social_links?.instagram && (
                <a
                  href={config.social_links.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/10 hover:bg-purple-500/30 text-white hover:text-purple-400 transition-all duration-300 transform hover:scale-110"
                  title="Instagram"
                >
                  <i className="fab fa-instagram"></i>
                </a>
              )}
              {config?.social_links?.linkedin && (
                <a
                  href={config.social_links.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/10 hover:bg-blue-600 text-white hover:text-white transition-all duration-300 transform hover:scale-110"
                  title="LinkedIn"
                >
                  <i className="fab fa-linkedin-in"></i>
                </a>
              )}
              {config?.social_links?.github && (
                <a
                  href={config.social_links.github}
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/10 hover:bg-gray-800 text-white hover:text-white transition-all duration-300 transform hover:scale-110"
                  title="GitHub"
                >
                  <i className="fab fa-github"></i>
                </a>
              )}
              {config?.social_links?.youtube && (
                <a
                  href={config.social_links.youtube}
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/10 hover:bg-red-600 text-white hover:text-white transition-all duration-300 transform hover:scale-110"
                  title="YouTube"
                >
                  <i className="fab fa-youtube"></i>
                </a>
              )}
            </div>
            <a
              href="https://bloggersconvision.com/hica/"
              target="_blank"
              rel="noreferrer"
              className="inline-block px-6 py-2.5 bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 rounded-lg font-semibold text-white text-sm hover:from-purple-500 hover:via-pink-500 hover:to-cyan-500 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/50"
            >
              Register Now
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-white/10 text-center">
          <p className="text-white/50 text-sm">
            © {currentYear} {siteName}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
