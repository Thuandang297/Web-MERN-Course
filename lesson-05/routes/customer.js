import customerController from "../controllers/customer.js"
import express from 'express';
import orderController from "../controllers/order.js";

const router = express.Router();

router.get('/', customerController.getAll)
router.get('/:id', customerController.getOne)
router.post('/', customerController.create);
router.put('/:id', customerController.update)
router.delete('/:id', customerController.delete)

//Get order of customer by customerId
router.get('/:customerId/orders',orderController.getOrdersByCusId )

export default router;