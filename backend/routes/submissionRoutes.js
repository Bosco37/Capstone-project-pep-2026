import express from 'express';
import {
  createSubmission,
  getSubmissions,
  evaluateSubmission,
  getLeaderboard
} from '../controllers/submissionController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, authorize('Participant'), createSubmission)
  .get(protect, authorize('Judge', 'Administrator', 'Organizer'), getSubmissions);

router.route('/:id/evaluate')
  .put(protect, authorize('Judge', 'Administrator'), evaluateSubmission);

router.route('/leaderboard/:hackathonId')
  .get(getLeaderboard);

export default router;
