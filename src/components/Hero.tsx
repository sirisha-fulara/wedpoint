import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Hero.css';

const Hero = () => {
  const navigate = useNavigate();
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSlide((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="hero">
      <div className={`hero-bg s1`} style={{ opacity: slide === 0 ? 1 : 0 }}></div>
      <div className={`hero-bg s2`} style={{ opacity: slide === 1 ? 1 : 0 }}></div>
      <div className={`hero-bg s3`} style={{ opacity: slide === 2 ? 1 : 0 }}></div>
      <div className="hero-overlay"></div>
      
      <div className="hero-content">
        <div className="hero-tag">✦ Premium Wedding Invitations</div>
        <h1>Your Love Story<br />Deserves <em>Beautiful</em><br />Beginnings</h1>
        <p>Stunning printed cards & digital video invitations crafted for your most special day. Delivered with love from Nagpur.</p>
        <div className="hero-btns">
          <button className="btn-green" onClick={() => navigate('/templates')}>Shop Collection</button>
          <a href="https://wa.me/918830659769?text=Hi! I want a custom wedding invitation 💍" target="_blank" rel="noreferrer" className="btn-wa">
            💬 WhatsApp Order
          </a>
        </div>
      </div>

      <div className="hero-dots">
        <div className={`dot ${slide === 0 ? 'active' : ''}`} onClick={() => setSlide(0)}></div>
        <div className={`dot ${slide === 1 ? 'active' : ''}`} onClick={() => setSlide(1)}></div>
        <div className={`dot ${slide === 2 ? 'active' : ''}`} onClick={() => setSlide(2)}></div>
      </div>
    </section>
  );
};

export default Hero;
