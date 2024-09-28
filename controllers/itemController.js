
import Item from '../models/item.js';

// Create a new Item
export const createItem = async (req, res) => {
  try {
    const { itemName, charge, count } = req.body;

    // Ensure required fields are provided
    if (!itemName || charge === undefined || count === undefined) {
      return res.status(400).json({ message: 'Item name, charge, and count are required.' });
    }

    const newItem = new Item({ itemName, charge, count });
    await newItem.save();
    return res.status(201).json({ message: 'Item created successfully', data: newItem });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error, failed to create item.' });
  }
};

// Retrieve all Items
export const getAllItems = async (req, res) => {
  try {
      const items = await Item.find();
      if (items.length == 0) {
          return res.status(200).json({
              message: 'No items found !, add some items',
              
          });
      }
    return res.status(200).json({ message: 'Items fetched successfully', data: items });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error, failed to fetch items.' });
  }
};

// Retrieve a single Item by ID
export const getItemById = async (req, res) => {
  const { id } = req.params;

  try {
    const item = await Item.findById(id);
    
    if (!item) {
      return res.status(404).json({ message: 'Item not found.' });
    }
    
    return res.status(200).json({ message: 'Item fetched successfully', data: item });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error, failed to fetch item.' });
  }
};

// Update an existing Item by ID
export const updateItemById = async (req, res) => {
  const { id } = req.params;
  const { itemName, charge, count } = req.body;

  try {
    // Find item by ID and update
    const updatedItem = await Item.findByIdAndUpdate(
      id,
      { itemName, charge, count },
      { new: true, runValidators: true }
    );
    
    if (!updatedItem) {
      return res.status(404).json({ message: 'Item not found.' });
    }

    return res.status(200).json({ message: 'Item updated successfully', data: updatedItem });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error, failed to update item.' });
  }
};

// Delete an Item by ID
export const deleteItemById = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedItem = await Item.findByIdAndDelete(id);
    
    if (!deletedItem) {
      return res.status(404).json({ message: 'Item not found.' });
    }
    
    return res.status(200).json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error, failed to delete item.' });
  }
};
