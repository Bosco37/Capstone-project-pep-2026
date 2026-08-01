import mongoose from 'mongoose';

const submissionSchema = mongoose.Schema(
  {
    team: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Team',
    },
    hackathon: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Hackathon',
    },
    projectName: {
      type: String,
      required: true,
    },
    problemStatement: {
      type: String,
      required: true,
    },
    solution: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    githubRepository: {
      type: String,
      required: true,
    },
    liveDemoUrl: {
      type: String,
    },
    techStack: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Under Review', 'Approved', 'Rejected'],
      default: 'Pending',
    },
    score: {
      type: Number,
      default: 0,
    },
    feedback: {
      type: String,
    },
    judgedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }
  },
  {
    timestamps: true,
  }
);

const Submission = mongoose.model('Submission', submissionSchema);

export default Submission;
