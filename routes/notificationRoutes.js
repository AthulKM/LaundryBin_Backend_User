// routes/notificationRoutes.js
import express from 'express';
import {
  createNotification,
  getNotificationsByUser,
  updateNotification,
  deleteNotification,
  getNotificationById,
} from '../controllers/notificationController.js';
const router = express.Router();

router.post('/', createNotification);
router.get('/:userId', getNotificationsByUser);
router.put('/:id', updateNotification);
router.get('/notification/:id', getNotificationById);
router.delete('/:id', deleteNotification);

export default router;
