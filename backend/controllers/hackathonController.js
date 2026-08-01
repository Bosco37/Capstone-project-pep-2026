import Hackathon from '../models/Hackathon.js';
import Team from '../models/Team.js';
import Submission from '../models/Submission.js';

const getHackathons = async (req, res) => {
  const { search, mode, theme, status } = req.query;

  let query = {};

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }

  if (mode) {
    query.mode = mode;
  }

  if (theme) {
    query.theme = { $regex: theme, $options: 'i' };
  }

  if (status) {
    const now = new Date();
    if (status === 'Upcoming') {
      query.startDate = { $gt: now };
    } else if (status === 'Ongoing') {
      query.startDate = { $lte: now };
      query.endDate = { $gte: now };
    } else if (status === 'Completed') {
      query.endDate = { $lt: now };
    }
  }

  const hackathons = await Hackathon.find(query).populate('organizer', 'name email').sort({ startDate: 1 });
  res.json(hackathons);
};

const getHackathonById = async (req, res) => {
  const hackathon = await Hackathon.findById(req.params.id).populate('organizer', 'name email');

  if (hackathon) {
    res.json(hackathon);
  } else {
    res.status(404).json({ message: 'Hackathon not found' });
  }
};

const createHackathon = async (req, res) => {
  const {
    title,
    description,
    theme,
    mode,
    venue,
    startDate,
    endDate,
    registrationDeadline,
    prizePool,
    maximumTeamSize,
    rules,
    judgingCriteria,
  } = req.body;

  const hackathon = new Hackathon({
    organizer: req.user._id,
    title,
    description,
    theme,
    mode,
    venue: mode === 'Offline' ? venue : undefined,
    startDate,
    endDate,
    registrationDeadline,
    prizePool,
    maximumTeamSize,
    rules,
    judgingCriteria,
  });

  const createdHackathon = await hackathon.save();
  res.status(201).json(createdHackathon);
};

const updateHackathon = async (req, res) => {
  const hackathon = await Hackathon.findById(req.params.id);

  if (hackathon) {
    if (hackathon.organizer.toString() !== req.user._id.toString() && req.user.role !== 'Administrator') {
      return res.status(403).json({ message: 'Not authorized to update this hackathon' });
    }

    Object.assign(hackathon, req.body);
    const updatedHackathon = await hackathon.save();
    res.json(updatedHackathon);
  } else {
    res.status(404).json({ message: 'Hackathon not found' });
  }
};

const deleteHackathon = async (req, res) => {
  const hackathon = await Hackathon.findById(req.params.id);

  if (hackathon) {
    if (hackathon.organizer.toString() !== req.user._id.toString() && req.user.role !== 'Administrator') {
      return res.status(403).json({ message: 'Not authorized to delete this hackathon' });
    }

    // Cascading delete: remove all teams and submissions associated with this hackathon
    await Team.deleteMany({ hackathon: req.params.id });
    await Submission.deleteMany({ hackathon: req.params.id });

    await hackathon.deleteOne();
    res.json({ message: 'Hackathon and associated data removed' });
  } else {
    res.status(404).json({ message: 'Hackathon not found' });
  }
};

export {
  getHackathons,
  getHackathonById,
  createHackathon,
  updateHackathon,
  deleteHackathon,
};
