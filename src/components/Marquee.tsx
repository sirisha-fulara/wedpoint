import './Marquee.css';

const Marquee = () => {
  return (
    <div className="marquee">
      <div className="marquee-track">
        <span className="marquee-item">Wedding Cards</span>
        <span className="marquee-item">Digital Video Invitations</span>
        <span className="marquee-item">Custom Designs</span>
        <span className="marquee-item">WhatsApp Delivery</span>
        <span className="marquee-item">Pan India Shipping</span>
        <span className="marquee-item">Free Digital Proof</span>
        <span className="marquee-item">Nagpur Based</span>
        {/* DUPLICATE FOR SEAMLESS LOOP */}
        <span className="marquee-item">Wedding Cards</span>
        <span className="marquee-item">Digital Video Invitations</span>
        <span className="marquee-item">Custom Designs</span>
        <span className="marquee-item">WhatsApp Delivery</span>
        <span className="marquee-item">Pan India Shipping</span>
        <span className="marquee-item">Free Digital Proof</span>
        <span className="marquee-item">Nagpur Based</span>
      </div>
    </div>
  );
};

export default Marquee;
