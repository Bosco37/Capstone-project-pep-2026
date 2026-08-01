import express from 'express';
import {
  getHackathons,
  getHackathonById,
  createHackathon,
  updateHackathon,
  deleteHackathon,
} from '../controllers/hackathonController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getHackathons)
  .post(protect, authorize('Organizer', 'Administrator'), createHackathon);

router.route('/:id')
  .get(getHackathonById)
  .put(protect, authorize('Organizer', 'Administrator'), updateHackathon)
  .delete(protect, authorize('Organizer', 'Administrator'), deleteHackathon);

export default router;
