import { motion } from 'framer-motion';
import { ArrowRight, PlayCircle, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Hero.css';

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="hero">
      <div className="hero-bg">
        <div className="hero-blob hero-blob-1"></div>
        <div className="hero-blob hero-blob-2"></div>
        <div className="hero-veil"></div>
      </div>

      <div className="container hero-container">
        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <motion.div
            className="hero-badge"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15, duration: 0.4 }}
          >
            <Star size={14} fill="currentColor" />
            <span>Create Elegant Digital Wedding Invitations That Impress</span>
          </motion.div>

          <h1 className="hero-title">
            Subtle, graceful  
            <br />
            <span className="text-gradient">wedding invitations</span>
            <br />
            that feel personal from the very first glance.
          </h1>

          <p className="hero-subtitle">
            Choose a refined template, share your details once, and receive a polished invite ready for WhatsApp, PDF, or video delivery.
          </p>

          <div className="hero-cta">
            <motion.button
              className="btn btn-primary btn-lg"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/templates')}
            >
              Explore Designs <ArrowRight size={18} />
            </motion.button>
            <motion.button
              className="btn btn-secondary btn-lg"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/about')}
            >
              <PlayCircle size={18} /> See Process
            </motion.button>
          </div>

          <div className="hero-features">
            <span>Video + PDF formats</span>
            <span className="dot"></span>
            <span>WhatsApp-ready delivery</span>
            <span className="dot"></span>
            <span>Custom edits included</span>
          </div>
        </motion.div>

        <motion.div
          className="hero-visual"
          initial={{ opacity: 0, x: 28 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <div className="hero-preview">
            <div className="preview-shell">
              <div className="preview-board">
                <div className="leaf leaf-1"></div>
                <div className="leaf leaf-2"></div>
                <div className="leaf leaf-3"></div>
                <div className="leaf leaf-4"></div>
                <div className="leaf leaf-5"></div>
                <div className="leaf leaf-6"></div>

                <div className="preview-card preview-card-main">
                  <p className="preview-label">WedMeet Invite</p>
                  <h2>Aarya & Kabir</h2>
                  <p className="preview-date">24 November 2026</p>
                </div>

                <div className="preview-card preview-card-side">
                  <p className="preview-label">Details</p>
                  <p className="preview-side-copy">Elegant layouts with polished typography and calm, pastel presentation.</p>
                </div>

                <div className="preview-card preview-card-small">
                  <p className="preview-label">Venue</p>
                  <p className="preview-location">Jaipur, Rajasthan</p>
                </div>

                <div className="preview-envelope">
                  <span>WM</span>
                </div>
              </div>

              <div className="preview-stats">
                <div>
                  <strong>02-03 Days</strong>
                  <span>delivery time</span>
                </div>
                <div>
                  <strong>Video + PDF</strong>
                  <span>share formats</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
