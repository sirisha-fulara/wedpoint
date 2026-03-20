import { useState } from 'react';
import PopularTemplates from '../components/PopularTemplates';

import './Templates.css';

const Templates = () => {
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'All Designs' },
    { id: 'hindu', label: 'Hindu' },
    { id: 'muslim', label: 'Islamic' },
    { id: 'sikh', label: 'Sikh' },
    { id: 'christian', label: 'Christian' }
  ];

  return (
    <main className="templates-page">
      <div className="container">
        <div className="templates-header-section">
          <div>
            <h1 className="templates-page-title">
              Browse Templates
            </h1>
            <p className="templates-page-subtitle">
              Find the perfect design for your special day.
            </p>
          </div>

          <div className="category-dropdown-container" style={{ position: 'relative' }}>
             <select 
               className="category-select" 
               value={activeCategory} 
               onChange={(e) => setActiveCategory(e.target.value)}
               style={{
                 padding: '0.75rem 1.5rem',
                 borderRadius: '50px',
                 border: '1px solid var(--color-border)',
                 background: 'var(--color-surface)',
                 color: 'var(--color-secondary)',
                 fontFamily: 'var(--font-body)',
                 fontWeight: 500,
                 cursor: 'pointer',
                 outline: 'none',
                 minWidth: '200px',
                 boxShadow: 'var(--shadow-sm)'
               }}
             >
               {categories.map((cat) => (
                 <option key={cat.id} value={cat.id}>
                   {cat.label}
                 </option>
               ))}
             </select>
          </div>
        </div>
      </div>
      
      <PopularTemplates activeCategory={activeCategory} />
    </main>
  );
};

export default Templates;
