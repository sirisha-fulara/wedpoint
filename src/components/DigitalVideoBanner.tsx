import { useEffect, useRef } from 'react';
import './DigitalVideoBanner.css';

const DigitalVideoBanner = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });
    
    if (ref.current) {
      obs.observe(ref.current);
    }
    return () => obs.disconnect();
  }, []);

  return (
    <div className="digital-banner reveal" ref={ref} id="videos">
      <div>
        <div className="db-tag">🎬 New — Digital Video Invitations</div>
        <div className="db-title">Share Your Love Story<br /><em>Instantly Online</em></div>
        <p className="db-desc">
          Beautiful video invitations delivered directly to your WhatsApp. 
          No printing, no waiting — perfect for modern couples who want to share their big day instantly!
        </p>
      </div>
      <div className="db-btns">
        <a href="https://wa.me/918830659769?text=Hi! I'm interested in a Digital Video Wedding Invitation 🎬💍" target="_blank" rel="noreferrer" className="db-wa">
          💬 Order on WhatsApp
        </a>
        <a href="https://instagram.com/wedmeet.in" target="_blank" rel="noreferrer" className="db-insta">
          📸 See Samples on Instagram
        </a>
      </div>
    </div>
  );
};

export default DigitalVideoBanner;
