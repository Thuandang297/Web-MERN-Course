import orderModel from "../models/order.js";

const orderController = {
    getOrdersByCusId: async (req, res) => {
        try {
            const cusId = req.params.customerId
            const response = await orderModel.find({ customerId: cusId });
            res.status(200).send({ message: "Oke", data: response })
        } catch (error) {

        }
    },
    getHighestOrder: async (req, res) => {
        try {
            const response = await orderModel.find({ totalPrice: { $gte: 10000000 } })
            res.status(200).send({ message: 'Get highest order success!', data: response, success: true })
        } catch (error) {

        }
    },
    create: async (req, res) => {
        try {
            const { customerId, productId, quanlity, totalPrice } = req.body
            const orderData = {
                customerId,
                productId,
                quanlity,
                totalPrice,
            }
            const createdOrder = await orderModel.create(orderData);
            return res.status(201).send({
                data: createdOrder,
                message: 'Created order successful!',
                success: true
            });
        } catch (error) {
            return res.status(403).send({
                data: null,
                message: 'False!',
                success: true
            });
        }
    }
}

export default orderController;