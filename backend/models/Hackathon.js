import mongoose from 'mongoose';

const hackathonSchema = mongoose.Schema(
  {
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    theme: {
      type: String,
      required: true,
    },
    mode: {
      type: String,
      enum: ['Online', 'Offline'],
      required: true,
    },
    venue: {
      type: String,
      required: function() { return this.mode === 'Offline'; },
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    registrationDeadline: {
      type: Date,
      required: true,
    },
    prizePool: {
      type: Number,
      required: true,
    },
    maximumTeamSize: {
      type: Number,
      required: true,
    },
    rules: {
      type: String,
      required: true,
    },
    judgingCriteria: {
      type: String,
      required: true,
    },
    bannerImage: {
      type: String, // URL to image
    },
  },
  {
    timestamps: true,
  }
);

const Hackathon = mongoose.model('Hackathon', hackathonSchema);

export default Hackathon;
