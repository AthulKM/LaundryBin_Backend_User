import express from 'express';
import {
  createItem,
  getAllItems,
  getItemById,
  updateItemById,
  deleteItemById
} from '../controllers/itemController.js';
import upload from '../middlewares/uploadImage.js';

const router = express.Router();

router.post('/', upload.single('image'),createItem); // Create item
router.get('/', getAllItems); // Get all items
router.get('/:id', getItemById); // Get item by ID
router.put('/:id', upload.single('image'),updateItemById); // Update item by ID
router.delete('/:id', deleteItemById); // Delete item by ID

export default router;
