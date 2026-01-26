import customerController from "../controllers/customer.js"
import express from 'express';

const router = express.Router();

router.get('/', customerController.getAll)
router.get('/:id', customerController.getOne)
router.post('/', customerController.create);
router.put('/:id', customerController.update)
router.delete('/:id', customerController.delete)

export default router;