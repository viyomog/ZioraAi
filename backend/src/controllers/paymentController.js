const Razorpay = require('razorpay');
const User = require('../models/User');
const Payment = require('../models/Payment');

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_your_key_id',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'your_key_secret'
});

// Create order
const createOrder = async (req, res) => {
  try {
    const { plan } = req.body;
    
    // Define pricing plans
    const plans = {
      professional: {
        amount: 24900, // ₹249 in paise
        name: 'Professional Plan'
      },
      enterprise: {
        amount: 59900, // ₹599 in paise
        name: 'Enterprise Plan'
      }
    };
    
    // Validate plan
    if (!plans[plan]) {
      return res.status(400).json({ message: 'Invalid plan' });
    }

    // Create order options
    const options = {
      amount: plans[plan].amount.toString(),
      currency: 'INR',
      receipt: `receipt_order_${Date.now()}`,
      payment_capture: 1
    };

    // Create order
    const order = await razorpay.orders.create(options);
    
    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      plan: plan,
      planName: plans[plan].name
    });
  } catch (error) {
    console.error('Razorpay Order Error:', error);
    res.status(500).json({ message: 'Error creating order' });
  }
};

// Verify payment
const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, plan } = req.body;
    
    // Verify the payment signature
    const crypto = require('crypto');
    const shasum = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'your_key_secret');
    shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const digest = shasum.digest('hex');
    
    if (digest !== razorpay_signature) {
      // Save failed payment record
      await Payment.create({
        userId: req.user.id,
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        amount: plan === 'professional' ? 24900 : 59900,
        currency: 'INR',
        plan: plan,
        status: 'failed'
      });
      
      return res.status(400).json({ message: 'Payment verification failed' });
    }

    // Save successful payment record
    const paymentRecord = await Payment.create({
      userId: req.user.id,
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
      amount: plan === 'professional' ? 24900 : 59900,
      currency: 'INR',
      plan: plan,
      status: 'completed'
    });

    // Update user role based on plan
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Set user role based on plan
    if (plan === 'professional') {
      user.role = 'professional';
    } else if (plan === 'enterprise') {
      user.role = 'enterprise';
    }
    
    await user.save();

    res.json({
      message: 'Payment verified successfully',
      role: user.role,
      paymentId: paymentRecord._id
    });
  } catch (error) {
    console.error('Payment Verification Error:', error);
    res.status(500).json({ message: 'Error verifying payment' });
  }
};

// Get payment status
const getPaymentStatus = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      role: user.role
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user payment history
const getPaymentHistory = async (req, res) => {
  try {
    const payments = await Payment.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(10); // Get last 10 payments
    
    res.json(payments);
  } catch (error) {
    console.error('Payment History Error:', error);
    res.status(500).json({ message: 'Error fetching payment history' });
  }
};

module.exports = {
  createOrder,
  verifyPayment,
  getPaymentStatus,
  getPaymentHistory
};