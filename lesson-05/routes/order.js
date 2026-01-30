import express, { Router } from 'express'
import orderController from '../controllers/order.js'

const router = Router();

router.post('/', orderController.create)

export default router;