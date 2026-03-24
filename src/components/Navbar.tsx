import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container nav-container">
        <Link to="/" className="logo">
          <span className="logo-copy logo-wordmark">
            <strong>
              <span className="logo-wordmark-dark">Wed</span>
              <span className="logo-wordmark-accent">Meet</span>
              <span className="logo-wordmark-mark">TM</span>
            </strong>
            <small>Wedding Invitations</small>
          </span>
        </Link>

        <nav className="desktop-nav">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/templates" className="nav-link">Explore Designs</Link>
        </nav>


        <button
          className="mobile-menu-btn"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
        >
          {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.nav
            className="mobile-nav"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.22 }}
          >
            <Link to="/" className="mobile-link" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
            <Link to="/templates" className="mobile-link" onClick={() => setIsMobileMenuOpen(false)}>Explore Designs</Link>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
