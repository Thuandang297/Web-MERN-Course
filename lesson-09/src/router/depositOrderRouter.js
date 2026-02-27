import express from 'express';
import { authMiddleware, roleMiddleware } from '../middlewares/auth.js';
import {
    createDepositOrder,
    getDepositOrdersWithCustomerInfo,
    getCustomerDepositOrders,
    getAllDepositOrders
} from '../controller/depositOrderController.js';

const depositOrderRouter = express.Router();

// API 12: Customer views their own deposit orders - MUST come before generic routes
depositOrderRouter.get('/my-orders', authMiddleware, roleMiddleware(['CUSTOMER']), getCustomerDepositOrders);

// API 11: Manager or Employee gets deposit orders with customer information
depositOrderRouter.get('/staff', authMiddleware, roleMiddleware(['MANAGER', 'EMPLOYEE']), getDepositOrdersWithCustomerInfo);

// API 14: Manager views all deposit orders - MUST come before POST (more specific)
depositOrderRouter.get('/all', authMiddleware, roleMiddleware(['MANAGER']), getAllDepositOrders);

// API 10: Customer creates a deposit order
depositOrderRouter.post('/', authMiddleware, roleMiddleware(['CUSTOMER']), createDepositOrder);

export default depositOrderRouter;
