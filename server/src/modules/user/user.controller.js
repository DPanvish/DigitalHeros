import User from './user.model.js';
import jwt from 'jsonwebtoken';

const generateToken = (res, userId) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '30d' });
  const isProd = process.env.NODE_ENV === 'production' || !!process.env.VERCEL;
  res.cookie('jwt', token, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    maxAge: 30 * 24 * 60 * 60 * 1000
  });
};

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;

// POST /api/users/register
export const registerUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !EMAIL_REGEX.test(email)) {
    return res.status(400).json({ message: 'Please provide a valid email address.' });
  }

  if (!password || !PASSWORD_REGEX.test(password)) {
    return res.status(400).json({ 
      message: 'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.' 
    });
  }

  const userExists = await User.findOne({ email });
  if (userExists) return res.status(400).json({ message: 'User already exists' });

  const user = await User.create({ email, password });
  if (user) {
    generateToken(res, user._id);
    res.status(201).json({ 
      _id: user._id, 
      email: user.email, 
      role: user.role,
      subscription: user.subscription 
    });
  } else {
    res.status(400).json({ message: 'Invalid user data' });
  }
};

// POST /api/users/login
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !EMAIL_REGEX.test(email)) {
    return res.status(400).json({ message: 'Please provide a valid email address.' });
  }

  if (!password) {
    return res.status(400).json({ message: 'Password is required.' });
  }

  const user = await User.findOne({ email });
  
  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id);
    res.json({ 
      _id: user._id, 
      email: user.email, 
      role: user.role,
      subscription: user.subscription 
    });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
};

// POST /api/users/logout
export const logoutUser = (req, res) => {
  const isProd = process.env.NODE_ENV === 'production' || !!process.env.VERCEL;
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax'
  });
  res.status(200).json({ message: 'Logged out successfully' });
};

// GET /api/users/me (Protected)
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile' });
  }
};