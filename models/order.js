import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true }],
  category: {type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true},
  totalAmount: { type: Number, required: true },
  paymentMethod: { type: String, required: true },
  deliveryAddress: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  orderStatus: {
    type: String,
    enum: ['In Progress', 'Completed', 'Canceled'], // Restricts the values to these options
    default: 'In Progress',  // Default value when a new order is created
  },
});

const Order = mongoose.model('Order', orderSchema);

export default Order;
