import Stripe from 'stripe';
import User from '../user/user.model.js';

let stripeInstance;
const getStripe = () => {
  if (!stripeInstance) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('Neither apiKey nor config.authenticator provided. Please set STRIPE_SECRET_KEY in your .env file.');
    }
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);
  }
  return stripeInstance;
};

// POST /api/payments/create-checkout-session
export const createCheckoutSession = async (req, res) => {
  try {
    const stripe = getStripe();
    const { plan } = req.body; 
    
    const isYearly = plan === 'yearly';
    const envPriceId = isYearly ? process.env.STRIPE_YEARLY_PRICE_ID : process.env.STRIPE_MONTHLY_PRICE_ID;

    // Use environment-configured price IDs if present, otherwise construct dynamic recurring price_data
    const line_items = envPriceId && envPriceId.startsWith('price_')
      ? [
          {
            price: envPriceId,
            quantity: 1,
          },
        ]
      : [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: isYearly ? 'Digital Heroes - Annual Membership' : 'Digital Heroes - Monthly Membership',
                description: '5-Score Rolling History, Monthly Prize Draws & Charity Allocations',
              },
              unit_amount: isYearly ? 12000 : 1200, // $120.00 / $12.00 in cents
              recurring: {
                interval: isYearly ? 'year' : 'month',
              },
            },
            quantity: 1,
          },
        ];

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer_email: req.user.email,
      client_reference_id: req.user._id.toString(),
      line_items,
      success_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/dashboard?success=true`,
      cancel_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/dashboard?canceled=true`,
    });

    res.status(200).json({ url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ message: error.message || 'Error creating checkout session' });
  }
};

// POST /api/payments/webhook
export const handleStripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    const stripe = getStripe();
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle subscription lifecycle events
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const userId = session.client_reference_id;

    await User.findByIdAndUpdate(userId, {
      'subscription.status': 'active',
      'subscription.stripeCustomerId': session.customer,
      'subscription.stripeSubscriptionId': session.subscription,
    });
  }

  if (event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object;
    await User.findOneAndUpdate(
      { 'subscription.stripeSubscriptionId': subscription.id },
      { 'subscription.status': 'canceled' }
    );
  }

  res.status(200).json({ received: true });
};