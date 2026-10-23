import express from 'express';
import { createCheckoutSession, handleStripeWebhook } from './payment.controller.js';
import { protect } from '../../middleware/auth.middleware.js';

const router = express.Router();

router.post('/webhook', express.raw({ type: 'application/json' }), handleStripeWebhook);
router.use(protect);
router.post('/create-checkout-session', createCheckoutSession);

export default router;