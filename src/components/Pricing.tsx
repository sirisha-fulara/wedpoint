import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import './Pricing.css';

const plans = [
  {
    name: 'Basic Plan',
    price: '₹299',
    desc: 'Perfect for simple and elegant digital invites.',
    features: ['1 Editable template', 'HD Static Image format', 'Instant download', 'Basic text customization'],
    isPopular: false
  },
  {
    name: 'Premium Plan',
    price: '₹599',
    desc: 'Make it special with music and animations.',
    features: ['Premium animated template', 'Background music support', 'HD Video (MP4) format', 'Up to 5 couple photos', 'WhatsApp share ready'],
    isPopular: true
  },
  {
    name: 'Custom Design',
    price: '₹1499',
    desc: 'A completely unique design just for you.',
    features: ['Fully personalized design', 'Dedicated designer', 'Custom illustrations', 'Unlimited revisions', 'Priority support'],
    isPopular: false
  }
];

const Pricing = () => {
  return (
    <section id="pricing" className="pricing-section py-20">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="section-title">Transparent Pricing</h2>
          <p className="section-subtitle">Choose the perfect plan for your special day. No hidden fees.</p>
        </div>

        <div className="pricing-grid">
          {plans.map((plan, index) => (
            <motion.div 
              key={index}
              className={`pricing-card card ${plan.isPopular ? 'popular-plan' : ''}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              viewport={{ once: true, margin: "-50px" }}
            >
              {plan.isPopular && <div className="popular-badge">Most Popular</div>}
              
              <div className="pricing-header">
                <h3>{plan.name}</h3>
                <p className="plan-desc">{plan.desc}</p>
                <div className="plan-price">
                  <span className="currency">₹</span>
                  <span className="amount">{plan.price.replace('₹', '')}</span>
                </div>
              </div>
              
              <ul className="pricing-features">
                {plan.features.map((feature, i) => (
                  <li key={i}>
                    <Check size={18} className="check-icon" />
                    {feature}
                  </li>
                ))}
              </ul>
              
              <button className={`btn btn-block ${plan.isPopular ? 'btn-primary' : 'btn-secondary'}`}>
                Choose {plan.name}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
