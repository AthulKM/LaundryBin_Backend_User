
import Notification  from '../models/notification.js';

// Create notification
export const createNotification = async (req, res) => {
  try {
    const notification = new Notification(req.body);
    await notification.save();
    res.status(201).json({ status: 'Success', notification });
  } catch (error) {
    res.status(400).json({ status: 'Error', message: error.message });
  }
};

// Get all notifications for a user
export const getNotificationsByUser = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.params.userId });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ status: 'Error', message: error.message });
  }
};

// Get a notification by its id

export const getNotificationById = async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);
        res.json({ status: "success", data: notification });
    } catch (error) {
        res.status(500).json({ status: 'Error', message: error.message });
    }
}

// Update notification status to "read"
export const updateNotification = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { status: 'read' },
      { new: true }
    );
    res.json(notification);
  } catch (error) {
    res.status(500).json({ status: 'Error', message: error.message });
  }
};

// Delete notification
export const deleteNotification = async (req, res) => {
  try {
    await Notification.findByIdAndDelete(req.params.id);
    res.json({ status: 'Success', message: 'Notification deleted' });
  } catch (error) {
    res.status(500).json({ status: 'Error', message: error.message });
  }
};
