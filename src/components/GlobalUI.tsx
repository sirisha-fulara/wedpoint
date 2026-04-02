import { useUI } from '../context/UIContext';
import { X, Minus, Plus } from 'lucide-react';
import './GlobalUI.css';

const GlobalUI = () => {
  const {
    cart, isCartOpen, cartTotal, removeFromCart, changeQty, toggleCart, checkoutWA,
    notification
  } = useUI();

  return (
    <>
      {/* WHATSAPP FLOAT */}
      <a href="https://wa.me/918830659769?text=Hi! I want to order from WedMeet™ 💍" target="_blank" rel="noreferrer" className="wa-float">
        💬<span className="wa-float-tip">Order on WhatsApp</span>
      </a>

      {/* NOTIFICATION TOAST */}
      <div className={`notif ${notification ? 'show' : ''}`}>
        {notification}
      </div>

      {/* CART */}
      <div className={`cart-overlay ${isCartOpen ? 'open' : ''}`} onClick={toggleCart}></div>
      <div className={`cart-sidebar ${isCartOpen ? 'open' : ''}`}>
        <div className="cart-head">
          <h3>Your Cart</h3>
          <button className="close-btn" onClick={toggleCart}><X size={18} /></button>
        </div>
        <div className="cart-body">
          {cart.length === 0 ? (
            <div className="cart-empty">
              <span className="ei">🛒</span>
              <p>Cart is empty.<br/>Add some beautiful cards!</p>
            </div>
          ) : (
            cart.map(item => (
              <div className="cart-item" key={item.id}>
                <div className="ci-img"><img src={item.thumbnail} alt={item.name} /></div>
                <div className="ci-info">
                  <h4>{item.name}</h4>
                  <p>{item.desc}</p>
                  <div className="ci-row">
                    <div className="qty-ctrl">
                      <button className="qty-btn" onClick={() => changeQty(item.id, -1)}><Minus size={14}/></button>
                      <span className="qty-num">{item.qty}</span>
                      <button className="qty-btn" onClick={() => changeQty(item.id, 1)}><Plus size={14}/></button>
                    </div>
                    <span className="ci-price">₹{(item.price * item.qty).toLocaleString('en-IN')}</span>
                  </div>
                  <button className="ci-remove" onClick={() => removeFromCart(item.id)}>Remove</button>
                </div>
              </div>
            ))
          )}
        </div>
        {cart.length > 0 && (
          <div className="cart-foot">
            <div className="cart-total-row">
              <span className="ct-label">Total</span>
              <span className="ct-amount">₹{cartTotal.toLocaleString('en-IN')}</span>
            </div>
            <button className="checkout-btn" onClick={checkoutWA}>Order via WhatsApp →</button>
          </div>
        )}
      </div>
    </>
  );
};

export default GlobalUI;
