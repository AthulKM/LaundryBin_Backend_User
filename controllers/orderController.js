import Order from '../models/order.js';

// Create a new order
export const createOrder = async (req, res) => {
  try {
    const { user, items, category, totalAmount, paymentMethod, deliveryAddress } = req.body;

    const newOrder = new Order({
        user,
        items,
        category,
        totalAmount,
        paymentMethod,
        deliveryAddress
        
    });

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all orders
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('user', 'name email');
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single order by ID
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (order) {
      res.status(200).json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update an order (mark as paid or delivered)
export const updateOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
        order.isPaid = req.body.isPaid || order.isPaid;
        order.paidAt = req.body.isPaid ? Date.now() : order.paidAt;
        order.isDelivered = req.body.isDelivered || order.isDelivered;
        order.deliveredAt = req.body.isDelivered ? Date.now() : order.deliveredAt;
        
        // Ensure the new status is one of the allowed values
    if (!['In Progress', 'Completed', 'Canceled'].includes(orderStatus)) {
        return res.status(400).send({ message: 'Invalid order status' });
      }
        order.orderStatus = req.body.orderStatus;
        order.category = req.body.category;
      const updatedOrder = await order.save();
        res.status(200).json({ message:"Order has been updated successfully", data:updatedOrder });
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};



// Delete an order
export const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      await order.remove();
      res.status(200).json({ message: 'Order deleted' });
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


