import express, { Router } from 'express'
import orderController from '../controllers/order.js'

const router = Router();

router.post('/', orderController.create)

router.get('/highvalue',orderController.getHighestOrder)
export default router;