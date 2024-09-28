import express from 'express';
import {
  createItem,
  getAllItems,
  getItemById,
  updateItemById,
  deleteItemById
} from '../controllers/itemController.js';

const router = express.Router();

router.post('/', createItem); // Create item
router.get('/', getAllItems); // Get all items
router.get('/:id', getItemById); // Get item by ID
router.put('/:id', updateItemById); // Update item by ID
router.delete('/:id', deleteItemById); // Delete item by ID

export default router;
