import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/pricing.css';

const Pricing = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('starter');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      fetchUserRole(token);
      fetchPaymentHistory(token);
    }
  }, []);

  const fetchUserRole = async (token) => {
    try {
      const response = await axios.get(`${API_URL}/api/users/profile`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setUserRole(response.data.role);
    } catch (error) {
      console.error('Error fetching user role:', error);
    }
  };

  const fetchPaymentHistory = async (token) => {
    try {
      const response = await axios.get(`${API_URL}/api/payment/history`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setPaymentHistory(response.data);
    } catch (error) {
      console.error('Error fetching payment history:', error);
    }
  };

  const handlePayment = async (plan) => {
    if (!isLoggedIn) {
      // Redirect to login page
      window.location.href = '/login';
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      
      // Create order
      const orderResponse = await axios.post(`${API_URL}/api/payment/order`, {
        plan: plan
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderResponse.data.amount,
        currency: orderResponse.data.currency,
        name: 'ZioraAi',
        description: orderResponse.data.planName,
        order_id: orderResponse.data.orderId,
        handler: async function (response) {
          try {
            // Verify payment
            const verifyResponse = await axios.post(`${API_URL}/api/payment/verify`, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              plan: plan
            }, {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            });
            
            if (verifyResponse.data.role) {
              setUserRole(verifyResponse.data.role);
              // Refresh payment history
              fetchPaymentHistory(token);
              alert(`Payment successful! You are now on the ${plan.charAt(0).toUpperCase() + plan.slice(1)} plan.`);
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            setError('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: localStorage.getItem('userName') || 'User',
          email: localStorage.getItem('userEmail') || 'user@example.com'
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const pricingPlans = [
    {
      name: "Starter",
      price: "Free",
      description: "Perfect for getting started",
      role: "starter",
      features: [
        "Access to 4 free AI models",
        "Basic chat functionality",
        "Standard response time",
        "Community support"
      ],
      models: [
        "xAI: Grok 4 Fast",
        "NVIDIA: Nemotron Nano 9B V2",
        "DeepSeek: DeepSeek V3.1",
        "OpenAI: gpt-oss-20b"
      ],
      buttonText: "Current Plan",
      disabled: userRole === 'starter'
    },
    {
      name: "Professional",
      price: "₹249",
      period: "/month",
      description: "For individuals and small teams",
      role: "professional",
      features: [
        "Access to all premium AI models",
        "Priority chat responses",
        "Enhanced accuracy",
        "Email support",
        "Early access to new features"
      ],
      models: [
        "Google: Gemma 3n 2B",
        "Meta: Llama 3.3 8B Instruct",
        "Dolphin3.0 Mistral 24B",
        "MoonshotAI: Kimi Dev 72B"
      ],
      buttonText: isLoggedIn ? "Upgrade Now" : "Login to Upgrade",
      disabled: userRole === 'professional' || userRole === 'enterprise'
    },
    {
      name: "Enterprise",
      price: "₹599",
      period: "/month",
      description: "For businesses and large teams",
      role: "enterprise",
      features: [
        "All Professional features",
        "Access to exclusive AI models",
        "Dedicated support",
        "Custom integrations",
        "Highest priority processing",
        "Early access to upcoming AI tools"
      ],
      models: [
        "Exclusive Enterprise Models",
        "Custom Model Training",
        "API Access",
        "Advanced Analytics"
      ],
      buttonText: isLoggedIn ? "Upgrade Now" : "Login to Upgrade",
      disabled: userRole === 'enterprise'
    }
  ];

  return (
    <div className="pricing-page">
      <section className="pricing-header">
        <div className="container">
          <h1>Simple, Transparent Pricing</h1>
          <p>Choose the plan that works best for you</p>
        </div>
      </section>

      <section className="pricing-content">
        <div className="container">
          <div className="pricing-grid">
            {pricingPlans.map((plan, index) => (
              <div 
                key={index} 
                className={`pricing-card ${plan.role === userRole ? 'active' : ''} ${plan.role === 'enterprise' ? 'featured' : ''}`}
              >
                {plan.role === 'enterprise' && (
                  <div className="featured-badge">Most Popular</div>
                )}
                <div className="pricing-header">
                  <h2>{plan.name}</h2>
                  <div className="price">
                    <span className="amount">{plan.price}</span>
                    {plan.period && <span className="period">{plan.period}</span>}
                  </div>
                  <p className="description">{plan.description}</p>
                </div>
                
                <ul className="features">
                  {plan.features.map((feature, idx) => (
                    <li key={idx}>{feature}</li>
                  ))}
                </ul>
                
                <div className="models-section">
                  <h3>Included Models:</h3>
                  <ul className="models-list">
                    {plan.models.map((model, idx) => (
                      <li key={idx}>{model}</li>
                    ))}
                  </ul>
                </div>
                
                <button 
                  className={`btn ${plan.role === userRole ? 'btn-secondary' : 'btn-primary'}`}
                  onClick={() => handlePayment(plan.role)}
                  disabled={plan.disabled || loading}
                >
                  {plan.disabled ? plan.buttonText : (loading ? 'Processing...' : plan.buttonText)}
                </button>
              </div>
            ))}
          </div>
          
          {isLoggedIn && paymentHistory.length > 0 && (
            <div className="payment-history">
              <div className="history-header">
                <h3>Payment History</h3>
                <button 
                  className="toggle-history"
                  onClick={() => setShowHistory(!showHistory)}
                >
                  {showHistory ? 'Hide' : 'Show'} History
                </button>
              </div>
              
              {showHistory && (
                <div className="history-content">
                  <table className="history-table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Plan</th>
                        <th>Amount</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paymentHistory.map((payment, index) => (
                        <tr key={index}>
                          <td>{formatDate(payment.createdAt)}</td>
                          <td>{payment.plan.charAt(0).toUpperCase() + payment.plan.slice(1)}</td>
                          <td>₹{payment.amount / 100}</td>
                          <td>
                            <span className={`status ${payment.status}`}>
                              {payment.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
          
          {error && <div className="error-message">{error}</div>}
          
          {!isLoggedIn && (
            <div className="login-prompt">
              <p>Already have an account? <a href="/login">Login</a> to manage your subscription</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Pricing;