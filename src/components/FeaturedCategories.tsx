import { motion } from 'framer-motion';
import { Sparkles, Video, Smartphone, Calendar, Flower2 } from 'lucide-react';
import './FeaturedCategories.css';

const categories = [
  { id: 1, title: 'Traditional Indian', icon: <Flower2 />, image: 'https://images.unsplash.com/photo-1588682283084-3c6628b05615?w=500&q=80', span: 2 },
  { id: 2, title: 'Animated Video', icon: <Video />, image: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=500&q=80', span: 1 },
  { id: 3, title: 'Modern Minimal', icon: <Sparkles />, image: 'https://images.unsplash.com/photo-1544431945-8ced4bfaa6a2?w=500&q=80', span: 1 },
  { id: 4, title: 'Save The Date', icon: <Calendar />, image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=500&q=80', span: 1 },
  { id: 5, title: 'WhatsApp Invites', icon: <Smartphone />, image: 'https://images.unsplash.com/photo-1522008342704-6b26c3104e02?w=500&q=80', span: 1 },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const FeaturedCategories = () => {
  return (
    <section id="templates" className="categories-section py-20">
      <div className="container">
        <div className="text-center mb-8">
          <h2 className="section-title">Explore by Category</h2>
          <p className="section-subtitle">Find the perfect design that matches your wedding theme and personal style.</p>
        </div>
        
        <motion.div 
          className="bento-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {categories.map((cat) => (
            <motion.div 
              key={cat.id} 
              className={`bento-card span-${cat.span}`}
              variants={itemVariants}
            >
              <div className="bento-image">
                <img src={cat.image} alt={cat.title} />
              </div>
              <div className="bento-overlay"></div>
              <div className="bento-content">
                <div className="bento-icon">{cat.icon}</div>
                <h3>{cat.title}</h3>
                <span className="bento-link">Explore Designs <span className="arrow">→</span></span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedCategories;
