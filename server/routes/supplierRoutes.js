import express from 'express';
import authMiddleware from "../middleware/authMiddleware.js";
import requireRole from "../middleware/roleMiddleware.js";
import { addSupplier, getSupplier, updateSupplier, deleteSupplier } from '../controllers/supplierController.js';



const router = express.Router();

router.post('/add', authMiddleware , requireRole('admin', 'manager') , addSupplier );
router.get('/', authMiddleware , requireRole('admin', 'manager', 'inventory_staff') ,  getSupplier);
router.put('/:id', authMiddleware , requireRole('admin', 'manager') ,  updateSupplier);
router.delete('/:id', authMiddleware , requireRole('admin', 'manager') ,  deleteSupplier);

export default router;