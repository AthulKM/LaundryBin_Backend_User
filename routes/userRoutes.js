import express from 'express';
import { registerUser, loginUser, updateUser, deleteUser, getAllUsers, getUserById, forgotPassword, resetPassword } from '../controllers/userController.js';
import { createPaymentIntent } from '../controllers/paymentController.js';
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.put('/:id', updateUser);   
router.delete('/:id', deleteUser);  
router.post('/payment-intent', createPaymentIntent);

export default router;