const Razorpay = require('razorpay');
const crypto   = require('crypto');
const User     = require('../models/User');

const razorpay = new Razorpay({
  key_id:     process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const PLANS = {
  monthly: { amount: 19900, duration: 30  }, // ₹199 in paise
  annual:  { amount: 149900, duration: 365 } // ₹1499 in paise
};

// ── CREATE ORDER ──
exports.createOrder = async (req, res) => {
  try {
    const { billing = 'monthly' } = req.body;
    const plan = PLANS[billing];

    if (!plan) {
      return res.status(400).json({ message: 'Invalid billing type' });
    }

    const order = await razorpay.orders.create({
      amount:   plan.amount,
      currency: 'INR',
      notes: {
        userId:  req.userId.toString(),
        billing,
        plan:    'pro'
      }
    });

    res.json({
      orderId:   order.id,
      amount:    order.amount,
      currency:  order.currency,
      keyId:     process.env.RAZORPAY_KEY_ID,
      billing,
      user: {
        name:  req.user.name,
        email: req.user.email,
      }
    });
  } catch (err) {
    console.error('[Payment] Create order error:', err.message);
    res.status(500).json({ message: 'Failed to create order' });
  }
};

// ── VERIFY PAYMENT ──
exports.verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      billing = 'monthly'
    } = req.body;

    // verify signature
    const body   = razorpay_order_id + '|' + razorpay_payment_id;
    const expected = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expected !== razorpay_signature) {
      return res.status(400).json({
        message: 'Payment verification failed — invalid signature'
      });
    }

    // calculate expiry
    const days   = PLANS[billing]?.duration || 30;
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + days);

    // upgrade user
    await User.findByIdAndUpdate(req.userId, {
      plan:           'pro',
      planExpiry:     expiry,
      planBilling:    billing,
    });

    console.log(`[Payment] User ${req.userId} upgraded to Pro (${billing})`);

    res.json({
      success: true,
      message: 'Payment verified! Welcome to Pro! 🎉',
      plan:    'pro',
      expiry:  expiry.toISOString()
    });

  } catch (err) {
    console.error('[Payment] Verify error:', err.message);
    res.status(500).json({ message: 'Payment verification failed' });
  }
};

// ── GET PLAN STATUS ──
exports.getPlanStatus = async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .select('plan planExpiry planBilling');

    // auto-expire pro plan
    if (user.plan === 'pro' && user.planExpiry) {
      if (new Date() > new Date(user.planExpiry)) {
        await User.findByIdAndUpdate(req.userId, {
          plan:        'free',
          planExpiry:  null,
          planBilling: null,
        });
        return res.json({ plan: 'free', expired: true });
      }
    }

    res.json({
      plan:       user.plan,
      expiry:     user.planExpiry,
      billing:    user.planBilling,
      daysLeft:   user.planExpiry
        ? Math.ceil((new Date(user.planExpiry) - new Date()) / (1000 * 60 * 60 * 24))
        : null
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// ── CANCEL PLAN ──
exports.cancelPlan = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.userId, {
      plan:        'free',
      planExpiry:  null,
      planBilling: null,
    });
    res.json({ message: 'Plan cancelled. Downgraded to free.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};