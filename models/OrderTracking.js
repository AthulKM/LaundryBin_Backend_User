
import mongoose from 'mongoose';

const orderTrackingSchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: ['Pending', 'In Progress', 'En route', 'Delivered', 'Canceled']
  },
  trackingDetails: [
    {
      status: String,
      timestamp: {
        type: Date,
        default: Date.now
      },
      location: String,
      note: String
    }
  ]
}, { timestamps: true });

const OrderTracking = mongoose.model('OrderTracking', orderTrackingSchema);

export default OrderTracking;
