import Submission from '../models/Submission.js';
import Team from '../models/Team.js';
import Hackathon from '../models/Hackathon.js';

const createSubmission = async (req, res) => {
  const { teamId, hackathonId, projectName, problemStatement, solution, description, githubRepository, liveDemoUrl, techStack } = req.body;

  if (req.user.role !== 'Participant') {
    return res.status(403).json({ message: 'Only participants can submit projects' });
  }

  const team = await Team.findById(teamId);
  if (!team || team.leader.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Only team leaders can submit projects' });
  }

  const submissionExists = await Submission.findOne({ team: teamId, hackathon: hackathonId });
  if (submissionExists) {
    return res.status(400).json({ message: 'Team has already submitted a project for this hackathon' });
  }

  const submission = new Submission({
    team: teamId,
    hackathon: hackathonId,
    projectName,
    problemStatement,
    solution,
    description,
    githubRepository,
    liveDemoUrl,
    techStack,
  });

  const createdSubmission = await submission.save();
  res.status(201).json(createdSubmission);
};

const getSubmissions = async (req, res) => {
  const submissions = await Submission.find({})
    .populate('team', 'name')
    .populate('hackathon', 'title');
  res.json(submissions);
};

const evaluateSubmission = async (req, res) => {
  const { score, feedback } = req.body;

  if (req.user.role !== 'Judge' && req.user.role !== 'Administrator') {
    return res.status(403).json({ message: 'Not authorized to evaluate submissions' });
  }

  const submission = await Submission.findById(req.params.id);

  if (submission) {
    submission.score = score;
    submission.feedback = feedback;
    submission.status = 'Under Review'; // Or 'Approved' depending on workflow
    submission.judgedBy = req.user._id;

    const updatedSubmission = await submission.save();
    res.json(updatedSubmission);
  } else {
    res.status(404).json({ message: 'Submission not found' });
  }
};

const getLeaderboard = async (req, res) => {
  const submissions = await Submission.find({ 
    hackathon: req.params.hackathonId,
    score: { $gt: 0 } // Only show evaluated submissions
  })
    .sort({ score: -1 }) // Sort descending by score
    .populate('team', 'name');

  res.json(submissions);
};

export {
  createSubmission,
  getSubmissions,
  evaluateSubmission,
  getLeaderboard
};
