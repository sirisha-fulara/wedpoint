import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import './FAQ.css';

const faqs = [
  {
    question: 'Can I edit the invitation after purchase?',
    answer: 'Yes, absolutely! You can edit your invitation layout, text, and photos anytime before downloading the final file.'
  },
  {
    question: 'Can I add my own photos?',
    answer: 'Yes, our premium templates allow you to upload beautiful couple photos and personalize the design to make it truly yours.'
  },
  {
    question: 'How will I receive my invitation?',
    answer: 'Once you finish customizing, you can instantly download your invitation as an HD image or video file. You can then share it directly via WhatsApp, email, or your social networks.'
  },
  {
    question: 'Do you provide printing services?',
    answer: 'Currently, we focus on digital templates that you can download and print locally or share digitally. However, our designs are completely print-ready and high resolution.'
  }
];

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="faq-section py-20">
      <div className="container">
        <div className="faq-layout">
          <div className="faq-text">
            <h2 className="section-title">Frequently Asked<br />Questions</h2>
            <p className="section-subtitle mb-0">Everything you need to know about our invitation templates and services.</p>
          </div>
          
          <div className="faq-accordion">
            {faqs.map((faq, index) => (
              <motion.div 
                key={index} 
                className={`faq-item ${activeIndex === index ? 'active' : ''}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div 
                  className="faq-question" 
                  onClick={() => toggleAccordion(index)}
                >
                  <h3>{faq.question}</h3>
                  <div className={`faq-icon ${activeIndex === index ? 'rotated' : ''}`}>
                    <ChevronDown size={20} />
                  </div>
                </div>
                
                <AnimatePresence>
                  {activeIndex === index && (
                    <motion.div 
                      className="faq-answer"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="faq-answer-inner">
                        <p>{faq.answer}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
