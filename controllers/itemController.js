
import Item from '../models/item.js';
import cloudinary from '../utils/cloudinary.js';
import { resetPassword } from './userController.js';



// Create a new Item
export const createItem = async (req, res) => {
  try {
      const { itemName, charge, count } = req.body;
      
      const existingItem = await Item.findOne({ itemName });

      if (existingItem) {
        return res.status(400).json({
            Message: "Item already exists",
            status: "Failed",
            error: true
        });
      }

      let imageUrl = '';
      if (req.file) {
          //   Upload image to Cloudinary
          const result = await cloudinary.uploader.upload(req.file.path, {
              folder: 'items',
              //   Optional: organize images in folders
              resource_type: 'image'
          });
          imageUrl = result.secure_url;
        //   Get the secure URL for the image
      }
    // Ensure required fields are provided
    if (!itemName || charge === undefined || count === undefined) {
      return res.status(400).json({ message: 'Item name, charge, and count are required.' });
    }

      const newItem = new Item({
          itemName,
          charge,
          count,
          image: imageUrl
        
    });
    await newItem.save();
      return res.status(201).json({
          message: 'Item created successfully',
          error: false,
          status: "Success",
          data: newItem
      });
  } catch (error) {
    console.error(error);
      return res.status(500).json({
          message: 'Server error, failed to create item.',
          error:true
      });
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
    const { itemName, charge, count,image } = req.body;
    const updatedData = {itemName, charge, count,image}
    


  if (req.file) {
    // Upload new image to Cloudinary (if file exists)
    const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'items',
        resource_type: 'image'
    });
    updatedData.image = result.secure_url;  // Store the new image URL
}  
    
  try {
    // Find item by ID and update
    const updatedItem = await Item.findByIdAndUpdate(
      id,
      updatedData,
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
