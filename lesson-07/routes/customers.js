import express from 'express'
import customerController from '../controllers/customers.js'

const customerRouter = express.Router();

//Tạo mới một người dùng
customerRouter.post('/', customerController.create)

customerRouter.post('/login', customerController.login)

export default customerRouter;