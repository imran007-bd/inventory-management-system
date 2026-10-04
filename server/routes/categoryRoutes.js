import express from 'express';
import { addCategory , getCategory ,updateCategory , deleteCategory} from '../controllers/categoryController.js';
import authMiddleware from "../middleware/authMiddleware.js";
import requireRole from "../middleware/roleMiddleware.js";


const router = express.Router();

router.post('/add', authMiddleware , requireRole('admin', 'manager') , addCategory );
router.get('/', authMiddleware , requireRole('admin', 'manager', 'inventory_staff') ,  getCategory);
router.put('/:id', authMiddleware , requireRole('admin', 'manager') ,  updateCategory);
router.delete('/:id', authMiddleware , requireRole('admin', 'manager') ,  deleteCategory);

export default router;