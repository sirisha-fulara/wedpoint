import { motion } from 'framer-motion';
import { LayoutTemplate, Share2, Palette, PersonStanding } from 'lucide-react';
import './HowItWorks.css';

const steps = [
  {
    icon: <LayoutTemplate size={32} />,
    title: 'Choose your Design',
    description: 'Browse our collection and select a wedding invitation that matches your style.',
    number: '01'
  },
  {
    icon: <PersonStanding size={32} />,
    title: 'Share Your Details',
    description: 'Send us your names, date, venue, photos, and any custom preferences.',
    number: '02'
  },
  {
    icon: <Palette size={32} />,
    title: 'We Design for You',
    description: 'Our team creates your personalized invitation with a premium touch.',
    number: '03'
  },
  {
    icon: <Share2 size={32} />,
    title: 'Delivered in 3-4 Days',
    description: 'Receive your ready-to-share digital invitation within 3-4 days.',
    number: '04'
  }
];

const HowItWorks = () => {
  return (
    <section className="how-it-works py-20">
      <div className="container">
        <div className="text-center mb-8">
          <h2 className="section-title">How It Works</h2>
          <p className="section-subtitle">Create your dream wedding invitation in three simple steps.</p>
        </div>
        
        <div className="steps-container">
          {steps.map((step, index) => (
            <motion.div 
              key={index}
              className="step-card card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true, margin: "-50px" }}
            >
              <div className="step-number">{step.number}</div>
              <div className="step-icon">
                {step.icon}
              </div>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
