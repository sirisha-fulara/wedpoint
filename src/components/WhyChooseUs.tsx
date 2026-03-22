import { motion } from 'framer-motion';
import { Sliders, Share2, Clock, Brush, Diamond, Smile } from 'lucide-react';
import './WhyChooseUs.css';

const reasons = [
  { icon: <Diamond size={32} />, title: 'Premium Designs', desc: 'Carefully crafted wedding invitations with a modern and elegant touch.' },
  { icon: <Sliders size={32} />, title: 'Professional Quality', desc: 'Designed by experienced creatives with attention to every detail.' },
  { icon: <Clock size={32} />, title: 'Fast Delivery', desc: 'Get your customized invitation delivered within 3-4 days.' },
  { icon: <Brush size={32} />, title: 'Fully Personalized', desc: 'Your names, dates, photos, and style - everything tailored to you.' },
  { icon: <Share2 size={32}/> , title: 'Ready to Share', desc: 'Optimized for WhatsApp, Instagram, and all social platforms.' },
  { icon: <Smile size={32} />, title: 'Hassle-Free Process', desc: 'Just share your details, and we handle the rest.' },
];

const WhyChooseUs = () => {
  return (
    <section className="why-choose-us py-20">
      <div className="container">
        <div className="text-center mb-8">
          <h2 className="section-title">Why Choose Us</h2>
          <p className="section-subtitle">We make creating your dream wedding invitation effortless and affordable.</p>
        </div>
        
        <div className="reasons-grid">
          {reasons.map((reason, index) => (
            <motion.div 
              key={index}
              className="reason-card"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true, margin: "-50px" }}
            >
              <div className="reason-icon">{reason.icon}</div>
              <h3>{reason.title}</h3>
              <p>{reason.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
