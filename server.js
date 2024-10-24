import express from 'express';
import dotenv from 'dotenv';
import connectDB from './database/connectDB.js';

import cors from 'cors';
import user from './routes/userRoutes.js';
import item from './routes/itemRoutes.js';
import otpRoutes from './routes/otpRoutes.js';
import instructionRoutes from './routes/instructionRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';



dotenv.config();

const app = express();
const PORT = process.env.PORT || 8004;

app.use(express.json());

// Allow specific origins
const allowedOrigins = ['http://localhost:5173', 'http://localhost:5174'];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true // Enable cookies/sessions if required
}));

app.get('/', (req, res) => {
    res.send("Welcome to LaundryBinApp API for users");
});

connectDB();

app.use('/api/user', user);
// app.use('/api/cart', cart);
// app.use('/api/wishList', wishList);

app.use('/api/user', otpRoutes);
app.use('/api/items', item);
app.use('/api/instructions', instructionRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});