import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
    itemName: {
        type: String,
        enum: ['Shirt', 'T-Shirt', 'Pants', 'Shorts', 'Skirt', 'Jacket', 'Jeans', 'Hoodie'],
        default: 'Shirt',
        required: true
    },
    image: {
        type: String
    },
    charge: {
        type: Number,  
        required: true, 
        min: 0   
    },
    count: {
        type: Number,
        required: true,
        min: 0, 
        default: 1 
    }
}, {
    timestamps: true, 
});

const Item = mongoose.model('Item', itemSchema);

export default Item;
