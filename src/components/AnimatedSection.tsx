import { motion } from 'framer-motion';
import { Film, Music, Download, Smartphone, Play } from 'lucide-react';
import './AnimatedSection.css';

const features = [
  { icon: <Film size={24} />, text: 'HD video invitation' },
  { icon: <Music size={24} />, text: 'Couple photos & music support' },
  { icon: <Download size={24} />, text: 'Instant download' },
  { icon: <Smartphone size={24} />, text: 'Mobile friendly & WhatsApp ready' },
];

const AnimatedSection = () => {
  return (
    <section className="animated-section py-20">
      <div className="container animated-container">
        <motion.div 
          className="animated-content"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="badge-dark">Premium Video Invites</div>
          <h2 className="section-title dark-title">
            Make Your Wedding<br />Invitation Come Alive <span className="ring-emoji">🎬</span>
          </h2>
          <p className="section-subtitle dark-subtitle">
            Send stunning animated video invitations that tell your love story. 
            Perfect for WhatsApp sharing and social media. Let your guests experience 
            the magic before the big day.
          </p>
          
          <ul className="animated-features-list">
            {features.map((feature, index) => (
              <motion.li 
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 + (index * 0.1) }}
                viewport={{ once: true }}
              >
                <span className="feature-icon">{feature.icon}</span>
                <span>{feature.text}</span>
              </motion.li>
            ))}
          </ul>
          
          <button className="btn btn-primary btn-lg mt-8">Explore Video Templates</button>
        </motion.div>
        
        <motion.div 
          className="animated-visual"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="phone-mockup">
            <div className="phone-notch"></div>
            <div className="phone-screen">
              <img src="https://images.unsplash.com/photo-1519741497674-611481863552?w=500&q=80" alt="Video Invite Preview" className="video-thumbnail" />
              <div className="play-button-overlay">
                <button className="play-btn">
                  <Play fill="white" size={32} />
                </button>
              </div>
              <div className="video-progress">
                <div className="progress-bar">
                  <div className="progress-fill"></div>
                </div>
              </div>
            </div>
          </div>
          <div className="glow-effect"></div>
        </motion.div>
      </div>
    </section>
  );
};

export default AnimatedSection;
