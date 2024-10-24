import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  stars: { 
    type: Number, 
    required: true, 
    enum: [1, 2, 3, 4, 5] 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  reviewMessage: { 
    type: String, 
    required: true 
  }
});

const Review = mongoose.model('Review', reviewSchema);
export default Review;
