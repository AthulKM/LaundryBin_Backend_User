import express from 'express';
import {
  createInstruction,
  getAllInstructions,
  updateInstruction,
  deleteInstruction,
  getInstructionById
} from '../controllers/instructionController.js';

const router = express.Router();

// Routes for instructions
router.post('/', createInstruction);
router.get('/', getAllInstructions);
router.get('/:id', getInstructionById);
router.put('/:id', updateInstruction);
router.delete('/:id', deleteInstruction);

export default router;
