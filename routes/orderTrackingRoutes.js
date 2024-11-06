// routes/orderTrackingRoutes.js
import express from 'express';
import {
  createTrackingRecord,
  getTrackingRecord,
  updateTrackingRecord,
  deleteTrackingRecord
} from '../controllers/orderTrackingController.js';

const router = express.Router();

router.post('/', createTrackingRecord);
router.get('/:id', getTrackingRecord);
router.put('/:id', updateTrackingRecord);
router.delete('/:id', deleteTrackingRecord);

export default router;
