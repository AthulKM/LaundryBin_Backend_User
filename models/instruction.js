import mongoose from 'mongoose';

const instructionSchema = new mongoose.Schema({
  water: {
    type: String,
    enum: ['Hot', 'Cold'],
    required: true
  },
  fabricSoftener: {
    type: String,
    enum: ['Yes', 'No'],
    required: true
  },
  detergent: {
    type: String,
    enum: ['Scented', 'Normal'],
    required: true
  },
  notes: {
    type: String
  }
}, { timestamps: true });

const Instruction = mongoose.model('Instruction', instructionSchema);

export default Instruction;
