import { Router } from "express";
import productController from "../controllers/product.js";

const productRouter = Router()

productRouter.get('/', productController.getProductByPriceRange)

export default productRouter