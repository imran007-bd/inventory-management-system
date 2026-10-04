import express from 'express';
import {
  addPurchaseOrder,
  getPurchaseOrders,
  updatePurchaseOrder,
  deletePurchaseOrder,
} from '../controllers/purchaseOrderController.js';
import authMiddleware from "../middleware/authMiddleware.js";
import requireRole from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post('/add', authMiddleware, requireRole('admin', 'manager'), addPurchaseOrder);
router.get('/', authMiddleware, requireRole('admin', 'manager'), getPurchaseOrders);
router.put('/:id', authMiddleware, requireRole('admin', 'manager'), updatePurchaseOrder);
router.delete('/:id', authMiddleware, requireRole('admin', 'manager'), deletePurchaseOrder);

export default router;
