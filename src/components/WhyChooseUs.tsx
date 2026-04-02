import { useEffect, useRef } from 'react';
import './WhyChooseUs.css';

const WhyChooseUs = () => {
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
      const reveals = ref.current.querySelectorAll('.reveal');
      reveals.forEach(r => obs.observe(r));
    }
    return () => obs.disconnect();
  }, []);

  return (
    <section className="section" id="about" ref={ref}>
      <div className="reveal">
        <div className="sec-eye">Why WedMeet™</div>
        <h2 className="sec-title">Every Card is a <em>Masterpiece</em></h2>
      </div>
      <div className="why-grid reveal">
        <div className="why-card">
          <div className="why-icon">🎨</div>
          <h4>Custom Design</h4>
          <p>Every element personalized to match your unique wedding theme</p>
        </div>
        <div className="why-card">
          <div className="why-icon">🖨️</div>
          <h4>Premium Print</h4>
          <p>300gsm paper with gold foil & embossing options available</p>
        </div>
        <div className="why-card">
          <div className="why-icon">✉️</div>
          <h4>Pan-India Delivery</h4>
          <p>Fast delivery across India in just 3–5 business days</p>
        </div>
        <div className="why-card">
          <div className="why-icon">🎬</div>
          <h4>Video Invitations</h4>
          <p>Digital video cards delivered instantly on WhatsApp</p>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
