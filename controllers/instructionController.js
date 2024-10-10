import Instruction from '../models/instruction.js';

// Create new instruction
export const createInstruction = async (req, res) => {
  const { water, fabricSoftener, detergent, notes } = req.body;

  try {
    const newInstruction = new Instruction({
      water,
      fabricSoftener,
      detergent,
      notes
    });

    await newInstruction.save();

    return res.status(201).json({
        message: 'Instruction created successfully',
        error: false,
        status:"Success",
        data: newInstruction
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Server error, failed to create instruction',
      error: error.message
    });
  }
};

// Get all instructions
export const getAllInstructions = async (req, res) => {
    try {
      const instructions = await Instruction.find();
      return res.status(200).json({
        message: 'Instructions fetched successfully',
        data: instructions
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Server error, failed to fetch instructions',
        error: error.message
      });
    }
};
  
// Get an instruction by id
export const getInstructionById = async (req, res) => {
    
    const { id } = req.params;
    

    try {
        const existingInstruction = await Instruction.findById(id);
        
      return res.status(200).json({
          message: 'Instruction fetched successfully',
          status: "Success",
          error:"False",
        data: existingInstruction
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Server error, failed to fetch instructions',
        error: error.message
      });
    }
  };

  // Update an instruction by ID
export const updateInstruction = async (req, res) => {
    const { id } = req.params;
    const { water, fabricSoftener, detergent, notes } = req.body;
  
    try {
      const updatedInstruction = await Instruction.findByIdAndUpdate(
        id,
        { water, fabricSoftener, detergent, notes },
        { new: true, runValidators: true }
      );
  
      if (!updatedInstruction) {
        return res.status(404).json({ message: 'Instruction not found' });
      }
  
      return res.status(200).json({
        message: 'Instruction updated successfully',
        data: updatedInstruction
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Server error, failed to update instruction',
        error: error.message
      });
    }
  };

  // Delete an instruction by ID
export const deleteInstruction = async (req, res) => {
    const { id } = req.params;
  
    try {
      const deletedInstruction = await Instruction.findByIdAndDelete(id);
  
      if (!deletedInstruction) {
        return res.status(404).json({ message: 'Instruction not found' });
      }
  
      return res.status(200).json({
        message: 'Instruction deleted successfully'
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Server error, failed to delete instruction',
        error: error.message
      });
    }
  };
  