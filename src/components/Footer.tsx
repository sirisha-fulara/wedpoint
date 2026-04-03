import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer>
      <div className="footer-grid">
        <div>
          <div className="footer-logo">
            <span className="w">Wed</span><span className="m">Meet</span><span className="tm">™</span>
          </div>
          <p className="footer-desc">Crafting beautiful wedding invitations from Nagpur. Every card, a lasting keepsake.</p>
        </div>
        <div className="footer-col">
          <h4>Collections</h4>
          <ul>
            <li><Link to="/templates">Hindu Cards</Link></li>
            <li><Link to="/templates">Muslim Cards</Link></li>
            <li><Link to="/templates?filter=video">Digital Videos</Link></li>
            <li><a href="https://wa.me/918830659769" target="_blank" rel="noreferrer">Custom Orders</a></li>
            <li style={{ marginTop: '14px' }}><Link to="/admin/login" style={{ color: 'var(--green-pale)' }}>Admin Login →</Link></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Contact</h4>
          <ul>
            <li><a href="https://wa.me/918830659769" target="_blank" rel="noreferrer">+91 88306 59769</a></li>
            <li><a href="https://instagram.com/wedmeet.in" target="_blank" rel="noreferrer">@wedmeet.in</a></li>
            <li><a href="#">Nagpur, Maharashtra</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2026 WedMeet™. All rights reserved.</p>
        <div className="footer-social">
          <a href="https://wa.me/918830659769" target="_blank" rel="noreferrer" className="social-btn social-wa">💬 WhatsApp</a>
          <a href="https://instagram.com/wedmeet.in" target="_blank" rel="noreferrer" className="social-btn social-ig">📸 Instagram</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
