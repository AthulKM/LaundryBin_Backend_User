
import OrderTracking from '../models/OrderTracking.js';

// Create a new tracking record
export const createTrackingRecord = async (req, res) => {
  try {
    const { orderId, status, trackingDetails } = req.body;
    const trackingRecord = new OrderTracking({ orderId, status, trackingDetails });
    await trackingRecord.save();
    res.status(201).json(trackingRecord);
  } catch (error) {
    res.status(500).json({ message: 'Error creating tracking record', error: error.message });
  }
};

// Get tracking record by ID
export const getTrackingRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const trackingRecord = await OrderTracking.findById(id).populate('orderId');
    if (!trackingRecord) return res.status(404).json({ message: 'Tracking record not found' });
    res.status(200).json(trackingRecord);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tracking record', error: error.message });
  }
};

// Update a tracking record
export const updateTrackingRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const trackingRecord = await OrderTracking.findByIdAndUpdate(id, updateData, { new: true });
    if (!trackingRecord) return res.status(404).json({ message: 'Tracking record not found' });
    res.status(200).json(trackingRecord);
  } catch (error) {
    res.status(500).json({ message: 'Error updating tracking record', error: error.message });
  }
};

// Delete a tracking record
export const deleteTrackingRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedRecord = await OrderTracking.findByIdAndDelete(id);
    if (!deletedRecord) return res.status(404).json({ message: 'Tracking record not found' });
    res.status(200).json({ message: 'Tracking record deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting tracking record', error: error.message });
  }
};
