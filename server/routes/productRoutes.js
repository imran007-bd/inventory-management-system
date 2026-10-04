import express from 'express';
import { addProduct, getProduct, updateProduct, deleteProduct } from '../controllers/productController.js';
import authMiddleware from "../middleware/authMiddleware.js";
import requireRole from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post('/add', authMiddleware, requireRole('admin', 'manager', 'inventory_staff'), addProduct);
router.get('/', authMiddleware, requireRole('admin', 'manager', 'inventory_staff'), getProduct);
router.put('/:id', authMiddleware, requireRole('admin', 'manager', 'inventory_staff'), updateProduct);
router.delete('/:id', authMiddleware, requireRole('admin', 'manager'), deleteProduct);

export default router;
