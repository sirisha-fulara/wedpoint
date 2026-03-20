import { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit3, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTemplates } from '../context/TemplateContext';
import './PopularTemplates.css';

interface PopularTemplatesProps {
  activeCategory: string;
  isSlider?: boolean;
}

const PopularTemplates = ({ activeCategory, isSlider = false }: PopularTemplatesProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { templates, isLoading, error } = useTemplates();

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const { current } = scrollContainerRef;
      const scrollAmount = current.clientWidth * 0.8; // Scroll by 80% of container width
      
      if (direction === 'left') {
        current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  };

  const filteredTemplates = templates.filter(
    template => activeCategory === 'all' || template.religion === activeCategory
  );

  return (
    <section className={`popular-templates ${isSlider ? 'py-20' : 'pb-20'}`}>
      <div className="container">
        {isSlider && (
          <div className="templates-header">
            <div>
              <h2 className="section-title">Popular Templates</h2>
              <p className="section-subtitle mb-0">Discover our most loved wedding invitation designs by culture.</p>
            </div>
            <button className="btn btn-secondary" onClick={() => navigate('/templates')}>
              View All Designs
            </button>
          </div>
        )}

        {isSlider && (
          <div className="slider-controls">
            <button 
              className="slider-btn prev-btn" 
              onClick={() => scroll('left')}
              aria-label="Previous templates"
            >
              <ChevronLeft size={24} />
            </button>
            <button 
              className="slider-btn next-btn" 
              onClick={() => scroll('right')}
              aria-label="Next templates"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        )}

        <div className={isSlider ? "templates-slider-container" : "templates-grid-container"}>
          {error && !isSlider && (
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '1rem' }}>{error}</p>
          )}
          {isLoading && (
            <p style={{ color: 'var(--color-text-muted)' }}>Loading templates...</p>
          )}
          <motion.div 
            layout 
            className={isSlider ? "templates-slider" : "templates-grid"}
            ref={isSlider ? scrollContainerRef : null}
          >
          <AnimatePresence>
            {filteredTemplates.map((template) => (
              <motion.div 
                key={template.id}
                layout
                className="template-card card"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                onClick={() => navigate(`/template/${template.id}`)}
                style={{ cursor: 'pointer' }}
              >
                <div className="template-image-container">
                  {template.images && template.images.length > 0 ? (
                    <img src={template.images[0]} alt={template.name} className="template-image" />
                  ) : (
                    <div className="template-image" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-surface-alt)', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                      No Image Provided
                    </div>
                  )}
                  {template.badge && (
                    <span className="template-badge">{template.badge}</span>
                  )}
                  <div className="template-overlay">
                    <button className="btn btn-primary btn-customize" onClick={(e) => { e.stopPropagation(); navigate(`/template/${template.id}`); }}>
                      <Edit3 size={18} style={{ marginRight: '8px' }} /> View Details
                    </button>
                  </div>
                </div>
                <div className="template-info">
                  <span className="template-type">{template.type}</span>
                  <h3 className="template-name">{template.name}</h3>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
        </div>
      </div>
    </section>
  );
};

export default PopularTemplates;
