import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        //unique: true,
        sparse: true, // allows the field to be unique but optional
        match: [/.+\@.+\..+/, 'Please enter a valid email address'],
    },
    phoneNumber: {
        type: String, // Changed from Number to String for flexibility
        //unique: true,
        sparse: true, // allows the field to be unique but optional
        match: [/^\d{10}$/, 'Please enter a valid 10-digit phone number'],
    },
    username: {
        type: String,
        required: true,
        
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['user', 'admin'], // Only 'user' and 'admin' are allowed
        default: 'user', // Default role is 'user'
    },
}, {
    timestamps: true,
});

// Ensure at least one of email or phoneNumber is provided
userSchema.pre('save', function(next) {
  if (!this.email && !this.phoneNumber) {
    return next(new Error('At least one contact method (email or phone number) is required.'));
  }
  next();
});

// Sync indexes to ensure unique and sparse constraints are applied
userSchema.post('init', async function() {
    await this.constructor.syncIndexes();
});

const User = mongoose.model('User', userSchema);
export default User;