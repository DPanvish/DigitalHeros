import Score from './score.model.js';

// POST /api/scores
export const addScore = async (req, res) => {
  try {
    const { points, date } = req.body;

    if (points < 1 || points > 45) {
      return res.status(400).json({ message: 'Score must be between 1 and 45' });
    }

    await Score.create({ user: req.user._id, points, date });

    const userScores = await Score.find({ user: req.user._id }).sort({ date: -1 });
    
    if (userScores.length > 5) {
      const scoresToDelete = userScores.slice(5).map(score => score._id);
      await Score.deleteMany({ _id: { $in: scoresToDelete } });
    }

    const updatedScores = await Score.find({ user: req.user._id }).sort({ date: -1 });
    res.status(201).json(updatedScores);

  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'A score for this date already exists' });
    }
    res.status(500).json({ message: 'Server error while adding score' });
  }
};

// GET /api/scores
export const getScores = async (req, res) => {
  try {
    const scores = await Score.find({ user: req.user._id }).sort({ date: -1 });
    res.status(200).json(scores);
  } catch (error) {
    res.status(500).json({ message: 'Server error while fetching scores' });
  }
};

// PUT /api/scores/:id
export const updateScore = async (req, res) => {
  try {
    const { points } = req.body;
    if (points < 1 || points > 45) {
      return res.status(400).json({ message: 'Score must be between 1 and 45' });
    }

    const score = await Score.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { points },
      { new: true }
    );

    if (!score) return res.status(404).json({ message: 'Score not found' });
    res.status(200).json(score);
  } catch (error) {
    res.status(500).json({ message: 'Server error while updating score' });
  }
};