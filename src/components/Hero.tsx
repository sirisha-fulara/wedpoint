import { motion } from 'framer-motion';
import { ArrowRight, PlayCircle, Sparkles, Star } from 'lucide-react';
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
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="hero-badge"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Star size={14} fill="currentColor" />
            <span>Pastel invitation studio for digital and printed celebrations</span>
          </motion.div>

          <h1 className="hero-title">
            Subtle, graceful
            <span className="text-gradient"> wedding invitations </span>
            that feel personal from the very first glance.
          </h1>

          <p className="hero-subtitle">
            Browse refined templates, preview photos, video, and PDF in one place, then customize everything with a smooth WhatsApp-first ordering flow.
          </p>

          <div className="hero-cta">
            <motion.button
              className="btn btn-primary btn-lg"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/templates')}
            >
              Explore Templates <ArrowRight size={18} />
            </motion.button>
            <motion.button
              className="btn btn-secondary btn-lg"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/about')}
            >
              <PlayCircle size={18} /> Our Process
            </motion.button>
          </div>

          <div className="hero-features">
            <span><strong>Multi-photo</strong> previews</span>
            <span className="dot"></span>
            <span><strong>Video + PDF</strong> popups</span>
            <span className="dot"></span>
            <span><strong>WhatsApp</strong> custom orders</span>
          </div>
        </motion.div>

        <motion.div
          className="hero-visual"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.35 }}
        >
          <div className="hero-visual-stack">
            <div className="floating-tag floating-tag-left">
              <Sparkles size={14} /> Pastel florals
            </div>
            <div className="floating-tag floating-tag-right">
              <Sparkles size={14} /> Soft motion previews
            </div>
            <div className="card-3d-wrapper">
              <motion.div
                className="card-envelope"
                animate={{
                  rotateY: [0, -14, 0],
                  rotateX: [0, 4, 0],
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <div className="card-face card-front glass">
                  <div className="card-border">
                    <div className="card-ornament top-left"></div>
                    <div className="card-ornament top-right"></div>
                    <div className="card-ornament bottom-left"></div>
                    <div className="card-ornament bottom-right"></div>
                    <p className="card-kicker">Together with their families</p>
                    <h2>Aarya & Kabir</h2>
                    <p className="card-date">24 . 11 . 2026</p>
                    <p className="card-location">The Grand Pavilion, Jaipur</p>
                  </div>
                </div>
                <div className="card-face card-back"></div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
