import mongoose from "mongoose";

const orderSchema = mongoose.Schema({
    customerId:String,
    productId:String,
    quanlity:Number,
    totalPrice:Number,
})

const orderModel = mongoose.model('order', orderSchema);
export default orderModel;