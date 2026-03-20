import { motion } from 'framer-motion';
import { LayoutTemplate, Paintbrush, Share2 } from 'lucide-react';
import './HowItWorks.css';

const steps = [
  {
    icon: <LayoutTemplate size={32} />,
    title: 'Choose Template',
    description: 'Browse our beautiful collection of wedding invitation templates matching your aesthetic.',
    number: '01'
  },
  {
    icon: <Paintbrush size={32} />,
    title: 'Customize Design',
    description: 'Add names, dates, venues, couple photos, and completely personalize the layout.',
    number: '02'
  },
  {
    icon: <Share2 size={32} />,
    title: 'Download or Share',
    description: 'Instantly download your HD file or share directly via WhatsApp, email, or social media.',
    number: '03'
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
