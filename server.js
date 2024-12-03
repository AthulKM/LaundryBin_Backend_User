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
import notificationRoutes from './routes/notificationRoutes.js';
import orderTrackingRoutes from './routes/orderTrackingRoutes.js';



dotenv.config();

const app = express();
const PORT = process.env.PORT || 8004;

app.use(express.json());

// Allow specific origins
const allowedOrigins = ['https://laundrybinapp.netlify.app','https://laundrybin.netlify.app','http://localhost:5173', 'https://localhost:5174'];

// Allow CORS from Netlify frontend
const corsOptions = {
  origin:
    // 'http://localhost:5173',
  'https://laundrybinapp.netlify.app', // Allow only frontend's URL
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // Include cookies or authentication headers
};

app.use(cors(corsOptions));

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
app.use('/api/notifications', notificationRoutes);
app.use('/api/orderTracking', orderTrackingRoutes);


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});