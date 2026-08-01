import Team from '../models/Team.js';
import Hackathon from '../models/Hackathon.js';
import User from '../models/User.js';

const createTeam = async (req, res) => {
  const { name, hackathonId } = req.body;

  if (req.user.role !== 'Participant') {
    return res.status(403).json({ message: 'Only participants can create teams' });
  }

  const hackathon = await Hackathon.findById(hackathonId);
  if (!hackathon) {
    return res.status(404).json({ message: 'Hackathon not found' });
  }

  const teamExists = await Team.findOne({ name, hackathon: hackathonId });
  if (teamExists) {
    return res.status(400).json({ message: 'Team name already exists for this hackathon' });
  }

  const userTeamExists = await Team.findOne({
    hackathon: hackathonId,
    $or: [{ leader: req.user._id }, { members: req.user._id }]
  });

  if (userTeamExists) {
    return res.status(400).json({ message: 'You are already in a team for this hackathon' });
  }

  const team = new Team({
    name,
    leader: req.user._id,
    members: [req.user._id], // Leader is automatically a member
    hackathon: hackathonId,
  });

  const createdTeam = await team.save();
  res.status(201).json(createdTeam);
};

const getMyTeams = async (req, res) => {
  const teams = await Team.find({
    $or: [{ leader: req.user._id }, { members: req.user._id }]
  }).populate('hackathon', 'title mode venue startDate').populate('members', 'name email');
  
  res.json(teams);
};

const joinTeam = async (req, res) => {
  const team = await Team.findById(req.params.id);

  if (!team) {
    return res.status(404).json({ message: 'Team not found' });
  }

  if (req.user.role !== 'Participant') {
    return res.status(403).json({ message: 'Only participants can join teams' });
  }

  const userTeamExists = await Team.findOne({
    hackathon: team.hackathon,
    $or: [{ leader: req.user._id }, { members: req.user._id }]
  });

  if (userTeamExists) {
    return res.status(400).json({ message: 'You are already in a team for this hackathon' });
  }

  const hackathon = await Hackathon.findById(team.hackathon);
  
  if (team.members.length >= hackathon.maximumTeamSize) {
    return res.status(400).json({ message: 'Team is full' });
  }

  team.members.push(req.user._id);
  await team.save();

  res.json({ message: 'Successfully joined team', team });
};

export {
  createTeam,
  getMyTeams,
  joinTeam
};
