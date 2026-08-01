import express from 'express';
import {
  createTeam,
  getMyTeams,
  joinTeam
} from '../controllers/teamController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, authorize('Participant'), createTeam);

router.route('/myteams')
  .get(protect, getMyTeams);

router.route('/:id/join')
  .post(protect, authorize('Participant'), joinTeam);

export default router;
