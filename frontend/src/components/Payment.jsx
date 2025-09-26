import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Payment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [userRole, setUserRole] = useState('free');

  useEffect(() => {
    // Check user's current role
    checkUserRole();
  }, []);

  const checkUserRole = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/payment/status`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setUserRole(response.data.role);
      setSuccess(response.data.isPremium);
    } catch (error) {
      console.error('Error checking user role:', error);
    }
  };

  const handlePayment = async () => {
    setLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      
      // Create order
      const orderResponse = await axios.post(`${import.meta.env.VITE_API_URL}/api/payment/order`, {
        amount: 9900, // 99 INR in paise
        currency: 'INR'
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Using environment variable
        amount: orderResponse.data.amount,
        currency: orderResponse.data.currency,
        name: 'ZioraAi',
        description: 'Premium Subscription',
        order_id: orderResponse.data.orderId,
        handler: async function (response) {
          try {
            // Verify payment
            const verifyResponse = await axios.post(`${import.meta.env.VITE_API_URL}/api/payment/verify`, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            }, {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            });
            
            if (verifyResponse.data.role === 'premium') {
              setUserRole('premium');
              setSuccess(true);
              alert('Payment successful! You are now a premium user.');
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            setError('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: 'User Name',
          email: 'user@example.com'
        },
        theme: {
          color: '#3b82f6'
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Payment error:', error);
      setError('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (userRole === 'premium') {
    return (
      <div className="payment-container card">
        <h2>Premium Account</h2>
        <p>You are already a premium user. Enjoy all the benefits!</p>
        <div className="premium-benefits">
          <h3>Premium Benefits:</h3>
          <ul>
            <li>Access to all AI models</li>
            <li>Higher usage limits</li>
            <li>Priority support</li>
            <li>Early access to new features</li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-container card">
      <h2>Upgrade to Premium</h2>
      <div className="pricing-card">
        <h3>Premium Plan</h3>
        <div className="price">
          <span className="amount">₹99</span>
          <span className="period">/month</span>
        </div>
        <ul className="features">
          <li>✓ Access to all AI models</li>
          <li>✓ Higher usage limits</li>
          <li>✓ Priority support</li>
          <li>✓ Early access to new features</li>
        </ul>
        <button 
          className="btn btn-primary"
          onClick={handlePayment}
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Upgrade Now'}
        </button>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="payment-info">
        <p>Secure payment powered by Razorpay</p>
      </div>
    </div>
  );
};

export default Payment;