import { useState, useEffect, useRef } from 'react';
import { useTemplates } from '../context/TemplateContext';
import type { Template } from '../context/TemplateContext';
import { useUI } from '../context/UIContext';
import { useNavigate } from 'react-router-dom';
import './PopularTemplates.css';

interface Props {
  initialFilter?: string;
  limit?: number;
  showViewAll?: boolean;
}

const PopularTemplates = ({ initialFilter = 'all', limit, showViewAll }: Props) => {
  const { templates, isLoading } = useTemplates();
  const { addToCart } = useUI();
  const [filter, setFilter] = useState(initialFilter);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Reveal animation
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
  }, [filter, templates, isLoading]);

  // Adapt the filter logic. The HTML had categories: traditional, modern, floral, royal, minimal, video.
  // We'll map template 'religion', 'badge', 'type' loosely since we may not have exact styles.
  const filteredTemplates = templates.filter(t => {
    if (filter === 'all') return true;
    if (filter === 'video') return t.type === 'video';
    // Mappings based on keywords
    const desc = (t.name + ' ' + t.description).toLowerCase();
    return desc.includes(filter);
  });

  const displayedTemplates = limit ? filteredTemplates.slice(0, limit) : filteredTemplates;

  if (isLoading) {
    return <section className="section text-center"><p style={{color: 'rgba(255,255,255,0.4)'}}>Loading templates...</p></section>;
  }

  return (
    <section className="section" id="products" ref={ref}>
      <div className="reveal">
        <div className="sec-eye">Browse by Style</div>
        <h2 className="sec-title">Our <em>Collections</em></h2>
        <div className="cat-row">
          <button className={`cat-pill ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>All</button>
          <button className={`cat-pill ${filter === 'traditional' ? 'active' : ''}`} onClick={() => setFilter('traditional')}>Traditional</button>
          <button className={`cat-pill ${filter === 'modern' ? 'active' : ''}`} onClick={() => setFilter('modern')}>Modern</button>
          <button className={`cat-pill ${filter === 'floral' ? 'active' : ''}`} onClick={() => setFilter('floral')}>Floral</button>
          <button className={`cat-pill ${filter === 'royal' ? 'active' : ''}`} onClick={() => setFilter('royal')}>Royal</button>
          <button className={`cat-pill ${filter === 'minimal' ? 'active' : ''}`} onClick={() => setFilter('minimal')}>Minimal</button>
          <button 
            className={`cat-pill ${filter === 'video' ? 'active' : ''}`} 
            style={filter !== 'video' ? { color: 'var(--green-l)', borderColor: 'rgba(106,171,112,0.3)' } : {}}
            onClick={() => setFilter('video')}
          >
            🎬 Digital Video
          </button>
        </div>
      </div>

      <div className="product-grid reveal">
        {displayedTemplates.length === 0 ? (
          <p style={{ gridColumn: '1/-1', textAlign: 'center', color: 'rgba(255,255,255,0.3)', padding: '50px' }}>
            No designs found.
          </p>
        ) : (
          displayedTemplates.map((p: Template, i) => {
            const isVideo = p.type === 'video';
            const thumbnail = p.images?.[0] || 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80';
            const badgeClass = p.badge && p.badge.toLowerCase() === 'new' ? 'badge-new' : (isVideo ? 'badge-digital' : '');

            return (
              <div 
                className="product-card reveal" 
                key={p.id} 
                style={{ transitionDelay: `${Math.min(i * 0.07, 0.5)}s` }}
                onClick={() => navigate(`/template/${p.id}`)}
              >
                <div className="product-thumb">
                  <img src={thumbnail} alt={p.name} loading="lazy" />
                  <div className="product-thumb-overlay"></div>
                  {isVideo && <div className="play-btn">▶</div>}
                  {p.badge && <span className={`product-badge ${badgeClass}`}>{p.badge}</span>}
                  {isVideo && <span className="digital-label">📲 Online Delivery</span>}
                </div>
                <div className="product-info">
                  <h3>{p.name}</h3>
                  <p className="meta">{p.description?.substring(0, 40) || (isVideo ? 'Digital Video · WhatsApp' : 'Set of 50 · Printed Card')}</p>
                  <div className="product-footer">
                    <div className="price">
                      {p.price.replace(/[^\d₹.,]/g, '')}
                      <sub>/{isVideo ? 'video' : 'set'}</sub>
                    </div>
                    <button className="add-btn" onClick={(e) => { e.stopPropagation(); addToCart(p); }}>
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {showViewAll && (
        <div className="text-center" style={{ marginTop: '40px' }}>
          <button className="btn-secondary" style={{ padding: '12px 28px', background: 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '40px', cursor: 'pointer', fontFamily: 'Outfit' }} onClick={() => navigate('/templates')}>
            View All Designs →
          </button>
        </div>
      )}
    </section>
  );
};

export default PopularTemplates;
