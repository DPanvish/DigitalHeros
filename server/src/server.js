import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import mongoSanitize from 'express-mongo-sanitize';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import { connectDB } from './config/db.js';
import userRoutes from './modules/user/user.routes.js';
import scoreRoutes from './modules/score/score.routes.js';
import paymentRoutes from './modules/payment/payment.routes.js';
import charityRoutes from './modules/charity/charity.routes.js';
import drawRoutes from './modules/draw/draw.routes.js';
import adminRoutes from './modules/admin/admin.routes.js';

const app = express();

connectDB();

app.use(helmet()); 

// Express 5 query getter compatibility with express-mongo-sanitize
app.use((req, res, next) => {
  if (req.query) {
    Object.defineProperty(req, 'query', {
      value: { ...req.query },
      writable: true,
      configurable: true,
      enumerable: true,
    });
  }
  next();
});

app.use(mongoSanitize()); 


const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api', limiter); 

app.use('/api/payments/webhook', express.raw({ type: 'application/json' }), paymentRoutes);

app.use(express.json()); 
app.use(cookieParser()); 
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true, 
}));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use('/api/users', userRoutes);
app.use('/api/scores', scoreRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/charities', charityRoutes);
app.use('/api/draws', drawRoutes);
app.use('/api/admin', adminRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'success', message: 'Digital Heroes API is running.' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});