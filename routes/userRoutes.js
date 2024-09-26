import express from 'express';
import { registerUser, loginUser, updateUser, deleteUser, getAllUsers, getUserById } from '../controllers/userController.js';
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.put('/:id', updateUser);   
router.delete('/:id', deleteUser);  

export default router;