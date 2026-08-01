import mongoose from 'mongoose';

const teamSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    leader: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    hackathon: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Hackathon',
    },
  },
  {
    timestamps: true,
  }
);

const Team = mongoose.model('Team', teamSchema);

export default Team;
