import { Heart, Instagram, MessageCircle, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer id="contact" className="footer">
      <div className="container footer-shell">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link to="/" className="logo footer-logo">
              <span className="logo-mark footer-mark">
                <Heart className="logo-icon" size={16} fill="currentColor" />
              </span>
              <span className="logo-copy">
                <strong>WedMeet</strong>
                <small>Wedding Studio</small>
              </span>
            </Link>
            <p className="footer-desc">
              A pastel invitation studio for couples who want refined design, smooth customization, and WhatsApp-ready delivery.
            </p>
            <div className="social-links">
              <a href="https://instagram.com/wedmeet.in" className="social-link" aria-label="Instagram">
                <Instagram size={18} />
              </a>
              <a href="https://wa.me/918830659769" className="social-link" aria-label="Whatsapp">
                <MessageCircle size={18} />
              </a>
            </div>
          </div>

          <div className="footer-links-group">
            <h4 className="footer-heading">Explore</h4>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/templates">Templates</Link></li>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/admin/login">Admin Login</Link></li>
            </ul>
          </div>

          <div className="footer-links-group">
            <h4 className="footer-heading">Policies</h4>
            <ul className="footer-links">
              <li><Link to="/privacy-policy">Privacy Policy</Link></li>
              <li><Link to="/terms-and-conditions">Terms & Conditions</Link></li>
            </ul>
          </div>

          <div className="footer-contact">
            <h4 className="footer-heading">Talk To Us</h4>
            <ul className="contact-info">
              <li>
                <Phone size={18} className="contact-icon" />
                <a href="tel:+919876543210">+91 8830659769</a>
              </li>
              <li>
                <Instagram size={18} className="contact-icon" />
                <a href="https://instagram.com/wedmeet.in" target="_blank" rel="noreferrer">@wedmeet.in</a>
              </li>
            </ul>
            <p className="footer-contact-note">Mon to Sat, 10 AM to 8 PM</p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} WedMeet. All rights reserved.</p>
          <p>Designed for graceful, shareable celebrations.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
