import productModal from "../models/product.js";

const productController = {
    getProductByPriceRange: async (req, res) => {
        try {
            const { minPrice, maxPrice } = req.query
            if (!minPrice || !maxPrice) {
                const response = await productModal.find({})
                res.status(200).send({ message: "success", data: response, success: true })
            }
            const response = await productModal.find({ price: { $gte: minPrice, $lte: maxPrice } })
            res.status(200).send({ message: "success", data: response, success: true })
        } catch (error) {
            res.status(403).send({ message: "fail", error: error.message, success: false })

        }
    }
}

export default productController;