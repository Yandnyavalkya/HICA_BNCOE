import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const isActive = (path: string) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <nav className="navbar">
      <div className="hamburger" onClick={toggleMenu}>
        &#9776;
      </div>
      <ul className={menuOpen ? 'show' : ''} id="nav-menu">
        <li>
          <Link to="/" onClick={() => setMenuOpen(false)}>
            <img src="https://res.cloudinary.com/dty4b2yj1/image/upload/v1767880198/logo_new_o6wbpf.jpg" alt="HICA Logo" className="h-12 w-auto object-contain" />
          </Link>
        </li>
        <li>
          <Link to="/" onClick={() => setMenuOpen(false)} className={isActive('/')}>
            Home
          </Link>
        </li>
        <li>
          <Link to="/events" onClick={() => setMenuOpen(false)} className={isActive('/events')}>
            Events
          </Link>
        </li>
        <li>
          <Link to="/gallery" onClick={() => setMenuOpen(false)} className={isActive('/gallery')}>
            Gallery
          </Link>
        </li>
        <li>
          <Link to="/team" onClick={() => setMenuOpen(false)} className={isActive('/team')}>
            Team
          </Link>
        </li>
        <li>
          <Link to="/about" onClick={() => setMenuOpen(false)} className={isActive('/about')}>
            About
          </Link>
        </li>
        <li>
          <Link to="/admin/login" onClick={() => setMenuOpen(false)} className={isActive('/admin/login')}>
            Admin
          </Link>
        </li>
      </ul>
      <a
        href="https://bloggersconvision.com/hica/"
        target="_blank"
        rel="noreferrer"
        className="register-btn"
      >
        Register Now
      </a>
    </nav>
  );
}

