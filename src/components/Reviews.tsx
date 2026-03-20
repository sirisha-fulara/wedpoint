import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import './Reviews.css';

const reviews = [
  {
    name: 'Priya & Arjun',
    text: '"The invitation templates are beautiful and very easy to customize! We saved so much time and the quality is stunning."',
    rating: 5
  },
  {
    name: 'Neha & Rohit',
    text: '"We loved the animated wedding invite. Our guests were impressed! Highly recommended for quick and modern invites."',
    rating: 5
  },
  {
    name: 'Aditi & Rahul',
    text: '"Absolutely brilliant design options. The Whatsapp sharing feature made our lives so much easier. Thank you!"',
    rating: 5
  }
];

const Reviews = () => {
  return (
    <section className="reviews-section py-20">
      <div className="container">
        <div className="text-center mb-8">
          <h2 className="section-title">Customer Reviews</h2>
          <p className="section-subtitle">See what happy couples are saying about our wedding invitations.</p>
        </div>
        
        <div className="reviews-grid">
          {reviews.map((review, index) => (
            <motion.div 
              key={index}
              className="review-card card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              viewport={{ once: true, margin: "-50px" }}
            >
              <div className="stars">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} size={18} fill="currentColor" className="star-icon" />
                ))}
              </div>
              <p className="review-text">{review.text}</p>
              <h4 className="review-author">— {review.name}</h4>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Reviews;
