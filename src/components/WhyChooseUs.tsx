import { motion } from 'framer-motion';
import { Palette, Sliders, Download, Tag, } from 'lucide-react';
import './WhyChooseUs.css';

const reasons = [
  { icon: <Palette size={32} />, title: 'Premium Templates', desc: 'Exclusive designs crafted by expert wedding designers.' },
  { icon: <Sliders size={32} />, title: 'Easy Customization', desc: 'Personalize fonts, colors, and layout in seconds.' },
  { icon: <Download size={32} />, title: 'Instant Download', desc: 'Get your high-resolution files immediately after checkout.' },
  { icon: <Tag size={32} />, title: 'Affordable Pricing', desc: 'Luxury designs at a fraction of traditional printing costs.' },
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
