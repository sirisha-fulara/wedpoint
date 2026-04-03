import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useUI } from '../context/UIContext';
import './Navbar.css';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { cartCount, toggleCart } = useUI();
  const location = useLocation();

  const handleLinkClick = () => setIsMobileMenuOpen(false);

  return (
    <nav>
      <Link to="/" className="nav-logo" onClick={handleLinkClick}>
        <span className="w">Wed</span><span className="m">Meet</span><span className="tm">™</span>
      </Link>
      
      <ul className="nav-links">
        <li><Link to="/templates" className={location.pathname === '/templates' && !location.search.includes('filter=video') ? 'active' : ''}>Cards</Link></li>
        <li><Link to="/templates?filter=video" className={location.pathname === '/templates' && location.search.includes('filter=video') ? 'active' : ''}>Videos</Link></li>
        <li><Link to="/about" className={location.pathname === '/about' ? 'active' : ''}>About</Link></li>
        <li><a href="https://instagram.com/wedmeet.in" target="_blank" rel="noreferrer">Instagram</a></li>
      </ul>

      <div className="nav-right">
        <a href="https://wa.me/918830659769?text=Hi! I want to order a wedding invitation from WedMeet™ 💍" target="_blank" rel="noreferrer" className="wa-nav">
          💬 WhatsApp
        </a>
        <button className="cart-btn" onClick={toggleCart}>
          🛒 Cart <span className="cart-count">{cartCount}</span>
        </button>
        <button
          className="mobile-menu-btn"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="mobile-nav">
          <Link to="/templates" className={location.pathname === '/templates' && !location.search.includes('filter=video') ? 'active' : ''} onClick={handleLinkClick}>Cards</Link>
          <Link to="/templates?filter=video" className={location.pathname === '/templates' && location.search.includes('filter=video') ? 'active' : ''} onClick={handleLinkClick}>Videos</Link>
          <Link to="/about" className={location.pathname === '/about' ? 'active' : ''} onClick={handleLinkClick}>About</Link>
          <a href="https://instagram.com/wedmeet.in" target="_blank" rel="noreferrer" onClick={handleLinkClick}>Instagram</a>
          <a href="https://wa.me/918830659769?text=Hi! I want to order a wedding invitation from WedMeet™ 💍" target="_blank" rel="noreferrer" onClick={handleLinkClick}>💬 WhatsApp</a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
