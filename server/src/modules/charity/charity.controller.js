import Charity from './charity.model.js';
import User from '../user/user.model.js';

// GET /api/charities
export const getCharities = async (req, res) => {
  try {
    const charities = await Charity.find({});
    res.status(200).json(charities);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching charities' });
  }
};

// GET /api/charities/featured
export const getFeaturedCharities = async (req, res) => {
  try {
    const featuredCharities = await Charity.find({ isFeatured: true });
    res.status(200).json(featuredCharities);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching featured charities' });
  }
};

// POST /api/charities (Admin Only)
export const createCharity = async (req, res) => {
  try {
    const charity = await Charity.create(req.body);
    res.status(201).json(charity);
  } catch (error) {
    res.status(400).json({ message: 'Invalid charity data' });
  }
};

// PUT /api/users/charity-preference (Updates User Schema)
export const updateCharityPreference = async (req, res) => {
  try {
    const { charityId, contributionPercentage } = req.body;

    if (contributionPercentage < 10) {
      return res.status(400).json({ message: 'Minimum contribution is 10%' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        charityPreferences: {
          charityId,
          contributionPercentage
        }
      },
      { new: true }
    ).select('-password');

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Error updating charity preferences' });
  }
};