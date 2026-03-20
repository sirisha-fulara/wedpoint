import { motion } from 'framer-motion';
import './AboutUs.css';

const AboutUs = () => {
  return (
    <section id="about" className="about-section py-20">
      <div className="container about-container">
        <motion.div 
          className="about-image-wrapper"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="about-image">
            <img src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80" alt="Beautiful wedding moments" />
          </div>
          <div className="about-decoration"></div>
        </motion.div>
        
        <motion.div 
          className="about-content"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <h2 className="section-title">About Us</h2>
          <h3 className="about-subtitle">Crafting memories, one invitation at a time.</h3>
          <p className="about-text">
            We help couples create beautiful wedding invitations quickly and easily. 
            Our goal is to make wedding invitation design simple, affordable, and memorable for everyone.
          </p>
          <p className="about-text">
            With years of experience in design and motion graphics, we bring you 
            highly premium templates—from elegant traditional mandaps to modern minimal designs 
            and fully animated video invitations. We believe that sharing the joy of your big day 
            should be as magical as the event itself.
          </p>
          
          <div className="about-stats">
            <div className="stat">
              <h4>10k+</h4>
              <p>Happy Couples</p>
            </div>
            <div className="stat">
              <h4>1000+</h4>
              <p>Premium Designs</p>
            </div>
            <div className="stat">
              <h4>5★</h4>
              <p>Average Rating</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutUs;
